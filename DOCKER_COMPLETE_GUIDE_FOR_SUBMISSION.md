# 🐳 Complete Docker Containerization Guide - For Professor Submission

## ❌ **ERROR YOU GOT - EXPLANATION**

**Error Message:**
```
ERROR: failed to solve: failed to fetch oauth token: 
Post "https://auth.docker.io/token": net/http: TLS handshake timeout
```

**What This Means:**
- Docker is trying to download `node:18-alpine` image from Docker Hub (internet)
- Your internet connection is either slow or unstable
- The SSL/TLS connection is timing out

**Solution:** Wait a moment and retry, or restart Docker Desktop

---

## ⚠️ **IMPORTANT: You DO NOT Need to Create Container Manually!**

**Docker Compose does EVERYTHING automatically:**
- ✅ Creates containers
- ✅ Builds images
- ✅ Sets up networking
- ✅ Starts all services
- ✅ Manages MongoDB

**You only need to run 2-3 commands!**

---

## 📋 **COMPLETE STEP-BY-STEP PROCESS**

### **BEFORE YOU START:**
1. Make sure **Docker Desktop is installed** and **running**
2. Check that you have **internet connection** (for downloading images)
3. Go to your project folder in PowerShell/Command Prompt

---

## **STEP 1: Verify Docker Installation**

Open PowerShell and run:

```powershell
docker --version
docker-compose --version
```

**Expected Output:**
```
Docker version 26.0.0, build xxxxx
Docker Compose version 2.24.0, build xxxxxx
```

✅ **If you see versions, Docker is properly installed!**

---

## **STEP 2: Navigate to Project Folder**

```powershell
cd "D:\Engineering\6th sem\CC\Lab\student-course-registration"
```

Verify you're in the right place:
```powershell
dir
```

**You should see these files:**
```
Dockerfile
docker-compose.yml
.dockerignore
package.json
server.js
views/
public/
```

---

## **STEP 3: RESTART DOCKER DESKTOP** ⭐ (Important for Network Issues)

If you got the timeout error:

1. **Close Docker Desktop completely**
   - Right-click Docker icon in system tray → Quit Docker Desktop
   - Wait 10 seconds

2. **Reopen Docker Desktop**
   - Click Docker icon from Start Menu or Desktop
   - Wait for it to fully load (watch the taskbar)
   - You should see "Docker Desktop is running" in system tray

3. **Verify it's ready:**
   ```powershell
   docker ps
   ```
   Should show running containers (or empty list if none running)

---

## **STEP 4: PULL DOCKER IMAGE (One-time download)**

This downloads the Node.js image to your computer:

```powershell
docker pull node:18-alpine
```

**Expected Output:**
```
18-alpine: Pulling from library/node
Pulling fs layer
Download complete
Digest: sha256:xxxxx
Status: Downloaded newer image for node:18-alpine
```

✅ **This means the image downloaded successfully!**

---

## **STEP 5: BUILD THE DOCKER IMAGE** ⭐ (Most Important Step)

Now that you have the base image, build your app image:

```powershell
docker build -t student-app .
```

**What's Happening:**
1. Reading the Dockerfile
2. Using node:18-alpine as base
3. Installing npm dependencies
4. Copying your app files
5. Creating a Docker image called "student-app"

**Expected Output:**
```
[+] Building 35.2s (7/7) FINISHED                            docker:desktop-linux
 => [internal] load build definition from Dockerfile          0.0s
 => => transferring dockerfile: 533B                          0.0s
 => [internal] load client certificate                        0.0s
 => [1/6] FROM node:18-alpine                                 1.2s
 => [2/6] WORKDIR /app                                        0.3s
 => [3/6] COPY package*.json ./                               0.2s
 => [4/6] RUN npm install                                    25.8s
 => [5/6] COPY . .                                            0.4s
 => [6/6] EXPOSE 3000                                         0.1s
 => exporting to image                                        7.0s
 => => exporting layers                                       6.8s
 => => writing image sha256:abc123def456                      0.2s
 => => naming to docker.io/library/student-app:latest         0.0s

Successfully built student-app:latest
```

✅ **SUCCESS! Your Docker image is built!**

---

## **STEP 6: VERIFY THE IMAGE WAS CREATED**

List all Docker images:

```powershell
docker images
```

**Expected Output:**
```
REPOSITORY        TAG       IMAGE ID        CREATED         SIZE
student-app       latest    abc123def456    2 minutes ago   180MB
node              18-alpine xyz789uvw012    2 weeks ago     170MB
mongo             7.0       def456ghi789    2 weeks ago     682MB
```

✅ **You can see "student-app" in the list!**

---

