FROM debian:jessie
MAINTAINER bastian.sackermann@gmail.com

RUN apt-get update
RUN apt-get update
RUN apt-get install -y bind9

RUN apt-get install -y vim
RUN apt-get install -y bind9

RUN service bind9 stop

ADD db.dynamic_dns /etc/bind/db.dynamic_dns
RUN chown bind:bind /etc/bind/db.dynamic_dns
RUN chmod o+rw /etc/bind/db.dynamic_dns

RUN rm /etc/bind/named.conf.local
ADD named.conf.local /etc/bind/named.conf.local
RUN chown bind:bind /etc/bind/named.conf.local
RUN chmod o+rw /etc/bind/named.conf.local

RUN mkdir /ddns

ADD start /ddns/start	
RUN chmod 755 /ddns/start

WORKDIR /ddns

RUN ./start

EXPOSE 53/udp
EXPOSE 53


