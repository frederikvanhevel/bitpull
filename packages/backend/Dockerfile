FROM mhart/alpine-node:12

# Add git
RUN apk add --no-cache git

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 8080

CMD [ "yarn", "start" ]
