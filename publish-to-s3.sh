#!/usr/bin/env bash
DEFAULT="companyprofile"
PROFILE=${AWS_PROFILE:-$DEFAULT}
BUCKET=sambaads-development
DIR=build/
aws  s3  sync $DIR s3://$BUCKET/buid --profile "$PROFILE"
