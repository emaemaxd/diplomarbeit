#!/usr/bin/env bash
set -e

BASE_HREF=${BASE_HREF:-"/e.halilovic/"}
GITHUB_USER=${GITHUB_USER:-emaemaxd}
echo "BASE_HREF=$BASE_HREF"

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
mvn -Dmaven.test.skip=true -Dquarkus.container-image.group=$GITHUB_USER clean package install
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