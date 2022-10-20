FROM node:13.14.0-alpine

RUN apk update
RUN apk add --no-cache bash

WORKDIR /app
COPY . /app

RUN yarn

ENV NODE_ENV=production