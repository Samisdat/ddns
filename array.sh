$

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

}

load_configs(){

for filename in /Users/samisdat/docker/dockerfiles/ddns/docker-ddns/config/*; do
    for ((i=0; i<=3; i++)); do
        echo "$filename"
    done
done

}

load_configs