# FROM ubuntu:14.04
# MAINTAINER Nicolay Thafvelin, nicolay@layup.io


# RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
# #Install nodejs
# RUN  apt-get install -y nodejs
# # Install Python Setuptools
# RUN apt-get install -y build-essential

# # Create app directory
# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app

# # Install app dependencies
# COPY package.json /usr/src/app/
# RUN npm install

# # Bundle app source
# COPY . /usr/src/app

# # Expose
# EXPOSE  3000

# # Run
# CMD [ "npm", "start" ]


FROM node:6.1.0

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