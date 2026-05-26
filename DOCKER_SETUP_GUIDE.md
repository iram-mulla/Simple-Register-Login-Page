# Docker Containerization Guide - Student Course Registration System

## 📋 Complete Step-by-Step Instructions

### **STEP 1: Prerequisites - Install Docker Desktop**

1. **Download Docker Desktop** from: https://www.docker.com/products/docker-desktop
2. **Install Docker Desktop** following the official installer
3. **Verify Installation** (open PowerShell/Terminal):
   ```bash
   docker --version
   docker-compose --version
   ```
   You should see version numbers for both commands.

---

### **STEP 2: Verify Project Files**

All required files should be in your project directory:
- ✅ `Dockerfile` - Docker image configuration
- ✅ `docker-compose.yml` - Multi-container orchestration
- ✅ `.dockerignore` - Files to exclude from Docker image
- ✅ `server.js` - Updated with environment variables
- ✅ `package.json` - Dependency management

**Current Project Structure:**
```
student-course-registration/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── server.js (UPDATED ✅)
├── package.json
├── README.md
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
└── views/
    ├── home.html
    ├── login.html
    └── register.html
```

---

### **STEP 3: Build Docker Image**

Navigate to your project directory and run:

```bash
cd "D:\Engineering\6th sem\CC\Lab\student-course-registration"
docker build -t student-app .
```

**Expected Output:**
```
[1/6] FROM node:18-alpine
[2/6] WORKDIR /app
[3/6] COPY package*.json ./
[4/6] RUN npm install
[5/6] COPY . .
[6/6] EXPOSE 3000
Successfully tagged student-app:latest
```

✅ **Verification:** List images
```bash
docker images
```
You should see `student-app` in the list.

---

### **STEP 4: Start Services with Docker Compose**

Run the complete stack (Node.js app + MongoDB):

```bash
docker-compose up -d
```

**What This Does:**
- ✅ Starts MongoDB service on port 27017
- ✅ Starts Node.js application on port 3000
- ✅ Creates network for communication between services
- ✅ Enables data persistence with MongoDB volumes

**Expected Output:**
```
Creating student-app-mongodb ... done
Creating student-app        ... done
```

---

### **STEP 5: Verify Containers Are Running**

Check running containers:

```bash
docker ps
```

**Expected Output:**
```
CONTAINER ID   IMAGE           COMMAND                  PORTS
abc123def456   mongo:7.0       "mongod --auth"         0.0.0.0:27017->27017/tcp
xyz789uvw012   student-app     "docker-entrypoint..."  0.0.0.0:3000->3000/tcp
```

Check container logs:

```bash
docker logs student-app
docker logs student-app-mongodb
```

---

### **STEP 6: Access the Application**

Open your browser and navigate to:

```
http://localhost:3000
```

**You should see:**
- ✅ Login Page (initially)
- ✅ Registration form
- ✅ Course registration interface

---

### **STEP 7: Test the Application**

1. **Register a New User:**
   - Click "Register" button
   - Enter Name, Email, Password
   - Click Submit
   - See success message

2. **Login:**
   - Use registered email and password
   - Access student dashboard
   - View available courses

3. **Register for Courses:**
   - Click "Register for Course"
   - Select courses to enroll
   - See confirmation

---

### **STEP 8: View Container Information**

**Access MongoDB inside container:**
```bash
docker exec -it student-app-mongodb mongosh -u admin -p password123
```

**View application logs in real-time:**
```bash
docker logs -f student-app
docker logs -f student-app-mongodb
```

---

### **STEP 9: Stop Services**

When you want to stop the application:

```bash
docker-compose down
```

**Optional - Remove all data (warning: deletes database):**
```bash
docker-compose down -v
```

---

## 🔧 Common Useful Commands

### **View running containers:**
```bash
docker ps
```

### **View all containers (including stopped):**
```bash
docker ps -a
```

### **View Docker images:**
```bash
docker images
```

