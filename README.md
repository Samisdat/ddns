[![Build Status](https://travis-ci.org/Samisdat/ddns.svg?branch=develop)](https://travis-ci.org/Samisdat/ddns)

[![Code Climate](https://codeclimate.com/github/Samisdat/ddns/badges/gpa.svg)](https://codeclimate.com/github/Samisdat/ddns)

[![Test Coverage](https://codeclimate.com/github/Samisdat/ddns/badges/coverage.svg)](https://codeclimate.com/github/Samisdat/ddns/coverage)


## Build with all dependies

docker run -d --name ddns-grunt -p 53:53/tcp -p 53:53/udp  samisdat/ddns

docker exec -it ddns-grunt grunt server:init --ns ns.example.com --domain dev.example.com

docker exec -it ddns-grunt grunt client:create

docker cp ddns-grunt:/ddns/client.tar .

tar xvf client.tar
cd client
./do-nsupdate.sh 

dig @localhost dev.example.org +short

dig dev.example.org +short