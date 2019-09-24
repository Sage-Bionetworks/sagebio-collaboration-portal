#!/usr/bin/env bash

if ([ "$TRAVIS_BRANCH" == "develop" ]); then
    codecov --token=${CODECOV_TOKEN}
fi
