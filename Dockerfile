FROM debian:jessie
MAINTAINER bastian.sackermann@gmail.com

RUN apt-get update
RUN apt-get update
RUN apt-get install -y bind9
RUN apt-get install -y dnsutils

RUN apt-get install -y vim

RUN mkdir /ddns

#mkdir client in productive
ADD config /ddns/config

ADD templates /ddns/templates

ADD client /ddns/client

ADD server /ddns/server
RUN chmod +x /ddns/server/setup.sh

WORKDIR /ddns/server

EXPOSE 53/udp
EXPOSE 53


