FROM node:8-alpine

# install necessary packages
RUN apk update && \
    apk add \
      # let's add some real shells
      bash

# setup the app dir
RUN mkdir /app
WORKDIR /app

# add node_modules/.bin to the PATH
ENV PATH /app/node_modules/.bin:$PATH

# run a yarn install
COPY package.json package-lock.json ./
RUN \
  # install build dependencies
  apk add --no-cache --virtual .build-deps \
    # build tools
    build-base python && \
  # yarn install
  npm install && \
  # remove build packages
  apk del .build-deps

# copy the source
COPY . /app
