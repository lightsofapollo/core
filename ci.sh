#! /bin/bash -ex

# Primitive CI script aimed at bootstrapping core... This file should evolve
# as new functionality is added (and different platforms...)

yarn run lint

pushd web
./node_modules/.bin/jest --coverage
popd
