#!/bin/bash
GITHUB_USER=${GITHUB_USER:-emaemaxd}
IMAGE_NAME=ghcr.io/$GITHUB_USER/3dserver:latest
set -e

bold=$(tput bold)
normal=$(tput sgr0)

echo "tag image to $IMAGE_NAME..."
docker image tag $GITHUB_USER/3dserver:1.0.0-SNAPSHOT $IMAGE_NAME
docker push $IMAGE_NAME

kubectl delete -f appsrv.yaml || echo "appsrv not deployed yet"
kubectl delete -f busybox-job.yaml || echo "busybox not deployed yet"

kubectl apply -f persistent-volume.yaml || echo "volume cannot be created - maybe it already exists"
kubectl apply -f namespace.yaml
kubectl apply -f postgres.yaml
kubectl apply -f appsrv.yaml
kubectl apply -f nginx.yaml
kubectl apply -f busybox-job.yaml
kubectl apply -f ingress.yaml || echo "no ingress"


echo "----------"
echo "DO NOT FORGET: make the ${bold}docker image public${normal} on ghcr.io"
echo "----------"
