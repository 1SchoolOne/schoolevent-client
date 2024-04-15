#!/bin/bash

yarn audit

if [ $? -eq 0 ]; then
  echo "No critical vulnerabilities found."
  exit 0
elif [ $? -lt 8 ]; then
  echo "::warning Moderate vulnerabilities found."
  exit 0
else
  echo "::error Critical vulnerabilities found."
  exit 1
fi