#!/bin/sh

./create-update-message.sh > ./update-message.txt

nsupdate -k samisdat-ddns-key.private -v update-message.txt
cp ./update-message.txt ./update-message.txt.old
echo "Update done"

