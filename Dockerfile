FROM ubuntu

ENV NODE_ENV production
ENV NEW_RELIC_LOG /logs/newrelic.log
ENV PORT 3002

RUN mkdir -p /app && \
    mkdir -p /pids && \
    mkdir -p /logs

WORKDIR /base

COPY . /base

RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_4.x | bash - && \
    apt-get install -y nodejs && \
    apt-get install -y build-essential && \
    npm install && \
    npm install -g gulp && \
    npm install -g forever && \
    npm install -g imagemin-jpegtran && \
    npm install gulp --save-dev

RUN cd /base/app && \
    npm install && \
    cd /base

CMD gulp $NODE_ENV && NEW_RELIC_LOG=$NEW_RELIC_LOG NODE_ENV=$NODE_ENV PORT=$PORT forever app/bin/www --pidFile /pids/forever.pid --uid NODE_ENV_player

EXPOSE $PORT