#!/bin/bash

NUM_VMS=${1:-3}

# Stop and remove any existing simulated VMs
docker stop $(docker ps -a -q --filter ancestor=ubuntu) > /dev/null 2>&1
docker rm $(docker ps -a -q --filter ancestor=ubuntu) > /dev/null 2>&1

for i in $(seq 1 $NUM_VMS);
do
  docker run -d --name vm$i ubuntu:latest tail -f /dev/null
  echo "Started vm$i"
done

echo "All $NUM_VMS simulated VMs started."


