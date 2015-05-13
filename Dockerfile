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
RUN chmod +x /ddns/server/start.sh
RUN chmod +x /ddns/server/setup.sh

WORKDIR /ddns/server

RUN cp /ddns/templates/logging /etc/bind/named.conf.logging
RUN mkdir /var/log/named/
RUN chown bind:bind /var/log/named/
RUN echo 'include "/etc/bind/named.conf.logging";' >> /etc/bind/named.conf

EXPOSE 53/udp
EXPOSE 53

CMD service bind9 restart && tail -F /var/log/named/bind.log


