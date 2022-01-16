#!/bin/bash
eval `ssh-agent -s`

ssh-add ~/.ssh/id_rsa
while true
do
    current_commit=$(git rev-parse HEAD)
    git fetch
    last_commit=$(git rev-parse origin/master)

    echo "$(date): check..."
    if [ "$current_commit" != "$last_commit" ]; \
    then
        echo "$(date): git reset --hard origin/master"
        printf " local: ${current_commit}"
        printf "\n"
        printf "remote: ${last_commit}"
        git reset --hard origin/master
        yarn install
        yarn build --release
        echo "$(date): build finished"
        pkill -f node
        yarn serve &
        echo "$(date): server started"
    fi
    # sleep 300
    sleep 60
done
