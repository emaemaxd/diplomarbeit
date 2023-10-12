# 3D Portfolio Gallery

Diplomarbeit


## Building
### 1. Create a github token and use it as a password to login into ghcr.io
```bash
docker login ghcr.io
```
### 2. start minikube
```bash
minkube start
minikube addons enable dashboard
minikube addons enable metrics-server
```
### replace the image name 

in appsrv.yaml replace in the image: line emaemaxd with your github name
'image: ghcr.io/emaemaxd/3dserver:latest -> image: ghcr.io/mygithubname/3dserver:latest'


### 4. Set your user Parameters and start the build

```bash
export GITHUB_USER=emaemaxd
export BASE_HREF=/e.halilovic/
./build.sh
```

### 5. start the dashboard
```bash
minikube dashboard
```

### 6. port forward your minikube application server to localhost
use the [kubectl cheat sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) to find your commands and enable autocompletion.
```bash
kubectl config current-context
kubectl config set-context --current --namespace=student-e-halilovic
watch kubectl get pods
```

Wait until your application server is ready and then port-forward it by
```bash
kubectl port-forward appsrv-<tab><tab> 8080:8080
```
<tab><tab> means pressing the tab key twice or copy the correct name of your pods
Server ist in einem externen Repo aufzufinden (emaemaxd/3dserver)

### 7. start the frontend

```bash
cd 3D-Portfolio-Gallery/Gallery
npm start   
```