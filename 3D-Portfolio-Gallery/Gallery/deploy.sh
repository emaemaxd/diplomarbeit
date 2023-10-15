#!/usr/bin/env bash

set -e

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
waitForPod knife

echo "copy to $NAMESPACE ..."
kubectl -n $NAMESPACE  exec $KNIFE_POD -- rm -rf /srv/demo /srv/dist
pushd ./dist
    kubectl -n $NAMESPACE  cp * $KNIFE_POD:/srv/
popd
echo "copy done"