#!/bin/bash
echo "Reading config...." >&2


CONFIGFILE="/Users/samisdat/docker/dockerfiles/ddns/docker-ddns/config/dev.pertz.eu"

#eval $(sed '/:/!d;/^ *#/d;s/:/ /;' < "$CONFIGFILE" | while read -r key val
#do
   #verify here
   #...
    str="$key='$val'"
    echo "$str"
done)
echo =$NAMESERVER= =$DYNAMIC_DOMAIN=  #here are defined


read_config(){

	CONFIGFILE="/Users/samisdat/docker/dockerfiles/ddns/docker-ddns/config/dev.pertz.eu"

	eval $(sed '/:/!d;/^ *#/d;s/:/ /;' < "$CONFIGFILE" | while read -r key val
	do
    	#verify here
    	#...
    	str="$key='$val'"
	done)
	echo $NAMESERVER 
	echo $DYNAMIC_DOMAIN

}

read_config
#read NAMESERVER DYNAMIC_DOMAIN < <(read_config)
#echo $NAMESERVER
#echo $DYNAMIC_DOMAIN

#calc()
#{
#  A=$1
#  B=$2
#  total=$(( A + B ))
#  diff=$(( A - B ))
#  echo "$total $diff"
#}
#read TOT DIF < <(calc 5 8)
#echo $TOT
#echo $DIF