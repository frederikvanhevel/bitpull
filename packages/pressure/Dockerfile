FROM mhart/alpine-node:12

# Create app directory
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Install app dependencies
COPY package.json .
COPY yarn.lock .
COPY lerna.json .

COPY ./packages/pressure ./packages/pressure

RUN yarn install

WORKDIR /usr/src/app/packages/pressure

EXPOSE 8080

CMD [ "yarn", "start" ]
