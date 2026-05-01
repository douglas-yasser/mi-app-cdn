@"
# Assignment 08 — Kubernetes con Minikube

Clúster de Kubernetes local usando Minikube con Traefik, ArgoCD y la aplicación To-Do del assignment anterior.

## 📸 Capturas de pantalla

### Aplicación To-Do
![App](./docs/app-screenshot.png)

### ArgoCD
![ArgoCD](./docs/argo-screenshot.png)

![ArgoCD](./docs/argo2-screenshot.png)
## Dominios configurados

| Servicio | URL |
|---|---|
| **Frontend** | http://app.douglas-yasser.com |
| **Backend API** | http://api.douglas-yasser.com |
| **ArgoCD** | http://argo.douglas-yasser.com |

## DNS Local configurado en /etc/hosts

\`\`\`
127.0.0.1 app.douglas-yasser.com
127.0.0.1 api.douglas-yasser.com
127.0.0.1 argo.douglas-yasser.com
\`\`\`

##  Arquitectura

- **Minikube** — Clúster local de Kubernetes con driver Docker
- **Traefik** — Ingress Controller instalado via Helm
- **ArgoCD** — GitOps Controller
- **Todo App** — Frontend (React + Nginx) y Backend (Node.js + Express)

## 📁 Manifiestos YAML (IaC)

\`\`\`
k8s/
├── traefik/
│   └── traefik.yaml
├── argocd/
│   └── ingressroute.yaml
└── app/
    ├── namespace.yaml
    ├── backend-deployment.yaml
    ├── frontend-deployment.yaml
    └── ingressroute.yaml
\`\`\`

## ⚙️ Comandos para levantar todo

\`\`\`bash
# 1. Iniciar Minikube
minikube start --driver=docker --cpus=4 --memory=4096

# 2. Instalar Traefik
helm repo add traefik https://helm.traefik.io/traefik
helm repo update
kubectl create namespace traefik
helm install traefik traefik/traefik \
  --namespace traefik \
  --set service.type=LoadBalancer \
  --set providers.kubernetesCRD.allowCrossNamespace=true

# 3. Instalar ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 4. Construir imágenes Docker
minikube docker-env | Invoke-Expression
docker build -t todo-frontend:latest .
docker build -t todo-backend:latest -f apps/backend/Dockerfile .

# 5. Aplicar manifiestos
kubectl apply -f k8s/app/namespace.yaml
kubectl apply -f k8s/app/backend-deployment.yaml
kubectl apply -f k8s/app/frontend-deployment.yaml
kubectl apply -f k8s/app/ingressroute.yaml
kubectl apply -f k8s/argocd/ingressroute.yaml

# 6. Configurar ArgoCD en modo inseguro
kubectl patch deployment argocd-server -n argocd --patch-file patch-argo.yaml

# 7. Exponer Traefik
minikube tunnel

# 8. Configurar DNS local (/etc/hosts)
# Agregar como administrador:
# 127.0.0.1 app.douglas-yasser.com
# 127.0.0.1 api.douglas-yasser.com
# 127.0.0.1 argo.douglas-yasser.com
\`\`\`

##  Credenciales ArgoCD

- **Usuario:** admin
- **Contraseña:** obtener con:
\`\`\`bash
kubectl get secret argocd-initial-admin-secret -n argocd \
  -o jsonpath="{.data.password}" | base64 -d
\`\`\`
"@ | Out-File -FilePath "README.md" -Encoding utf8