FROM node:slim

ENV NODE_ENV production
ENV NEW_RELIC_LOG /logs/newrelic.log
ENV PORT 3002

RUN mkdir -p /app && \
    mkdir -p /pids && \
    mkdir -p /logs

WORKDIR /app

COPY . /app

RUN npm set progress=false && \
    npm install --global --progress=false gulp bower npm-cache && \
    echo '{ "allow_root": true }' > /root/.bowerrc

RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN npm install && \
    npm install -g forever && \
    npm install -g imagemin-jpegtran

CMD gulp $NODE_ENV && NEW_RELIC_LOG=$NEW_RELIC_LOG NODE_ENV=$NODE_ENV PORT=$PORT forever app/bin/www --pidFile /pids/forever.pid --uid NODE_ENV_player

EXPOSE $PORT