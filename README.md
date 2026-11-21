# Loan Eligibility Portal

## Portal features

The authenticated portal includes nine navigable screens:

- Overview dashboard
- New loan application with applicant, income, tenure and document inputs
- My applications tracker
- Indicative eligibility assessment
- Supporting document centre
- Repayment schedule with EMI estimate
- Approval status timeline
- Reports for applications, eligibility, approvals and repayments
- User management for Admin, Applicant, Loan Officer and Credit Reviewer roles

Applications continue to use the backend eligibility and application APIs. The role selector in the workspace header makes each supported role visible for the academic workflow demonstration.

The portal includes a login page with account creation, sign-in, password visibility toggle, and JWT-based authentication.

## Run with Docker

Install and start Docker Desktop, then run these commands from the `Loan Eligibility Portal` folder:

```powershell
docker compose up --build
```

Wait until the backend reports that MongoDB is connected, then open `http://localhost:5173`. Select **Sign Up** to create an account, or sign in with an existing account.

To stop the containers:

```powershell
docker compose down
```

The MongoDB data is stored in the `mongodb-data` Docker volume, so stopping the containers does not remove registered accounts.

## Deploy with Kubernetes

Build the images, then load them into the cluster. For Docker Desktop Kubernetes:

```powershell
# Enable Kubernetes in Docker Desktop before running these commands.
docker compose build
kubectl create secret generic loan-backend-secrets --from-literal=JWT_SECRET=replace-this-with-a-long-random-secret
kubectl apply -f .\k8s\mongodb.yaml
kubectl apply -f .\k8s\backend.yaml
kubectl apply -f .\k8s\frontend.yaml
kubectl get pods
```

Open `http://localhost:30080` after the frontend pod is ready. The backend is available through NodePort `30050`, and MongoDB is available inside the cluster through the `mongodb` service.

To remove the Kubernetes deployment:

```powershell
kubectl delete -f .\k8s\frontend.yaml
kubectl delete -f .\k8s\backend.yaml
kubectl delete -f .\k8s\mongodb.yaml
```

## Run without Docker

Docker is optional. Run MongoDB locally or use a MongoDB Atlas connection string, then start the two applications in separate terminals.

### 1. Configure the backend

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/loan_portal
JWT_SECRET=replace-this-with-a-long-random-secret
PORT=5000
FRONTEND_URL=http://localhost:5173
```

For MongoDB Atlas, replace `MONGO_URI` with the connection string provided by Atlas.

### 2. Start the backend

```powershell
cd "Loan Eligibility Portal\backend"
npm install
npm run dev
```

### 3. Start the frontend

In a second terminal:

```powershell
cd "Loan Eligibility Portal\frontend"
npm install
npm run dev
```

Open `http://localhost:5173`, choose **Sign Up** to create an account, and then sign in.

The frontend uses `http://localhost:5000` by default. To use another backend URL, create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000
```