# God Mode API Reference

## Authentication Required
All God endpoints require:
```
Authorization: Bearer {JWT_TOKEN}
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Endpoints

### 1. Get All Colleges with Super Admins
```
GET /api/god/colleges
```

**Response (200 OK):**
```json
{
  "ok": true,
  "message": "Colleges fetched successfully",
  "data": {
    "colleges": [
      {
        "id": "uuid",
        "name": "MIT Institute of Technology",
        "code": "MIT",
        "location": "Bangalore, Karnataka",
        "address": "123 Tech Street",
        "established": "1995",
        "type": "Private",
        "affiliation": "VTU",
        "phone": "+91-80-12345678",
        "email": "admin@mit.edu",
        "website": "www.mit.edu",
        "superAdmins": [
          {
            "id": "uuid",
            "userId": "uuid",
            "name": "Dr. Rajesh Kumar",
            "email": "rajesh@mit.edu",
            "phone": "+91-98765-12345",
            "empId": "MIT-SA-001",
            "username": "MIT-SA-001",
            "qualification": "Ph.D in Computer Science",
            "experience": "20 years",
            "specialization": "Educational Administration",
            "joiningDate": "2019-08-15",
            "assignedCollege": "MIT Institute of Technology"
          }
        ]
      }
    ]
  }
}
```

**Error (503 Service Unavailable - Schema Missing):**
```json
{
  "message": "Database setup incomplete for God management. Run server/scripts/god_management_setup.sql in Supabase SQL editor, then retry."
}
```

---

### 2. Create New College
```
POST /api/god/colleges
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "XYZ University",
  "code": "XYZ",
  "location": "Mumbai, Maharashtra",
  "address": "456 Education Blvd, Mumbai - 400001",
  "established": "2010",
  "type": "Private",
  "affiliation": "MHRD",
  "phone": "+91-22-98765432",
  "email": "admin@xyz.edu",
  "website": "www.xyz.edu"
}
```

**Response (201 Created):**
```json
{
  "ok": true,
  "message": "College created successfully",
  "data": {
    "college": {
      "id": "uuid",
      "name": "XYZ University",
      "code": "XYZ",
      "location": "Mumbai, Maharashtra",
      "address": "456 Education Blvd, Mumbai - 400001",
      "established": "2010",
      "type": "Private",
      "affiliation": "MHRD",
      "phone": "+91-22-98765432",
      "email": "admin@xyz.edu",
      "website": "www.xyz.edu",
      "superAdmins": []
    }
  }
}
```

**Error (409 Conflict):**
```json
{
  "message": "College name or code already exists"
}
```

---

### 3. Create Super Admin (with Auto-Generated Password)
```
POST /api/god/super-admins
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Dr. Priya Sharma",
  "email": "priya.sharma@xyz.edu",
  "phone": "+91-98765-54321",
  "empId": "XYZ-SA-001",
  "qualification": "Ph.D in Engineering",
  "experience": "15 years",
  "specialization": "Academic Administration & Quality Assurance",
  "joiningDate": "2020-06-01",
  "assignedCollege": "XYZ University"
}
```

**Response (201 Created):**
```json
{
  "ok": true,
  "message": "Super admin created successfully",
  "data": {
    "superAdmin": {
      "id": "uuid",
      "userId": "uuid",
      "name": "Dr. Priya Sharma",
      "email": "priya.sharma@xyz.edu",
      "phone": "+91-98765-54321",
      "empId": "XYZ-SA-001",
      "qualification": "Ph.D in Engineering",
      "experience": "15 years",
      "specialization": "Academic Administration & Quality Assurance",
      "joiningDate": "2020-06-01",
      "assignedCollege": "XYZ University",
      "role": "SuperAdmin"
    },
    "credentials": {
      "username": "XYZ-SA-001",
      "password": "aB3!cD9*eF2@gH"
    }
  }
}
```

**⚠️ IMPORTANT:** The password is shown **ONLY ONCE**. Store it securely!

**Error (409 Conflict - Employee ID Already Exists):**
```json
{
  "message": "Employee ID or email already exists"
}
```

**Error (404 Not Found - College Not Found):**
```json
{
  "message": "Assigned college not found"
}
```

---

## Usage Examples

### Example 1: Create College and Super Admin

```bash
# Step 1: Login as God
curl -X POST http://localhost:5000/api/auth/login/god \
  -H "Content-Type: application/json" \
  -d '{"identifier":"god","password":"god123"}'

# Response contains: token (save this)

# Step 2: Create College
curl -X POST http://localhost:5000/api/god/colleges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Tech Institute",
    "code": "TECH",
    "location": "Pune, Maharashtra",
    "address": "123 Tech Park",
    "established": "2005",
    "type": "Private",
    "affiliation": "SAVITRIBAI PHULE PUNE UNIVERSITY",
    "phone": "+91-20-12345678",
    "email": "admin@tech.edu",
    "website": "www.tech.edu"
  }'

# Step 3: Create Super Admin
curl -X POST http://localhost:5000/api/god/super-admins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Dr. Amit Patel",
    "email": "amit@tech.edu",
    "phone": "+91-98765-12345",
    "empId": "TECH-SA-001",
    "qualification": "Ph.D in Computer Science",
    "experience": "18 years",
    "specialization": "Educational Technology Management",
    "joiningDate": "2021-01-15",
    "assignedCollege": "Tech Institute"
  }'

# Response includes:
# username: TECH-SA-001
# password: (12-char auto-generated password)
```

### Example 2: Super Admin Login

```bash
# Login with generated credentials
curl -X POST http://localhost:5000/api/auth/login/super-admin \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "TECH-SA-001",
    "password": "aB3!cD9*eF2@gH"
  }'

# Response contains JWT token → Can access SuperAdminDashboard
```

### Example 3: Fetch All Colleges

```bash
curl -X GET http://localhost:5000/api/god/colleges \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Returns list of all colleges with their super admins
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Missing/invalid fields |
| 401 | Unauthorized - Invalid token or credentials |
| 403 | Forbidden - Not authorized (not God role) |
| 404 | Not Found - College/Resource not found |
| 409 | Conflict - Duplicate name/code/empId |
| 500 | Internal Server Error - Database/system error |
| 503 | Service Unavailable - Database schema not set up |

---

## Field Validation

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| name | string | Yes | College name, unique |
| code | string | Yes | 2-5 chars, uppercase, unique |
| location | string | No | City, State format |
| address | string | No | Full address |
| established | string | No | Year (e.g., "2010") |
| type | string | No | Government/Private/Autonomous/Deemed |
| affiliation | string | No | University name |
| phone | string | No | Phone number |
| email | string | No | Valid email |
| website | string | No | Valid URL |
| empId | string | Yes | Employee ID, must be unique |
| name (superadmin) | string | Yes | Full name |
| email (superadmin) | string | Yes | Valid email, unique |
| assignedCollege | string | Yes | Must exist in colleges |
| qualification | string | No | e.g., "Ph.D in CS" |
| experience | string | No | e.g., "15 years" |
| specialization | string | No | Area of expertise |
| joiningDate | string | No | YYYY-MM-DD format |

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All IDs are UUIDs
- Passwords are auto-generated and never returned again (security)
- Username = Employee ID (unique per super admin)
- Super admin count auto-calculated from profiles
- JWT tokens expire in 7 days (configurable via JWT_EXPIRES_IN env var)

