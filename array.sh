

my_algorithm() {
  local result=( $(create_array) )

    echo ${result[0]} ${result[1]}
}

create_array() {
  local my_list=("a" "b" "c")  
  echo "${my_list[@]}" 
}

my_algorithm


read_config(){
  echo "read_config";
  local my_list=("a" "b" "c")  
  echo "${my_list[@]}" 

}

load_configs(){

	for filename in /Users/samisdat/docker/dockerfiles/ddns/docker-ddns/config/*; do
    	echo "$filename"
		local result=( $(read_config) )
		echo "${result[1]}" 
	done

}

load_configs