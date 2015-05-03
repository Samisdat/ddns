FROM debian:jessie
MAINTAINER bastian.sackermann@gmail.com

RUN apt-get update
RUN apt-get update
RUN apt-get install -y bind9
RUN apt-get install -y dnsutils

RUN apt-get install -y vim

RUN mkdir /ddns

ADD samisdat-ddns.sh /ddns/samisdat-ddns.sh	
RUN chmod +x /ddns/samisdat-ddns.sh

add config /ddns/config
add templates /ddns/templates

WORKDIR /ddns

EXPOSE 53/udp
EXPOSE 53


