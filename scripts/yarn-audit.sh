#!/bin/bash

yarn audit
exit_code=$?

echo "yarn audit exited with code $exit_code"

if [ $exit_code -eq 0 ]; then
  echo "No critical vulnerabilities found."
  exit 0
elif [ $exit_code -lt 8 ]; then
  echo "::warning::Moderate vulnerabilities found."
  exit 0
else
  echo "::error::Critical vulnerabilities found."
  exit 1
fi