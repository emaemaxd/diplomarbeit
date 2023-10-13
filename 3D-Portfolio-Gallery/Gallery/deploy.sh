#!/usr/bin/env bash

#npm install
#npm run build
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

echo "copy to student-e-halilovic..."
kubectl -n student-e-halilovic exec $KNIFE_POD -- rm -rf /srv/demo /srv/dist
kubectl -n student-e-halilovic cp ./dist $KNIFE_POD:/srv/
kubectl -n student-e-halilovic exec $KNIFE_POD -- mv /srv/dist /srv/demo
echo "copy done"