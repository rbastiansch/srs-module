# We'll use the Node slim image as a base cos it's light and nice
FROM node:16-alpine

WORKDIR /usr/app

COPY package*.json ./
COPY .env.example .env

USER root

# Install the good ol' NPM modules and get Adonis CLI in the game
RUN yarn install --no-optional

CMD yarn dev