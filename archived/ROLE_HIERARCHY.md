# Role Hierarchy & Database Structure

## Organization Structure

```
God (System Administrator)
    └── College
            ├── Super Admin (Principal)
            │   └── Department Head 1 (HOD)
            │       ├── Admin 1 (Assistant)
            │       ├── Admin 2 (Assistant)
            │       └── Admin 3 (Assistant)
            ├── Department Head 2 (HOD)
            │   ├── Admin 1 (Assistant)
            │   └── Admin 2 (Assistant)
            └── Department Head 3 (HOD)
                └── Admin 1 (Assistant)
```

## Role Definitions

### 1. God (System Administrator)
- **Responsibility**: System-wide administration
- **Access**: All colleges, create/manage colleges
- **Actions**: 
  - Create colleges
  - Assign super admins to colleges
  - View all colleges and their hierarchies

### 2. Super Admin (Principal)
- **Responsibility**: Entire college management
- **Access**: Their assigned college only
- **Actions**:
  - View college details
  - Manage department heads
  - Manage department admins
  - View all departments and their staff

### 3. Department Head (HOD - Head of Department)
- **Responsibility**: Manage single department
- **Access**: Their assigned department only
- **Actions**:
  - Manage department admins (assistants)
  - View department details
  - Manage labs/courses in department

### 4. Admin (Department Assistant)
- **Responsibility**: Support department operations
- **Access**: Their assigned department only
- **Actions**:
  - Assist with student management
  - Assist with course/lab management
  - Support department head

## Database Tables

### colleges
```sql
- id (uuid, primary key)
- name (text, unique)
- code (text, unique)
- location, address, established, type, affiliation
- phone, email, website
- created_at, updated_at
```

### super_admin_profiles
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → app_users.id)
- college_id (uuid, foreign key → colleges.id)
- name, email, phone, emp_id (unique)
- qualification, experience, specialization
- joining_date
- created_at, updated_at
```

### department_heads
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → app_users.id)
- college_id (uuid, foreign key → colleges.id)
- name, email, phone, emp_id
- department_name
- qualification, experience, specialization
- joining_date
- created_at, updated_at
```

### department_admins
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → app_users.id)
- college_id (uuid, foreign key → colleges.id)
- department_head_id (uuid, foreign key → department_heads.id)
- name, email, phone, emp_id
- department_name
- qualification, experience
- joining_date
- created_at, updated_at
```

## API Endpoints

### God Routes (`/api/god/`)
- `GET /colleges` - Get all colleges with super admins
- `POST /colleges` - Create new college
- `POST /super-admins` - Create super admin (principal)

### Super Admin Routes (`/api/super-admin/`)
- `GET /college` - Get their college data with department heads
- `POST /department-heads` - Create department head (HOD)
- `POST /department-admins` - Create department admin (assistant)

### Department Head Routes (`/api/department-head/`)
- `GET /department` - Get their department data
- `POST /admins` - Create department admin
- `GET /admins` - List their department admins

## Data Models in app_users

| Role | username | role field |
|------|----------|-----------|
| Principal | empId | SuperAdmin |
| HOD | empId | Faculty |
| Assistant | empId | Admin |
| Student | empId | Student |

## Authentication Flow

### Super Admin (Principal) Login
```
Login with username (empId) + password
    ↓
Backend creates JWT with role=SuperAdmin
    ↓
Frontend stores token
    ↓
SuperAdminDashboard fetches /api/super-admin/college
    ↓
Shows college info with department heads
```

### Department Head (HOD) Login
```
Login with username (empId) + password
    ↓
Backend creates JWT with role=Faculty
    ↓
Frontend stores token
    ↓
DepartmentHeadDashboard fetches /api/department-head/department
    ↓
Shows department info with admins
```

## Related Files

### Backend
- `server/routes/godRoutes.js` - God management routes
- `server/routes/superAdminRoutes.js` - Super admin routes
- `server/controllers/godController.js` - God & Super Admin controllers
- `server/scripts/god_management_setup.sql` - Database schema
- `server/services/godService.js` - Business logic

### Frontend
- `client/src/pages/God/UniversalAdminDashboard.jsx` - God interface
- `client/src/pages/God/SuperAdminDashboard.jsx` - Principal interface
- `client/src/services/godService.js` - API client

## Current Status

✅ Role hierarchy defined  
✅ Database tables ready  
✅ Authentication integrated  
✅ God → Super Admin flow working  
⏳ Super Admin → Department Head (future)  
⏳ Department Head → Admin (future)  

## Next Steps

1. Implement Department Head creation endpoint
2. Implement Department Head dashboard
3. Implement Admin creation endpoint
4. Implement Admin dashboard
5. Integrate labs/courses management
6. Add permissions matrix

