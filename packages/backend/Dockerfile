FROM mhart/alpine-node:12

# Create app directory
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Install app dependencies
COPY package.json .
COPY yarn.lock .
COPY lerna.json .

COPY packages/backend/package.json ./packages/backend

RUN yarn global add lerna
RUN lerna bootstrap

COPY . .

WORKDIR /usr/src/app/packages/backend

EXPOSE 8080

CMD [ "yarn", "start" ]
