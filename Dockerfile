FROM ubuntu:16.04
MAINTAINER Nicolay Thafvelin, nicolay@layup.io

RUN apt-get update
RUN apt-get dist-upgrade -y

RUN apt-get install -y curl
RUN apt-get install -y python-setuptools
RUN apt-get install -y build-essential 
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs 

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000
CMD [ "npm", "start" ]