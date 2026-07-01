SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
Job Portal Backend System - Spring Boot, JWT, Google OAuth2
1. Project Overview
Hệ thống tuyển dụng gồm Admin, Recruiter, Job Seeker. Xác thực bằng Email hoặc Google OAuth2. Hỗ trợ đăng tuyển, ứng tuyển, lưu việc làm, quản lý công ty, audit log và soft delete.
2. Business Rules
BR-01: Email là định danh duy nhất.
BR-02: Mỗi User chỉ thuộc một User Type.
BR-03: Recruiter phải thuộc ít nhất một công ty mới được đăng tin.
BR-04: Job Seeker chỉ được lưu 1 job duy nhất cho mỗi job.
BR-05: Soft Delete áp dụng cho dữ liệu nghiệp vụ.
BR-06: Mọi thao tác CREATE/UPDATE/DELETE phải ghi Audit Log.
3. Functional Requirements
Authentication:
- Đăng ký tài khoản.
- Đăng nhập Email/Password.
- Đăng nhập Google OAuth2.
- Refresh Token.
- Logout.

Recruiter:
- CRUD Company.
- CRUD Job.
- Quản lý Company Members.

Job Seeker:
- Cập nhật hồ sơ.
- Quản lý kỹ năng.
- Lưu việc làm.
- Ứng tuyển việc làm.

Admin:
- Quản lý User.
- Quản lý Category.
- Quản lý Skill.
- Xem Audit Logs.
4. Revised ERD & Database Design
Các bảng được chuẩn hóa và bổ sung Audit Log, Refresh Token, Admin Profile, Job Application.
5. Table Specifications & Sample Data
USERS
Fields:
• user_id PK
• email UNIQUE
• password
• provider NOT NULL DEFAULT ‘LOCAL’
• provider_id
• enabled NOT NULL
• user_type_id FK NOT NULL
• created_at NOT NULL DEFAULT NOW()
• updated_at NOT NULL DEFAULT NOW()
Sample Data:
Example USERS: user_id=1, email=admin@jobhub.com
USER_TYPE
Fields:
• user_type_id PK
• user_type_role(ADMIN/RECRUITER/JOB_SEEKER)
Sample Data:
Example USER_TYPE: sample business record
ADMIN_PROFILE
Fields:
• user_id PK/FK
• first_name
• last_name
• phone
• avatar
• department
• created_at
• updated_at
Sample Data:
Example ADMIN_PROFILE: sample business record
RECRUITER_PROFILE
Fields:
• user_id PK/FK
• first_name
• last_name
• phone
• company_position
• city
• country
• profile_image
• created_at
• updated_at
Sample Data:
Example RECRUITER_PROFILE: sample business record
JOB_SEEKER_PROFILE
Fields:
• user_id PK/FK
• first_name
• last_name
• phone
• city
• country
• employment_type
• profile_image
• resume_url
• created_at
• updated_at
Sample Data:
Example JOB_SEEKER_PROFILE: sample business record
JOB_COMPANY
Fields:
• job_company_id PK
• name
• logo
• website
• description
• company_size
• city
• country
• is_verified
• created_at
• updated_at
Sample Data:
Example JOB_COMPANY: sample business record
COMPANY_MEMBER
Fields:
• id PK
• job_company_id FK
• user_id FK
• role
• joined_at
• is_active
Sample Data:
Example COMPANY_MEMBER: sample business record
JOB_CATEGORY
Fields:
• category_id PK
• name
• slug
• icon
• is_active
Sample Data:
Example JOB_CATEGORY: name=Software Development
JOB_SUBCATEGORY
Fields:
• subcategory_id PK
• category_id FK
• name
• slug
• is_active
Sample Data:
Example JOB_SUBCATEGORY: sample business record
SKILL_CATEGORY
Fields:
• skill_category_id PK
• name
Sample Data:
Example SKILL_CATEGORY: sample business record
SKILLS
Fields:
• skill_id PK
• skill_category_id FK
• name
• slug
Sample Data:
Example SKILLS: sample business record
JOBS
Fields:
• job_id PK
• job_company_id FK
• posted_by_user_id FK
• category_id FK
• subcategory_id FK
• title
• description
• type
• remote
• salary_min
• salary_max
• salary_currency
• city
• country
• status
• deadline_date
• created_at
• updated_at
• deleted_at
Sample Data:
Example JOBS: title=Senior Java Developer, salary_min=1500, salary_max=3000
JOB_REQUIRED_SKILLS
Fields:
• id PK
• job_id FK
• skill_id FK
• importance
Sample Data:
Example JOB_REQUIRED_SKILLS: sample business record
JOB_SEEKER_SKILLS
Fields:
• id PK
• job_seeker_profile_id FK
• skill_id FK
• experience_level
• years_of_experience
Sample Data:
Example JOB_SEEKER_SKILLS: sample business record
JOB_SEEKER_SAVED
Fields:
• id PK
• user_id FK
• job_id FK
• created_at
Sample Data:
Example JOB_SEEKER_SAVED: sample business record
JOB_APPLICATION
Fields:
• application_id PK
• job_id FK
• job_seeker_id FK
• resume_url
• cover_letter
• status
• created_at
• updated_at
Sample Data:
Example JOB_APPLICATION: sample business record
REFRESH_TOKEN
Fields:
• token_id PK
• user_id FK
• token
• expired_at
• revoked
• created_at
Sample Data:
Example REFRESH_TOKEN: sample business record
AUDIT_LOG
Fields:
• audit_log_id PK
• user_id FK
• entity_name
• entity_id
• action
• old_value
• new_value
• ip_address
• user_agent
• created_at
Sample Data:
Example AUDIT_LOG: sample business record
6. Relationships & Constraint Names
FK_USERS_USER_TYPE
FK_ADMIN_PROFILE_USER
FK_RECRUITER_PROFILE_USER
FK_JOB_SEEKER_PROFILE_USER
FK_COMPANY_MEMBER_COMPANY
FK_COMPANY_MEMBER_USER
FK_JOBS_COMPANY
FK_JOBS_POSTED_BY_USER
FK_JOBS_CATEGORY
FK_JOBS_SUBCATEGORY
FK_JOB_REQUIRED_SKILLS_JOB
FK_JOB_REQUIRED_SKILLS_SKILL
FK_JOB_SEEKER_SKILLS_PROFILE
FK_JOB_SEEKER_SKILLS_SKILL
FK_JOB_APPLICATION_JOB
FK_JOB_APPLICATION_JOB_SEEKER
FK_REFRESH_TOKEN_USER
FK_AUDIT_LOG_USER
UQ_USERS_EMAIL
UQ_JOB_SEEKER_SAVED_USER_JOB
UQ_COMPANY_MEMBER_USER_COMPANY
7. Non Functional Requirements

- JWT Authentication.
- OAuth2 Google Login.
- Response time < 2s.
- Audit logging.
- Soft delete strategy.
- Pagination and filtering.
- RESTful API design.
- Swagger/OpenAPI documentation.
- MySQL database.
- Spring Security.
