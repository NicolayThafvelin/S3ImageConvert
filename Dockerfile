FROM alpine:edge
MAINTAINER Nicolay Thafvelin, nicolay@layup.io

RUN apk --update --no-progress add nodejs 
RUN apk add imagemagick --with-webp

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --production
RUN npm install -g forever

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000
CMD [ "forever", "app.js" ]