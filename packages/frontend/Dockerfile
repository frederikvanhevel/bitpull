FROM mhart/alpine-node:12

# Create app directory
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Install app dependencies
COPY package.json .
COPY yarn.lock .
COPY lerna.json .

COPY packages/frontend/package.json ./packages/frontend

RUN yarn global add lerna
RUN lerna bootstrap

COPY . .

WORKDIR /usr/src/app/packages/frontend

# Build
RUN yarn build:all

EXPOSE 8080

CMD [ "yarn", "start" ]