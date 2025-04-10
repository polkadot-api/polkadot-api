#!/usr/bin/env bash
set -euo pipefail

set +e
i=0
until eval "$@"
do
  ((i++))
  if [ "$i" -gt 60 ]
  then
    echo "Waited too long."
    exit 1
  fi
  echo "Waiting..."
  sleep 3
done
