#!/usr/bin/env bash
# Wait until Copilot finishes reviewing each PR, then print its unresolved threads.
# Usage: wait-copilot.sh <owner/repo> <number>...
# Exit: 0 when every open PR got a review, 1 when one timed out or had no request, 2 on bad usage or gh failures.
set -eo pipefail

BOT=copilot-pull-request-reviewer
POLL_SECS=30
# The request is added when the PR opens; if it is still missing after this, it never came.
NO_REQUEST_SECS=180
REVIEW_SECS=1200
MAX_ERRORS=3

if [ $# -lt 2 ] || [[ $1 != */* ]]; then
  echo "usage: $0 <owner/repo> <number>..." >&2
  exit 2
fi
OWNER=${1%%/*}
NAME=${1#*/}
shift

STATE_QUERY='query($owner:String!,$repo:String!,$number:Int!){
  repository(owner:$owner,name:$repo){ pullRequest(number:$number){
    state isDraft
    timelineItems(last:50, itemTypes:[REVIEW_REQUESTED_EVENT, PULL_REQUEST_REVIEW]){ nodes{
      __typename
      ... on ReviewRequestedEvent{ createdAt requestedReviewer{ ... on Bot{login} } }
      ... on PullRequestReview{ submittedAt state author{login} }
    } }
  } }
}'
# A review counts only when it is newer than the latest request, so a re-request waits again.
# GitHub timestamps are all UTC ISO 8601, so string order is time order.
STATE_JQ='.data.repository.pullRequest as $pr
  | if $pr.state != "OPEN" then ($pr.state | ascii_downcase)
    elif $pr.isDraft then "draft"
    else
      ([$pr.timelineItems.nodes[] | select(.__typename == "ReviewRequestedEvent" and .requestedReviewer.login == "'$BOT'") | .createdAt] | max) as $req
      | ([$pr.timelineItems.nodes[] | select(.__typename == "PullRequestReview" and .author.login == "'$BOT'" and .state != "PENDING") | .submittedAt] | max) as $rev
      | if $req == null then "no-request"
        elif $rev != null and $rev > $req then "done"
        else "reviewing" end
    end'

THREADS_QUERY='query($owner:String!,$repo:String!,$number:Int!){
  repository(owner:$owner,name:$repo){ pullRequest(number:$number){
    url
    reviewThreads(first:100){ nodes{
      id isResolved isOutdated path line originalLine
      comments(first:1){ nodes{ author{login} body url } }
    } }
  } }
}'
# Only threads Copilot started; a human thread is never shown as a Copilot comment.
THREADS_JQ='.data.repository.pullRequest as $pr
  | [$pr.reviewThreads.nodes[] | select((.isResolved | not) and .comments.nodes[0].author.login == "'$BOT'")] as $t
  | "## \($pr.url)",
    (if ($t | length) == 0 then "No open Copilot comments."
     else ($t | to_entries[] | .key as $i | .value
       | (.line // .originalLine) as $ln
       | "\n\($i + 1). \(.path)\(if $ln then ":\($ln)" else "" end)\(if .isOutdated then " (outdated)" else "" end)",
         "   thread: \(.id) · \(.comments.nodes[0].url)",
         "",
         .comments.nodes[0].body)
     end),
    ""'

gql() {
  gh api graphql -F owner="$OWNER" -F repo="$NAME" -F number="$1" -f query="$2" --jq "$3"
}

pending=("$@")
reviewed=()
failed=0
errors=0
start=$(date +%s)

while [ ${#pending[@]} -gt 0 ]; do
  elapsed=$(($(date +%s) - start))
  next=()
  for n in "${pending[@]}"; do
    if ! state=$(gql "$n" "$STATE_QUERY" "$STATE_JQ"); then
      errors=$((errors + 1))
      if [ $errors -ge $MAX_ERRORS ]; then
        echo "Stopped: gh failed $MAX_ERRORS times in a row." >&2
        exit 2
      fi
      next+=("$n")
      continue
    fi
    errors=0
    case $state in
      done) reviewed+=("$n") ;;
      no-request)
        if [ $elapsed -ge $NO_REQUEST_SECS ]; then
          echo "#$n: no Copilot review request."
          failed=1
        else
          next+=("$n")
        fi
        ;;
      reviewing)
        if [ $elapsed -ge $REVIEW_SECS ]; then
          echo "#$n: Copilot did not finish within $((REVIEW_SECS / 60)) minutes."
          failed=1
        else
          next+=("$n")
        fi
        ;;
      *) echo "#$n: skipped, the PR is $state." ;;
    esac
  done
  pending=(${next[@]+"${next[@]}"})
  [ ${#pending[@]} -gt 0 ] && sleep $POLL_SECS
done

for n in ${reviewed[@]+"${reviewed[@]}"}; do
  gql "$n" "$THREADS_QUERY" "$THREADS_JQ"
done

exit $failed
