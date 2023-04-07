# We'll use the Node slim image as a base cos it's light and nice
FROM node:18-alpine

WORKDIR /usr/app

COPY package*.json ./
COPY .env.local .env

USER root

# Install the good ol' NPM modules and get Adonis CLI in the game
RUN npm i -g @adonisjs/lucid
RUN yarn --no-optional

CMD yarn dev