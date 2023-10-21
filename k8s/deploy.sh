#!/bin/bash
set -e


# env settings are imported
## GITHUB_USER=${GITHUB_USER:-emaemaxd}
## BACKEND_IMAGE_NAME=ghcr.io/$GITHUB_USER/3dserver:latest

bold=$(tput bold)
normal=$(tput sgr0)

echo "tag image to $IMAGE_NAME..."
mkdir -p target
envsubst '\$BACKEND_IMAGE_NAME' < appsrv.yaml > ./target/appsrv.yaml
kubectl delete -f appsrv.yaml || echo "appsrv not deployed yet"
kubectl delete -f busybox-job.yaml || echo "busybox not deployed yet"
kubectl apply -f namespace.yaml
kubectl apply -f persistent-volume.yaml
kubectl apply -f postgres.yaml
kubectl apply -f target/appsrv.yaml
kubectl apply -f nginx.yaml
kubectl apply -f busybox-job.yaml
kubectl apply -f ingress.yaml || echo "no ingress"

kubectl rollout restart deployment/nginx || echo "no nginx yet"
kubectl rollout restart deployment/appsrv || echo "no appsrv yet"

echo "----------"
echo "DO NOT FORGET: make the ${bold}docker image public${normal} on ghcr.io"
echo "----------"
