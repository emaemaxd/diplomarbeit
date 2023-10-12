#!/usr/bin/env bash
set -e

BASE_HREF=${BASE_HREF:-"/e.halilovic/"}
GITHUB_USER=${GITHUB_USER:-emaemaxd}

echo "BASE_HREF=$BASE_HREF"

pushd server/three-d-portfolio-server
mvn -Dmaven.test.skip=true -Dquarkus.container-image.group=$GITHUB_USER clean package install
popd

pushd 3D-Portfolio-Gallery/Gallery
npm install
npm run build -- --configuration production --base-href $BASE_HREF
popd

pushd k8s
./deploy.sh
popd

pushd 3D-Portfolio-Gallery/Gallery
./deploy.sh
popd