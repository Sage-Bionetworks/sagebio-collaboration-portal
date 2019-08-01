  #!/usr/bin/env bash

set -e
set -v

  if [ "${TRAVIS_PULL_REQUEST_BRANCH:-$TRAVIS_BRANCH}" = "develop" ]; then
    docker build -f Dockerfile \
        --pull \
        --cache-from "${IMAGE_NAME}:develop" \
        --tag "${IMAGE_NAME}" .
  elif [ -n "${TRAVIS_TAG}" ]; then
    docker build -f Dockerfile \
        --tag "${IMAGE_NAME}" .
  fi