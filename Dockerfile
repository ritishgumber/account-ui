#
# CloudBoost Dashbard Dockerfile
#
# Pull base image nodejs image.
FROM node:boron

#Maintainer.
MAINTAINER Nawaz Dhandala <nawazdhandala@outlook.com>


RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Expose ports.
#   - 1447: CloudBoost Accounts
EXPOSE 1447

#Run the app
CMD [ "npm", "start" ]
