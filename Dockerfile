FROM mhart/alpine-node:10.8.0

WORKDIR /usr/src
COPY package.json yarn.lock /usr/src/
RUN yarn install
COPY . /usr/src/
RUN yarn run test

RUN mkdir /public && echo "All tests passed!" > /public/index.txt
