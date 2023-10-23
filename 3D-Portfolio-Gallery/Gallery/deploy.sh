#!/usr/bin/env bash

set -e

echo "copy to $NAMESPACE ..."
kubectl -n $NAMESPACE  exec $KNIFE_POD -- rm -rf /srv/demo /srv/dist
pushd ./dist
    kubectl -n $NAMESPACE  cp * $KNIFE_POD:/srv/
popd
echo "copy done"