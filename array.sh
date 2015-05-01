read_config(){
	local  CONFIGFILE="$1"

	NAMESERVER=$(cat $CONFIGFILE | grep NAMESERVER | cut -d " " -f 2)
	DYNAMIC_DOMAIN=$(cat $CONFIGFILE | grep DYNAMIC_DOMAIN | cut -d " " -f 2)
	local my_list=("$NAMESERVER" "$DYNAMIC_DOMAIN")  
	echo "${my_list[@]}" 
}

load_configs(){

	for filename in /Users/samisdat/docker/dockerfiles/ddns/docker-ddns/config/*; do
    	#echo "$filename"
    	read_config $filename
		local result=( $(read_config $filename))

		echo "${result[0]} ${result[1]}" 
	done

}

load_configs
