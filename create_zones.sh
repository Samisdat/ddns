echo "Create Key";

rm -f ./Kddns_update*
dnssec-keygen -a HMAC-MD5 -b 128 -r /dev/urandom -n USER DDNS_UPDATE

echo "Add key to /etc/bind/named.conf.local"
KEY=$(cat Kddns_update*.private | grep Key | cut -d " " -f 2)
sed -i "s@KEY@$KEY@g" /etc/bind/named.conf.local

echo $DYNDNSDOMAIN