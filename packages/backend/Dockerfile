FROM mhart/alpine-node:12

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Create app directory
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Install app dependencies
COPY package.json .
COPY yarn.lock .
COPY lerna.json .

COPY ./packages/backend ./packages/backend
COPY ./packages/worker ./packages/worker

RUN yarn install

WORKDIR /usr/src/app/packages/backend

EXPOSE 8080

CMD [ "yarn", "start" ]
