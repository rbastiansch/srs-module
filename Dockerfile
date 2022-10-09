# We'll use the Node slim image as a base cos it's light and nice
FROM node:16-alpine

WORKDIR /usr/app

COPY package*.json ./
COPY .env.local .env

USER root

# Install the good ol' NPM modules and get Adonis CLI in the game
RUN npm i -g @adonisjs/lucid
RUN yarn install --no-optional

CMD yarn dev