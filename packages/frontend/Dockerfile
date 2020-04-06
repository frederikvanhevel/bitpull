FROM mhart/alpine-node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY yarn.lock .
COPY lerna.json .

COPY ./packages/frontend ./packages/frontend
COPY ./packages/worker ./packages/worker

RUN yarn install

WORKDIR /usr/src/app/packages/frontend

ENV NODE_ENV=production

# Build
RUN yarn build:all

EXPOSE 8080

CMD [ "yarn", "start" ]