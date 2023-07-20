FROM node:17 as base

RUN apt-get update
WORKDIR /var/www/app

COPY package*.json ./

CMD npm install; npx hardhat node --hostname 0.0.0.0
