#!/bin/bash

echo "Run as daemon (d) or interactive (it)?"
select ask2 in "d" "it"; do
  case $ask2 in
     d ) break;;
     it ) break;;
  esac  
done


echo "Select the node environment"

select ask1 in "default" "staging" "production"; do
  case $ask1 in
    default ) docker run -"$ask2" -v "$PWD":/app -p 3002:3002 ycontent/player /bin/bash -c "npm install; cd app; npm install; cd ..; node app/bin/www & gulp"; break;;
    staging ) docker run -"$ask2" -e "NODE_ENV=staging" -p 3002:3002 ycontent/player:staging; break;;
    production ) docker run -"$ask2" -e "NODE_ENV=production" -p 3002:3002 ycontent/player:production; break;;
  esac
done