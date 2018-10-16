FROM node:10

ENV APP_DIR /app
WORKDIR $APP_DIR

RUN useradd -m tvmaze && chown -R tvmaze .
USER tvmaze

COPY --chown=tvmaze package.json yarn.lock $APP_DIR/
RUN yarn install --no-progress --ignore-scripts --frozen-lockfile && yarn cache clean

COPY --chown=tvmaze . $APP_DIR

