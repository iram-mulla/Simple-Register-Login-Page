// Handle Login Form
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showMessage('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = '/home';
                    }, 1500);
                } else {
                    showMessage(data.error, 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage('Error connecting to server', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Handle Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                showMessage('Passwords do not match!', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage('Password must be at least 6 characters long', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Registering...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showMessage('Registration successful! Redirecting to login...', 'success');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1500);
                } else {
                    showMessage(data.error, 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Registration error:', error);
                showMessage('Error connecting to server', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Load courses on home page
    if (window.location.pathname === '/home') {
        checkLoginAndLoadData();
    }
});

// Check login status and load data
async function checkLoginAndLoadData() {
    try {
        const response = await fetch('/api/check-login');
        const data = await response.json();
        
        if (data.loggedIn) {
            displayWelcomeUser(data.user.name);
            loadCourses();
            loadMyCourses();
        } else {
            // Not logged in, redirect to login
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Error checking login:', error);
    }
}

// Show message function
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = type;
        messageDiv.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Load available courses
async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
            throw new Error('Failed to load courses');
        }
        const courses = await response.json();
        
        const coursesList = document.getElementById('coursesList');
        if (!coursesList) return;
        
        coursesList.innerHTML = '';
        
        if (courses.length === 0) {
            coursesList.innerHTML = '<p class="text-center">No courses available</p>';
            return;
        }
        
        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'col-md-6 mb-3';
            courseCard.innerHTML = `
                <div class="course-card">
                    <h5 class="course-title">${course.courseName}</h5>
                    <p class="course-info"><strong>Course ID:</strong> ${course.courseId}</p>
                    <p class="course-info"><strong>Instructor:</strong> ${course.instructor}</p>
                    <p class="course-info"><strong>Credits:</strong> ${course.credits}</p>
                    <p class="course-info"><strong>Available Seats:</strong> ${course.availableSeats}</p>
                    <button class="register-btn" onclick="registerForCourse('${course.courseId}')">Register for Course</button>
                </div>
            `;
            coursesList.appendChild(courseCard);
        });
    } catch (error) {
        console.error('Error loading courses:', error);
        const coursesList = document.getElementById('coursesList');
        if (coursesList) {
            coursesList.innerHTML = '<p class="text-center text-danger">Error loading courses</p>';
        }
    }
}

// Load user's registered courses
async function loadMyCourses() {
    try {
        const response = await fetch('/api/my-courses');
        if (!response.ok) {
            throw new Error('Failed to load registered courses');
        }
        const courses = await response.json();
        
        const myCoursesList = document.getElementById('myCourses');
        if (!myCoursesList) return;
        
        myCoursesList.innerHTML = '';
        
        if (courses.length === 0) {
            myCoursesList.innerHTML = '<li class="list-group-item text-muted">No courses registered yet</li>';
        } else {
            courses.forEach(courseId => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.textContent = courseId;
                myCoursesList.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Error loading my courses:', error);
    }
}

// Register for a course
async function registerForCourse(courseId) {
    try {
        const response = await fetch('/api/register-course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ courseId })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('✅ Successfully registered for course!');
            loadMyCourses(); // Refresh the list
        } else {
            alert('❌ ' + (data.error || 'Failed to register for course'));
        }
    } catch (error) {
        console.error('Error registering for course:', error);
        alert('❌ Error registering for course');
    }
}

// Display welcome message
function displayWelcomeUser(name) {
    const welcomeElement = document.getElementById('welcomeUser');
    if (welcomeElement) {
        welcomeElement.textContent = `Welcome, ${name || 'User'}!`;
    }
}

// Logout function
async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });
        
        if (response.ok) {
            window.location.href = '/login';
        } else {
            alert('Logout failed');
        }
    } catch (error) {
        console.error('Error logging out:', error);
        alert('Error logging out');
    }
}