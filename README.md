# 🎓 School Management System (SBV)

A complete **full-stack school management application** built with **React (JSX)**, **Node.js + Express**, **MongoDB**, and **Tailwind CSS**.

---

## ✨ Features

### 🔐 **Authentication**
- JWT-based login system
- Role-based access control (Admin, Teacher, Student)
- Secure password hashing with bcryptjs
- 24-hour token expiration

### 👨‍💼 **Admin Dashboard**
- **Register Students** - Complete student onboarding with guardian details
- **Register Teachers** - Add teachers with qualifications and specialization
- **Create Classes** - Set up classes with capacity and teacher assignment
- **Create Batches** - Manage academic batches/years
- **Statistics Overview** - View total students, teachers, classes, and batches
- **System Status** - Monitor system health

### 👨‍🏫 **Teacher Dashboard**
- **View Students** - See all students assigned to your classes
- **Profile Management** - Edit qualifications and specialization
- **Register Students** - Add students under specific classes
- **Class Overview** - Manage assigned classes

### 👨‍🎓 **Student Dashboard**
- **Academic Info** - View class, batch, and registration details
- **Profile Management** - Edit personal information
- **Quick Links** - Access to announcements, attendance, grades

---

## 🚀 Tech Stack

### Frontend
- **React 19** - UI library
- **Tailwind CSS** - Responsive styling
- **React Router DOM** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Database ODM
- **JWT** - Token authentication
- **bcryptjs** - Password hashing

---

## 📋 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### 1️⃣ **Backend Setup**
```bash
cd server
npm install

# Create .env file
MONGO_URI=mongodb://localhost:27017/school-management
JWT_SECRET=your_secret_key_here
PORT=5000
```

#### 2️⃣ **Seed Database**
```bash
npm run seed
```

This creates:
- **Admin:** `pavan@gmail.com` / `admin@2026`
- **Teacher:** `john@school.com` / `Teacher@2026`
- **Student:** `alice@school.com` / `Student@2026`

#### 3️⃣ **Start Backend**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

#### 4️⃣ **Frontend Setup**
```bash
cd client
npm install

# Create .env file
VITE_API_URL=http://localhost:5000/api
```

#### 5️⃣ **Start Frontend**
```bash
npm run dev
```

App runs on `http://localhost:5173`

---

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | pavan@gmail.com | admin@2026 |
| Teacher | john@school.com | Teacher@2026 |
| Student | alice@school.com | Student@2026 |

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login          - User login
POST   /api/auth/register       - User registration
```

### Admin
```
POST   /api/admin/register-student     - Register student
POST   /api/admin/register-teacher     - Register teacher
POST   /api/admin/create-class         - Create class
POST   /api/admin/create-batch         - Create batch
GET    /api/admin/students             - Get all students
GET    /api/admin/teachers             - Get all teachers
GET    /api/admin/classes              - Get all classes
GET    /api/admin/batches              - Get all batches
```

### Teacher
```
GET    /api/teacher/profile            - Get profile
PUT    /api/teacher/profile            - Update profile
POST   /api/teacher/register-student   - Register student
GET    /api/teacher/students           - Get students
```

### Student
```
GET    /api/student/profile            - Get profile
PUT    /api/student/profile            - Update profile
GET    /api/student/dashboard          - Get dashboard data
```

---

## 🔐 Security Features

✅ **JWT Authentication** - Secure token-based auth
✅ **Password Hashing** - bcryptjs with salt rounds
✅ **Role-Based Access Control** - Route protection by role
✅ **Protected Routes** - Frontend route guards
✅ **Input Validation** - Data validation on backend
✅ **CORS Configuration** - Cross-origin handling
✅ **Environment Variables** - Sensitive data protection

---

## 📁 Project Structure

```
sbv/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── admin/              # Admin pages & components
│   │   ├── teacher/            # Teacher pages & components
│   │   ├── student/            # Student pages & components
│   │   ├── utils/              # API utilities
│   │   └── routes/             # Router configuration
│   └── package.json
│
├── server/                      # Node.js Backend
│   ├── config/                 # Database config
│   ├── controllers/            # Route handlers
│   ├── middleware/             # Auth middleware
│   ├── models/                 # Database schemas
│   ├── routes/                 # API routes
│   ├── server.js               # Express app
│   ├── seed.js                 # Database seeding
│   └── package.json
│
├── SETUP_GUIDE.md              # Detailed setup
├── API_TESTING_GUIDE.md        # API documentation
└── README.md                   # This file
```

---

## 🛠️ Development

### Backend Scripts
```bash
npm run dev     # Start with nodemon
npm start       # Start server
npm run seed    # Seed database
```

### Frontend Scripts
```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview build
```

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- **[API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)** - API documentation & testing guide

---

## 🚀 Deployment

### Backend (Heroku)
```bash
git push heroku main
```

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

---

## 📝 Features Implemented

✅ Admin Dashboard with statistics
✅ Student Registration (by Admin & Teacher)
✅ Teacher Registration
✅ Class Creation
✅ Batch Management
✅ Teacher Profile Management
✅ Student Profile Management
✅ Role-based Authentication
✅ Beautiful Tailwind UI
✅ Responsive Design
✅ Protected Routes
✅ JWT Authentication
✅ Database Seeding

---

## 🐛 Troubleshooting

### MongoDB Connection
```bash
# Ensure MongoDB is running
mongod --version

