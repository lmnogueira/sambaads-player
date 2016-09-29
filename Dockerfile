FROM ubuntu

ENV NODE_ENV production
ENV NEW_RELIC_LOG /logs/newrelic.log
ENV PORT 3002

RUN mkdir -p /app && \
    mkdir -p /pids && \
    mkdir -p /logs

WORKDIR /app

COPY . /app

RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_4.x | bash - && \
    apt-get install -y nodejs && \
    apt-get install -y build-essential && \
    npm install && \
    npm install app/ && \
    npm install -g gulp && \
    npm install -g forever && \
    npm install -g imagemin-jpegtran && \
    gulp $NODE_ENV

CMD NEW_RELIC_LOG=$NEW_RELIC_LOG NODE_ENV=$NODE_ENV PORT=$PORT forever app/bin/www --pidFile /pids/forever.pid --uid NODE_ENV_player

EXPOSE $PORT