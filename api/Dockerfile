FROM node:11.0.0

RUN mkdir /app
WORKDIR /app

COPY ./abi ./abi
COPY ./src ./src
COPY ./index.js ./index.js
COPY ./package*.json ./
RUN npm install

EXPOSE 8080
CMD npm start
