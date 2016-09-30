FROM node:slim

ENV NODE_ENV production
ENV NEW_RELIC_LOG /logs/newrelic.log
ENV PORT 3002

RUN mkdir -p /app && \
    mkdir -p /pids && \
    mkdir -p /logs

WORKDIR /app

COPY . /app

RUN npm install && \
    npm install ./app && \
    npm install forever && \
    npm install imagemin-jpegtran && \
    npm install gulp

CMD NEW_RELIC_LOG=$NEW_RELIC_LOG NODE_ENV=$NODE_ENV PORT=$PORT forever app/bin/www --pidFile /pids/forever.pid --uid NODE_ENV_player

EXPOSE $PORT