FROM node:wheezy
MAINTAINER bastian.sackermann@gmail.com

RUN apt-get update
RUN apt-get install -y bind9
RUN apt-get install -y dnsutils

RUN apt-get install -y vim
RUN apt-get install -y git-core

RUN mkdir /ddns
WORKDIR /ddns/
RUN git clone https://github.com/Samisdat/docker-ddns.git --branch develop --single-branch /ddns/

RUN npm install -g grunt-cli
RUN npm install

RUN chmod +x /ddns/start.sh
    
EXPOSE 53/udp
EXPOSE 53

#CMD service bind9 restart && tail -F /var/log/named/bind.log


