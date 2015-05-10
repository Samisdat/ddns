#!/bin/bash

######################################################################
#This is an example of using getopts in Bash. It also contains some
#other bits of code I find useful.
#Author: Linerd
#Website: http://tuxtweaks.com/
#Copyright 2014
#License: Creative Commons Attribution-ShareAlike 4.0
#http://creativecommons.org/licenses/by-sa/4.0/legalcode
######################################################################

#Set Script Name variable
SCRIPT=`basename ${BASH_SOURCE[0]}`

#Initialize variables to default values.
ACTION=0
NAMESERVER=0
DYNAMIC_DOMAIN=0
CONFIG_FILE=0
DOCKER_ID=0

#make help little nicer
#font-weight:normal
NORMAL=`tput sgr0`
#font-weight:bold
BOLD=`tput bold`

#Help function
function HELP {
cat << EOF
Supported params by ${BOLD}${SCRIPT}.${NORMAL}
-a  ${BOLD}a${NORMAL}action
-n  ${BOLD}n${NORMAL}ameserver
-d  ${BOLD}d${NORMAL}omain
-c  ${BOLD}c${NORMAL}onfig
-h  ${BOLD}h${NORMAL}elp
Example: ${BOLD}$SCRIPT -a foo -b man -c chu -d bar file.ext${NORMAL}
EOF
exit 1
}

#Check the number of arguments. If none are passed, print help and exit.
NUMARGS=$#
if [ $NUMARGS -eq 0 ]; then
  HELP
  exit 0;
fi

while getopts :a:n:i:d:c:h FLAG; do
  case $FLAG in
    a)  #set option "a"
      ACTION=$OPTARG
      ;;
    n)  #set option "a"
      NAMESERVER=$OPTARG
      echo "-a used: $OPTARG"
      echo "OPT_A = $OPT_A"
      ;;
    i)
      DOCKER_ID=$OPTARG
      echo "-id used: $OPTARG"
      echo "OPT_C = $OPT_C"
      ;;
    d)  #set option "b"
      DYNAMIC_DOMAIN=$OPTARG
      echo "-b used: $OPTARG"
      echo "OPT_B = $OPT_B"
      ;;
    c)  #set option "c"
      CONFIG_FILE=$OPTARG
      #echo "-c used: $OPTARG"
      #echo "OPT_C = $OPT_C"
      ;;
    h)  #show help
      DISPLAY_INFO
      exit 0;      
      ;;
    \?) #unrecognized option - show help
      echo -e \\n"Option -${BOLD}$OPTARG${NORM} not allowed."
      DISPLAY_INFO
      exit 0;
      #If you just want to display a simple error message instead of the full
      #help, remove the 2 lines above and uncomment the 2 lines below.
      #echo -e "Use ${BOLD}$SCRIPT -h${NORM} to see the help documentation."\\n
      #exit 2
      ;;
  esac
done

shift $((OPTIND-1))  #This tells getopts to move on to the next argument.

if [ $ACTION == 0 ]
	then
		echo "-a is mandatory"
		HELP
		exit 10;
fi

if [ $ACTION == 'create_config' ]; then
		if [ $NAMESERVER == 0 ]; then
			echo "use -n to define a nameserver"
			HELP
			exit 1;
		fi
		if [ $DYNAMIC_DOMAIN == 0 ]; then
			echo "use -d to define a domain"
			HELP
			exit 1;
		fi
		if [ $CONFIG_FILE == 0 ]; then
			echo "use -c to define a config file"
			HELP
			exit 1;
		fi

		if [ -f $CONFIG_FILE ]; then
			cat /dev/null > $CONFIG_FILE 
		else
			touch $CONFIG_FILE 
		fi

		echo "NAMESERVER: ${NAMESERVER}" >> $CONFIG_FILE 
		echo "DYNAMIC_DOMAIN: ${DYNAMIC_DOMAIN}" >> $CONFIG_FILE
fi

### End getopts code ###


### Main loop to process files ###

#This is where your main file processing will take place. This example is just
#printing the files and extensions to the terminal. You should place any other
#file processing tasks within the while-do loop.
#
#while [ $# -ne 0 ]; do
#  FILE=$1
#  TEMPFILE=`basename $FILE`
#  #TEMPFILE="${FILE##*/}"  #This is another way to get the base file name.
#  FILE_BASE=`echo "${TEMPFILE%.*}"`  #file without extension
#  FILE_EXT="${TEMPFILE##*.}"  #file extension
#
#
#  echo -e \\n"Input file is: $FILE"
#  echo "File withouth extension is: $FILE_BASE"
#  echo -e "File extension is: $FILE_EXT"\\n
#  shift  #Move on to next input file.
#done

### End main loop ###

exit 0