# For local: brew services start mongodb-community (macOS)
# For Windows: Net start MongoDB
```

### Port Issues
Change PORT in `.env` file or kill the process using port 5000

### CORS Errors
Verify backend running on correct port and check frontend `.env`

---

## 💡 Tips

1. Always run seed script to create initial users
2. Keep JWT tokens safe in localStorage
3. Check server logs for detailed error messages
4. Use provided API testing guide for development

---

## 👨‍💻 Author

**Pavan** - School Management System Developer

---

## 📄 License

MIT License - Feel free to use this project!

---

**🎓 Built with ❤️ for educational institutions**

**Happy Learning! 🚀**
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Installation & Setup

### 1. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Then start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free account
- Create a cluster
- Get your connection string

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/school-management
# OR use MongoDB Atlas
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/school-management
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
EOF

# Start the server
npm run dev
# OR
node server.js
```

**Server runs on**: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Frontend runs on**: `http://localhost:5173`

## 📝 Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "admin" | "teacher" | "student",
  phone: String,
  profilePicture: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Student Schema
```javascript
{
  userId: ObjectId (ref: User),
  registrationNumber: String (unique),
  dateOfBirth: Date,
  address: String,
  guardianName: String,
  guardianPhone: String,
  batchId: ObjectId (ref: Batch),
  classId: ObjectId (ref: Class),
  enrollmentDate: Date
}
```

### Teacher Schema
```javascript
{
  userId: ObjectId (ref: User),
  employeeId: String (unique),
  department: String,
  qualifications: String,
  specialization: String,
  classIds: [ObjectId] (ref: Class),
  joiningDate: Date
}
```

### Class Schema
```javascript
{
  name: String,
  classCode: String (unique),
  description: String,
  capacity: Number,
  teacherId: ObjectId (ref: Teacher),
  batchId: ObjectId (ref: Batch),
  isActive: Boolean
}
```