## **STEP 7: START ALL SERVICES WITH DOCKER COMPOSE** ⭐⭐⭐ (This Creates & Runs Containers)

**This is the MAIN command that creates and runs everything:**

```powershell
docker-compose up -d
```

**What This Does:**
- ✅ Creates MongoDB container
- ✅ Creates Node.js app container
- ✅ Starts both containers
- ✅ Creates network for communication
- ✅ Waits for MongoDB to be healthy before starting app
- ✅ Keeps running in background (`-d` flag)

**Expected Output:**
```
[+] Running 2/2
 ✓ Network student-network Created          0.1s
 ✓ Container student-app-mongodb Created    0.5s
 ✓ Container student-app Created            1.2s
```

✅ **Both containers are now created and running!**

---

## **STEP 8: VERIFY CONTAINERS ARE RUNNING** ⭐ (Show This to Professor)

```powershell
docker ps
```

**Expected Output:**
```
CONTAINER ID   IMAGE              COMMAND                  CREATED         STATUS         PORTS                      NAMES
abc123def456   student-app        "docker-entrypoint.…"   1 minute ago    Up 1 minute    0.0.0.0:3000->3000/tcp     student-app
xyz789uvw012   mongo:7.0          "mongod --auth"          1 minute ago    Up 1 minute    0.0.0.0:27017->27017/tcp   student-app-mongodb
```

✅ **BOTH containers are running!** This proves containerization worked!

---

## **STEP 9: CHECK CONTAINER LOGS** ⭐ (Show This to Professor)

Check Node.js App Logs:

```powershell
docker logs student-app
```

**Expected Output:**
```
Server is running on port 3000
✅ Connected to MongoDB
listening on port 3000
```

Check MongoDB Logs:

```powershell
docker logs student-app-mongodb
```

**Expected Output:**
```
waiting for connections on port 27017
SCRAM-SHA-1 authentication initialized
```

✅ **Both services are connected and working!**

---

## **STEP 10: TEST THE APPLICATION** ⭐ (Show This to Professor)

Open your browser and go to:

```
http://localhost:3000
```

**You should see:**
1. ✅ Login page loads
2. ✅ No errors in browser console
3. ✅ Can click "Register"
4. ✅ Can fill form and submit
5. ✅ Can login with credentials
6. ✅ Can see courses and register

---

## **STEP 11: VERIFY DATABASE CONNECTION** ⭐ (Show This to Professor)

Check if app is communicating with MongoDB:

```powershell
docker logs student-app -f
```

**Look for these messages:**
```
✅ Connected to MongoDB
User logged in: example@email.com
New user registered: example@email.com
```

---

## **STEP 12: VIEW DOCKER DESKTOP** ⭐⭐⭐ (Show This to Professor)

1. **Open Docker Desktop application**
2. **Go to "Containers" tab on left**
3. **You should see:**
   - `student-app` (running) ✅
   - `student-app-mongodb` (running) ✅

4. **Click on each container to see:**
   - Container logs
   - Resource usage (CPU, Memory)
   - Port mappings
   - Environment variables

**SCREENSHOT THIS! This is perfect proof for your professor.**

---

## **STEP 13: Check Docker Volumes (Data Persistence)** ⭐

```powershell
docker volume ls
```

**Expected Output:**
```
DRIVER    VOLUME NAME
local     student-course-registration_mongodb_data
```

✅ **This proves your data persists!**

---

## **COMPLETE TEST SCENARIO - FOR PROFESSOR SUBMISSION**

### **Test 1: Register New User**

```
1. Go to http://localhost:3000
2. Click "Register"
3. Enter:
   - Name: John Doe
   - Email: john@example.com
   - Password: pass123
4. Click Submit
5. Should see: "User created successfully"
```

**Screenshot this!**

---

### **Test 2: Login User**

```
1. Click "Login"
2. Enter email: john@example.com
3. Enter password: pass123
4. Click Login
5. Should see: "Login successful" + Dashboard
```

**Screenshot this!**

---

### **Test 3: View Courses**

```
1. After login, should see available courses
2. Course list should display:
   - Course ID
   - Course Name
   - Instructor
   - Credits
   - Available Seats
```

**Screenshot this!**

---

### **Test 4: Register for Course**

```
1. Click "Register for Course"
2. Select a course
3. Should see: "Successfully registered"
4. Course should appear in "My Courses"
```

**Screenshot this!**

---

## **COMMAND SUMMARY - ALL COMMANDS TO RUN IN ORDER**

### **One-Time Setup:**

