#!/usr/bin/env bash
set -e

#remove this when done with testing!

BASE_HREF=${BASE_HREF:-"/e.halilovic/"}
GITHUB_USER=${GITHUB_USER:-emaemaxd}

# docker package names cannot contain uppercase letters:
LC_GH_USER_NAME="$(echo "$GITHUB_USER" | tr '[:upper:]' '[:lower:]')"
BACKEND_IMAGE_NAME=ghcr.io/$LC_GH_USER_NAME/3dserver:latest
echo "BASE_HREF=$BASE_HREF"

export GITHUB_USER
export BACKEND_IMAGE_NAME

NAMESPACE=student-e-halilovic
KNIFE_POD=""
findPod() {
    KNIFE_POD=$(kubectl -n $NAMESPACE get pods|grep -i Running|grep knife|cut -d\  -f 1)
}
waitForPod() {
    local pod=""
    while [ "$KNIFE_POD." == "." ]; do
        findPod $1
        kubectl -n $NAMESPACE get pods | grep knife
        echo "wait for knife"
        sleep 1
    done;
    echo "pod $KNIFE_POD ready"
}


pushd server/three-d-portfolio-server
mvn -Dmaven.test.skip=true clean package
mkdir -p target/deploy
cp target/*-runner.jar target/deploy/
docker build --tag 3dserver --file ./src/main/docker/Dockerfile ./target/deploy
docker image tag 3dserver $BACKEND_IMAGE_NAME
docker push $BACKEND_IMAGE_NAME
popd

pushd 3D-Portfolio-Gallery/Gallery
npm install
npm run build -- --configuration production --base-href $BASE_HREF
popd

pushd k8s
./deploy.sh
popd

waitForPod knife

export KNIFE_POD
export NAMESPACE

pushd 3D-Portfolio-Gallery/Gallery
./deploy.sh
popd

pushd server/three-d-portfolio-server/target
echo "copy example images to $KNIFE_POD "
kubectl -n $NAMESPACE cp files/ $KNIFE_POD:/mnt/
popd
pushd k8s
kubectl delete -f busybox-job.yaml
popd