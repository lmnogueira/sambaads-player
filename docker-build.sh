#!/bin/bash
rm -rf node_modules
rm -rf app/node_modules
docker build --no-cache -t ycontent/player .