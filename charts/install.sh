#!/bin/bash

update_helm_charts() {
    local chart=$1

    cd "$chart" || exit
    rm -rf Chart.lock
    helm dependency update
    cd ..
    helm upgrade --install "$chart" "$chart"
}

update_helm_charts "database"
update_helm_charts "application"
