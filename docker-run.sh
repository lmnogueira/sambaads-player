#!/bin/bash

echo "Run as daemon (d) or interactive (it)?"
select ask2 in "d" "it"; do
  case $ask2 in
     d ) break;;
     it ) break;;
  esac  
done


echo "Select the node environment"

select ask1 in "local" "staging" "production"; do
  case $ask1 in
    local ) 
		CID="$(docker ps -qa --filter "name=local-player")"
		if [ -n "$CID" ]; then
	    	docker start $CID  && docker attach $CID
	    	docker ps -a
		else
	    	docker run -"$ask2" --name local-player -v "$PWD":/app -e "NODE_ENV=local_production" -p 3002:3002 ycontent/player:latest /bin/bash -c "cd ../app; npm install; cd app; npm install; cd ..; node app/bin/www & gulp";
		fi
	break;;

    staging ) docker run -"$ask2" -e "NODE_ENV=staging" -p 3002:3002 ycontent/player:staging; break;;
    production ) docker run -"$ask2" -e "NODE_ENV=production" -p 3002:3002 ycontent/player:production; break;;
  esac
done