### Batch Schema
```javascript
{
  name: String,
  batchCode: String (unique),
  description: String,
  startDate: Date,
  endDate: Date,
  strength: Number,
  isActive: Boolean
}
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Admin Routes (Protected)
- `POST /api/admin/register-student` - Register new student
- `POST /api/admin/register-teacher` - Register new teacher
- `POST /api/admin/create-class` - Create new class
- `POST /api/admin/create-batch` - Create new batch
- `GET /api/admin/students` - Get all students
- `GET /api/admin/teachers` - Get all teachers
- `GET /api/admin/classes` - Get all classes
- `GET /api/admin/batches` - Get all batches

### Teacher Routes (Protected)
- `GET /api/teacher/profile` - Get teacher profile
- `PUT /api/teacher/profile` - Update teacher profile
- `POST /api/teacher/register-student` - Register student
- `GET /api/teacher/students` - Get assigned students

### Student Routes (Protected)
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile
- `GET /api/student/dashboard` - Get dashboard data

## 🔐 Demo Credentials

These are default accounts after initial setup:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | Admin@123 |
| Teacher | teacher@school.com | Teacher@123 |
| Student | student@school.com | Student@123 |

**⚠️ Important**: Change these credentials in production!

## 🎨 UI Features

- **Gradient Backgrounds**: Beautiful gradients for each role (Blue for Admin, Green for Teacher, Purple for Student)
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Interactive Components**: Smooth transitions and hover effects
- **Dark Mode Ready**: Tailwind CSS includes dark mode utilities
- **Icons**: Lucide React icons throughout the application
- **Tables**: Professional data tables with pagination support

## 📁 Project Structure

```
sbv/
├── client/
│   ├── src/
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   │   ├── AdminSidebar.jsx
│   │   │   │   └── AdminTopbar.jsx
│   │   │   └── pages/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── RegisterStudent.jsx
│   │   │       ├── RegisterTeacher.jsx
│   │   │       ├── CreateClass.jsx
│   │   │       └── CreateBatch.jsx
│   │   ├── teacher/
│   │   │   ├── components/
│   │   │   │   ├── TeacherSidebar.jsx
│   │   │   │   └── TeacherTopbar.jsx
│   │   │   └── pages/
│   │   │       ├── TeacherDashboard.jsx
│   │   │       └── TeacherProfile.jsx
│   │   ├── student/
│   │   │   ├── components/
│   │   │   │   ├── StudentSidebar.jsx
│   │   │   │   └── StudentTopbar.jsx
│   │   │   └── pages/
│   │   │       ├── StudentDashboard.jsx
│   │   │       └── StudentProfile.jsx
│   │   ├── pages/
│   │   │   └── Login.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── routes/
│   │   │   └── AppRouter.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── server/
    ├── models/
    │   ├── User.js
    │   ├── Student.js
    │   ├── Teacher.js
    │   ├── Class.js
    │   └── Batch.js
    ├── controllers/
    │   ├── authController.js
    │   ├── adminController.js
    │   ├── teacherController.js
    │   └── studentController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── adminRoutes.js
    │   ├── teacherRoutes.js
    │   └── studentRoutes.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── config/
    │   └── db.js
    ├── server.js
    ├── .env
    └── package.json
```

## 🔄 Workflow

### Admin Workflow
1. Login with admin credentials
2. Navigate to admin dashboard
3. Register students/teachers
4. Create classes and batches
5. View all statistics

### Teacher Workflow
1. Login with teacher credentials
2. View dashboard with student list
3. Update profile information
4. Register new students (optional)
5. View assigned classes and students

### Student Workflow
1. Login with student credentials
2. View dashboard with academic info
3. See registration number and class details
4. Update profile information
5. Access quick links for various features

## 🚨 Error Handling

- Validation errors with specific messages
- Authentication errors (invalid credentials)
- Authorization errors (insufficient permissions)
- Database errors with proper logging
- Network error handling on frontend

## 📱 Responsive Design

- **Mobile**: Sidebar collapses to icons
- **Tablet**: Optimized layouts
- **Desktop**: Full feature access

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Protected routes with role-based access
- CORS enabled for secure requests
- Environment variables for sensitive data

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist folder
```

### Backend (Heroku/Railway/Render)
1. Set environment variables on hosting platform
2. Connect MongoDB Atlas database
3. Deploy using git push or CLI

## 📚 Additional Features (Future)

- Attendance tracking
- Grade management
- Course materials upload
- Announcements system
- Email notifications
- File storage (AWS S3)
- Analytics dashboard
- Export reports (PDF)

## 🤝 Contributing

Feel free to fork and submit pull requests for any improvements.

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Made with ❤️ for schools and educational institutions**