```powershell
# Step 1: Verify Docker
docker --version
docker-compose --version

# Step 2: Go to project folder
cd "D:\Engineering\6th sem\CC\Lab\student-course-registration"

# Step 3: Restart Docker Desktop (if needed)
# Close and reopen Docker Desktop from Start Menu

# Step 4: Pull base image
docker pull node:18-alpine

# Step 5: Build Docker image
docker build -t student-app .

# Step 6: Start all containers
docker-compose up -d
```

### **Daily Commands (When Starting Development):**

```powershell
# Start containers
docker-compose up -d

# Check if running
docker ps

# View logs
docker logs student-app
docker logs student-app-mongodb
```

### **Cleanup Commands (When Done):**

```powershell
# Stop containers (keeps data)
docker-compose down

# Stop and delete everything (warning: deletes database)
docker-compose down -v

# Delete Docker image
docker rmi student-app
```

---

## **TROUBLESHOOTING COMMON ERRORS**

### **❌ Error: "Port 3000 is already in use"**

```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill that process (replace 1234 with actual PID)
taskkill /PID 1234 /F

# Then try again
docker-compose up -d
```

### **❌ Error: "Cannot connect to MongoDB"**

```powershell
# Restart MongoDB container
docker-compose restart mongodb

# Wait 10 seconds, then check logs
docker logs student-app-mongodb
```

### **❌ Error: "Docker daemon not running"**

```powershell
# Docker Desktop is not running
# Open Docker Desktop from Start Menu
# Wait for it to fully load
# Try command again
```

### **❌ Error: "Cannot access http://localhost:3000"**

```powershell
# Check if container is actually running
docker ps

# Check container logs for errors
docker logs student-app -f

# Restart container
docker-compose restart app
```

---

## **WHAT TO SHOW YOUR PROFESSOR** ✅

### **Document 1: Dockerfile**
```
Show the Dockerfile you created
- Explains Docker image is built on Node.js 18-alpine
- Explains dependencies are installed
- Explains port 3000 is exposed
```

### **Document 2: docker-compose.yml**
```
Show the docker-compose.yml file
- Shows MongoDB service configuration
- Shows Node.js app service configuration
- Shows networking between services
- Shows volume for data persistence
```

### **Document 3: Command Output**

**Screenshot/Show:**

```powershell
# 1. Docker installation verification
PS> docker --version
Docker version 26.0.0, build xxxxx

# 2. Build image
PS> docker build -t student-app .
Successfully built student-app:latest

# 3. Verify images
PS> docker images
REPOSITORY   TAG    IMAGE ID      CREATED
student-app  latest abc123def456  2 min ago

# 4. Start containers
PS> docker-compose up -d
✓ Container student-app-mongodb Created
✓ Container student-app Created

# 5. Verify running
PS> docker ps
CONTAINER ID  IMAGE        NAMES
abc123def456  student-app  student-app
xyz789uvw012  mongo:7.0    student-app-mongodb

# 6. Check logs
PS> docker logs student-app
✅ Connected to MongoDB
listening on port 3000
```

### **Document 4: Docker Desktop Screenshots**
1. Containers tab showing both running containers
2. Console tab showing live logs
3. Statistics showing CPU/Memory usage
4. Volumes showing MongoDB data persistence

### **Document 5: Application Screenshots**
1. Login page at http://localhost:3000
2. Registration successful message
3. Login successful with user info
4. Course list displaying
5. Course registration confirmation

---

## **FINAL CHECKLIST FOR PROFESSOR SUBMISSION**

- ✅ Dockerfile created and working
- ✅ docker-compose.yml created and working
- ✅ .dockerignore created
- ✅ server.js updated with environment variables
- ✅ Docker image built successfully
- ✅ Both containers running (Node.js + MongoDB)
- ✅ Application accessible at http://localhost:3000
- ✅ Can register users
- ✅ Can login users
- ✅ Can view courses
- ✅ Can register for courses
- ✅ Database persists data
- ✅ All logs showing proper connections

---

## **EXPLANATION FOR YOUR PROFESSOR**

**What You Did:**

1. **Created Dockerfile** - Defines how to build Docker image
2. **Created docker-compose.yml** - Defines all services and how they work together
3. **Built Docker image** - Packaged your app with Node.js
4. **Started containers** - Created and ran MongoDB and Node.js containers
5. **Verified everything** - Showed that app and database are working together

**Why Docker is Important:**

✅ **Portability** - Your app runs the same on any computer with Docker
✅ **Isolation** - App and database are isolated in containers
✅ **Easy Deployment** - Can deploy to cloud without installing Node.js or MongoDB locally
✅ **Scalability** - Can run multiple containers of your app
✅ **Consistency** - Development, testing, and production environments are identical

---

**THAT'S IT! You're done! 🎉**

---

Last Updated: May 26, 2026
Status: ✅ Ready for Professor Submission
