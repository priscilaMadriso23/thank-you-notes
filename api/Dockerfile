FROM node:latest

RUN mkdir /app
WORKDIR /app

COPY ./index.js ./index.js
COPY ./package*.json ./
RUN npm install

EXPOSE 8080
CMD npm start
