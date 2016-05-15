[![Build Status](https://travis-ci.org/Samisdat/ddns.svg?branch=develop)](https://travis-ci.org/Samisdat/ddns)

[![Code Climate](https://codeclimate.com/github/Samisdat/ddns/badges/gpa.svg)](https://codeclimate.com/github/Samisdat/ddns)

[![Test Coverage](https://codeclimate.com/github/Samisdat/ddns/badges/coverage.svg)](https://codeclimate.com/github/Samisdat/ddns/coverage)


## Build with all dependies

docker run -d --name ddns samisdat/ddns

docker exec -it ddns bash 

./setup.sh -k -z -c
exit

docker cp CONTAINER:/ddns/client.tar HOSTPATH

cd HOSTPATH

tar xvf client.tar
cd client
./do-nsupdate.sh 
