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
