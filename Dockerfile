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
    apt-get install -y build-essential && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_4.x | bash - && \
    apt-get install -y nodejs && \    
    apt-get install -y npm
    
RUN npm install && \
    npm install ./app && \
    npm install forever -g && \
    npm install imagemin-jpegtran -g && \
    npm install gulp -g && \
    npm install gulp --save-dev

CMD NEW_RELIC_LOG=$NEW_RELIC_LOG NODE_ENV=$NODE_ENV PORT=$PORT forever app/bin/www --pidFile /pids/forever.pid --uid NODE_ENV_player

EXPOSE $PORT