FROM debian:jessie
MAINTAINER bastian.sackermann@gmail.com

RUN apt-get update
RUN apt-get update
RUN apt-get install -y bind9

RUN apt-get install -y vim

ADD start /start
RUN chmod 755 /start

EXPOSE 53/udp
EXPOSE 53