### **Stop specific container:**
```bash
docker stop student-app
```

### **Start specific container:**
```bash
docker start student-app
```

### **View container logs:**
```bash
docker logs student-app
```

### **Follow container logs (live):**
```bash
docker logs -f student-app
```

### **Inspect container details:**
```bash
docker inspect student-app
```

### **Remove image:**
```bash
docker rmi student-app
```

### **Remove stopped containers:**
```bash
docker container prune
```

---

## 🐛 Troubleshooting

### **Port 3000 already in use:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000
# Kill process by PID
taskkill /PID <PID> /F
```

### **Port 27017 already in use:**
```bash
# Same as above, replace 3000 with 27017
netstat -ano | findstr :27017
taskkill /PID <PID> /F
```

### **MongoDB connection fails:**
```bash
# Check MongoDB logs
docker logs student-app-mongodb
# Restart MongoDB
docker-compose restart mongodb
```

### **Application won't start:**
```bash
# Check application logs
docker logs student-app
# View detailed logs
docker logs -f student-app
```

### **Clear everything and restart fresh:**
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d
```

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────┐
│          User's Web Browser                 │
│       (http://localhost:3000)               │
└────────────────────┬────────────────────────┘
                     │
                     ↓
    ┌────────────────────────────────────┐
    │   Docker Container: Node.js App    │
    │  (student-app - Port 3000)         │
    │  - Express Server                  │
    │  - Session Management              │
    │  - API Routes                      │
    └────────────┬─────────────────────┘
                 │
    ┌────────────┴──────────────────────┐
    │      Docker Network Bridge        │
    │     (student-network)             │
    └────────────┬──────────────────────┘
                 │
    ┌────────────▼─────────────────────┐
    │   Docker Container: MongoDB       │
    │  (student-app-mongodb)            │
    │  - MongoDB Server                 │
    │  - Port 27017                     │
    │  - Persistent Volume              │
    └──────────────────────────────────┘
```

---

## 📦 Technologies Used

| Component | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18-alpine | JavaScript runtime |
| Express.js | ^4.18.2 | Web framework |
| MongoDB | 7.0 | Database |
| Docker | Latest | Containerization |
| Docker Compose | 3.8 | Container orchestration |
| Bootstrap 5 | CSS Framework | Frontend styling |

---

## ✅ Final Verification Checklist

- [ ] Docker Desktop installed and running
- [ ] All Docker files created (Dockerfile, docker-compose.yml, .dockerignore)
- [ ] server.js updated with environment variables
- [ ] Docker image built successfully (`docker build -t student-app .`)
- [ ] Containers running (`docker-compose up -d`)
- [ ] MongoDB connected successfully
- [ ] Application accessible at http://localhost:3000
- [ ] Can register new users
- [ ] Can login with registered credentials
- [ ] Can view and register for courses
- [ ] Database persists data (MongoDB volume)

---

## 📝 Notes

1. **Default MongoDB Credentials:**
   - Username: `admin`
   - Password: `password123`
   - **⚠️ Change these for production!**

2. **Data Persistence:**
   - MongoDB data is stored in Docker volume `mongodb_data`
   - Data persists even after containers stop
   - Use `docker-compose down -v` to delete volumes

3. **Environment Variables:**
   - `NODE_ENV`: Set to `production` in container
   - `MONGODB_URI`: Automatically configured in docker-compose.yml
   - `PORT`: Default 3000

4. **Networking:**
   - Services communicate via `student-network`
   - App connects to MongoDB using hostname: `mongodb`
   - External access on localhost ports

---

## 🚀 Next Steps

1. Test all functionality thoroughly
2. For production: Update MongoDB credentials and use strong passwords
3. Use Docker Hub to push image: `docker push yourusername/student-app`
4. Deploy to cloud platforms (AWS, Azure, GCP, DigitalOcean, etc.)

---

**Last Updated:** May 26, 2026
**Status:** ✅ Ready for Deployment
