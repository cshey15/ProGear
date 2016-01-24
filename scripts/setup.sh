#!/bin/bash

# Basics
sudo yum install -y git
sudo yum install -y emacs


# Node
sudo curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
sudo yum install -y nodejs


# NPM
npm install -g bower
npm install -g grunt-cli
npm install -g forever
# npm install -g gulp ???

npm install
node server.js
