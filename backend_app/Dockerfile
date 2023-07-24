FROM node:17 as base

# Install dependencies
RUN apt-get update
# Set working directory
WORKDIR /var/www/app

COPY package*.json ./

EXPOSE 5000

RUN npm install

CMD npm install; npm run build; npm run start:dev
