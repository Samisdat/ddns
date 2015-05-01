#!/bin/bash
#
# Create all files for update zone by client and  tar tar them

#remove key if already there
rm -f ./Kddns_update*
#dnssec-keygen -a HMAC-MD5 -b 128 -r /dev/urandom -n USER DDNS_UPDATE

#fetch key
#KEY=$(cat Kddns_update*.private | grep Key | cut -d " " -f 2)
#sed -i "s@KEY@$KEY@g" /etc/bind/named.conf.local

KEY="FOO"

echo "key \"DDNS_UPDATE\" {
	algorithm hmac-md5;
	secret \"$KEY\";
};"


#echo $DYNDNSDOMAIN