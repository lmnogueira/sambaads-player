FROM ubuntu

ENV NEW_RELIC_LOG /logs/newrelic.log
ENV PORT 3002

RUN mkdir -p /app && \
    mkdir -p /pids && \
    mkdir -p /logs

WORKDIR /app

COPY . /app

RUN apt-get update && \
    apt-get install -y build-essential && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_4.x | bash - && \
    apt-get install -y nodejs

RUN npm install && \
    cd app && npm install && cd .. && \
    npm install -g gulp-cli && \
    npm install -g imagemin-jpegtran && \
    npm install -g forever

CMD gulp $NODE_ENV && NEW_RELIC_LOG=$NEW_RELIC_LOG NODE_ENV=$NODE_ENV PORT=$PORT forever app/bin/www --pidFile /pids/forever.pid --uid ${NODE_ENV}_player

EXPOSE $PORT
