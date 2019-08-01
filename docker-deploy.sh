#!/usr/bin/env bash

set -e
set -v

docker login -u "${REGISTRY_USER}" -p "${REGISTRY_PASS}" "${REGISTRY_SERVER}"
git_sha="$(git rev-parse --short HEAD)"

if [ "${TRAVIS_PULL_REQUEST_BRANCH:-$TRAVIS_BRANCH}" = "develop" ]; then
    docker tag "${IMAGE_NAME}" "${IMAGE_NAME}:develop"
    docker tag "${IMAGE_NAME}" "${IMAGE_NAME}:${git_sha}-develop"
elif [ -n "${TRAVIS_TAG}" ]; then
    docker tag "${IMAGE_NAME}" "${IMAGE_NAME}:${TRAVIS_TAG}"
fi