#!/bin/bash
gcloud auth activate-service-account --key-file=<(echo "$GCLOUD_SERVICE_ACCOUNT")
appcfg.py update --oauth2_access_token="$(gcloud auth print-access-token)" .
