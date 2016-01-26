#!/bin/bash

# mongo repo
sudo cat > /etc/yum.repos.d/mongodb-org-3.2.repo << EOF
[mongodb-org-3.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/7Server/mongodb-org/3.2/x86_64/
gpgcheck=0
enabled=1
EOF

# packages
sudo yum install -y mongodb-org

# selinux
sudo setenforce permissive

sudo cp mongod.conf /etc/mongod.conf
