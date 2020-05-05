#!/bin/sh

cd /Users/freek/Work/bitpull/workspace

export GOOGLE_PROJECT_ID=bitpull
export TF_VAR_GCLOUD_STORAGE_BUCKET=bitpull
export GIT_SHA1=$(git rev-parse HEAD)

# cd terraform

# terraform init \
#     -input=false \
#     -backend-config="bucket=${TF_VAR_GCLOUD_STORAGE_BUCKET}" \
#     -backend-config="credentials=${TF_VAR_GCLOUD_SERVICE_KEY}"
# terraform apply -input=false -auto-approve

# cd /Users/freek/Work/bitpull/workspace

# Backend

# yarn compile:worker
# yarn lint:worker
# yarn test:worker
# yarn compile:backend
# yarn lint:backend
# yarn test:backend
# yarn compile:frontend
# yarn lint:frontend
# yarn test:frontend

docker build -t "gcr.io/$GOOGLE_PROJECT_ID/backend:$GIT_SHA1" -t "gcr.io/$GOOGLE_PROJECT_ID/backend:latest" -f packages/backend/Dockerfile .
docker push "gcr.io/$GOOGLE_PROJECT_ID/backend:$GIT_SHA1"
sed -i'.original' "s/latest/$GIT_SHA1/" k8s_config/overlays/production/backend/deployment.yaml
kubectl apply -k k8s_config/overlays/production/backend
kubectl rollout status deployment/backend
git checkout k8s_config/overlays/production/backend/deployment.yaml
rm k8s_config/overlays/production/backend/deployment.yaml.original

# Frontend
docker build -t "gcr.io/$GOOGLE_PROJECT_ID/frontend:$GIT_SHA1" -t "gcr.io/$GOOGLE_PROJECT_ID/frontend:latest" -f packages/frontend/Dockerfile .
docker push "gcr.io/$GOOGLE_PROJECT_ID/frontend:$GIT_SHA1"
sed -i'.original' "s/latest/$GIT_SHA1/" k8s_config/overlays/production/frontend/deployment.yaml
kubectl apply -k k8s_config/overlays/production/frontend
kubectl rollout status deployment/frontend
git checkout k8s_config/overlays/production/frontend/deployment.yaml
rm k8s_config/overlays/production/frontend/deployment.yaml.original


# docker build -t "gcr.io/bitpull/pressure:latest" -f packages/pressure/Dockerfile .
# docker push "gcr.io/bitpull/pressure:latest"
# kubectl set image deployment/chrome pressure=gcr.io/bitpull/pressure:latest


kubectl apply -f k8s_config/base/cert/api-certificate.yaml
kubectl apply -f k8s_config/base/cert/app-certificate.yaml
kubectl apply -f k8s_config/base/cert/ingress.yaml
kubectl apply -k k8s_config/overlays/production/chrome
kubectl rollout status deployment/chrome



