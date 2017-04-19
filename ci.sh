#! /bin/bash -ex

# Primitive CI script aimed at bootstrapping core... This file should evolve
# as new functionality is added (and different platforms...)

yarn run lint
yarn run flow

pushd web
# TODO Web specific tests...
popd
