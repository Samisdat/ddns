#!/bin/sh

# Usage info
show_help() {
cat << EOF
Usage: ${0##*/} [-h] [-c ns.example.de example.de] [FILE]...
Do stuff with FILE and write the result to standard output. With no FILE
or when FILE is -, read standard input.

    -h, -help          display this help and exit
    -c, -config          create configfile
    -cf OUTFILE  write the result to OUTFILE instead of standard output.
    -v          verbose mode. Can be used multiple times for increased
                verbosity.
EOF
}

create_config(){
	local NAMESERVER=$1
	local DYNAMIC_DOMAIN=$3

	echo $NAMESERVER
	echo $DYNAMIC_DOMAIN

}


# Initialize our own variables:
output_file=""
verbose=0

OPTIND=1 # Reset is necessary if getopts was used previously in the script.  It is a good idea to make this local in a function.
while getopts "helpexample-config:config" opt; do
    case "$opt" in
        h)
            show_help
            exit 0
            ;;
        help)
            show_help
            exit 0
            ;;
        c)
            create_config
            exit 0
            ;;
        config)
            create_config
            exit 0
            ;;
        '?')
            show_help >&2
            exit 1
            ;;
    esac
done
shift "$((OPTIND-1))" # Shift off the options and optional --.

printf 'verbose=<%d>\noutput_file=<%s>\nLeftovers:\n' "$verbose" "$output_file"
printf '<%s>\n' "$@"

# End of file
