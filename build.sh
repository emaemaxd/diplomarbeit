#!/usr/bin/env bash

pushd server/three-d-portfolio-server
mvn -Dmaven.test.skip=true -Dquarkus.profile=dev clean package install
popd

pushd 3D-Portfolio-Gallery/Gallery
npm install
ng build --configuration production --base-href /e.halilovic/
popd

pushd k8s
./deploy.sh
popd

pushd 3D-Portfolio-Gallery/Gallery
./deploy.sh
popd