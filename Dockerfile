FROM ubuntu

ENV NODE_ENV production
ENV NEW_RELIC_LOG /logs/newrelic.log
ENV PORT 3002

RUN mkdir -p /base && \
    mkdir -p /pids && \
    mkdir -p /logs

WORKDIR /base

COPY . /base

RUN apt-get update && \
    apt-get install -y build-essential nodejs npm