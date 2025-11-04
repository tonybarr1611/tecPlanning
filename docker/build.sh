#!/bin/bash
# $1 is the username
docker login

build_docker_image() {
    local image=$1
    cd "$image" || exit
    docker build -t "$2/$image" .
    docker push "$2/$image"
    cd ..
}

build_docker_image "frontend" "$1"