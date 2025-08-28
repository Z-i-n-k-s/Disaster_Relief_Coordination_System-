# 🆘 DRCS – Disaster Relief Coordination System

**DRCS** is a comprehensive web-based platform designed to streamline disaster relief efforts by centralizing aid requests, resource management, and volunteer deployment. The platform provides essential functionalities such as real-time tracking, resource allocation, and communication tools to ensure a well-organized and effective response during emergencies.

## 🌊 Motivation

The devastating August 2024 Bangladesh floods affected over **5.8 million people**, highlighting critical gaps in disaster response coordination. DRCS addresses these challenges by providing a centralized platform that enhances response efficiency, minimizes delays, and ensures improved coordination between all stakeholders involved in disaster relief efforts.

## ✨ Features

* 🔑 **Role-based Access Control**
  * **Admin**: Manage relief centers, resources, and coordinate overall operations
  * **Volunteer**: Handle aid preparation, rescue tracking, and field operations
  * **User**: Submit aid requests, track status, and receive assistance

* 📍 **Aid Request Management**
  * Submit, track, and update aid requests in real-time
  * Priority-based request handling
  * Status tracking and response time monitoring

* 🏥 **Relief Center Management**
  * Create and manage relief centers
  * Track center capacity and resources
  * Coordinate distribution points

* 📦 **Resource Management**
  * Monitor and allocate available supplies
  * Handle donations and aid preparation
  * Real-time inventory tracking

* 👥 **Volunteer Deployment**
  * Assignment based on availability and skill set
  * Task management for aid preparation and rescue operations
  * Volunteer performance tracking

* 🚨 **Rescue Tracking**
  * Monitor rescue operations in real-time
  * Track completion status and resource allocation
  * Coordinate emergency response teams

* 🌍 **Affected Area Monitoring**
  * Map and track disaster-affected regions
  * Assess damage levels and priority areas
  * Resource allocation based on severity

## 🛠️ Tech Stack

* **Frontend**: React.js + Tailwind CSS (responsive and user-friendly interface)
* **Backend**: Laravel (PHP Framework) - handles core functionality and APIs
* **Database**: MySQL (efficient data storage and management)
* **Authentication**: JWT-based secure authentication
* **Version Control**: GitHub

## 👥 User Roles

### 🔹 Admin
* Manage relief centers and resources
* Oversee volunteer assignments
* Monitor overall relief operations
* Handle donations and resource allocation

### 🔹 Volunteer
* Execute aid preparation tasks
* Participate in rescue operations
* Update task status and progress
* Coordinate with other volunteers

### 🔹 User (Affected Individual)
* Submit aid requests
* Track request status
* Receive updates on relief efforts
* Access emergency information

## ⚡ API Endpoints

### 🔑 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login user |
| `POST` | `/logout` | Logout user (protected) |
| `GET` | `/me` | Get current user details |
| `GET` | `/token/refresh` | Refresh JWT token |

### 🏥 Relief Centers
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/relief-centers` | Get all relief centers |
| `POST` | `/relief-centers` | Create new relief center |
| `PUT` | `/relief-centers/{id}` | Update relief center |
| `DELETE` | `/relief-centers/{id}` | Delete relief center |
| `GET` | `/relief-centers/{id}` | Get specific relief center |

### 📦 Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/resources` | Get all resources |
| `POST` | `/resources` | Create new resource |
| `PUT` | `/resources/{id}` | Update resource |
| `DELETE` | `/resources/{id}` | Delete resource |
| `POST` | `/resources/donation/{donation}` | Handle donation |
| `POST` | `/resources/aid-prep/{aidPreparation}` | Handle aid preparation |

### 💰 Donations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/donations` | Create new donation |
| `GET` | `/donations/history` | Get user donation history |
| `GET` | `/donations/all` | Get all donations |

### 👥 Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | Get all users |
| `GET` | `/users/currentUser` | Get current user |
| `GET` | `/users/volunteers` | Get all volunteers |
| `POST` | `/users` | Create new user |
| `PUT` | `/users/{id}` | Update user |
| `DELETE` | `/users/{id}` | Delete user |

### 📋 Aid Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/aid-requests` | Get all aid requests |
| `POST` | `/aid-requests` | Create new aid request |
| `GET` | `/aid-requests/{id}` | Get specific aid request |
| `PUT` | `/aid-requests/{id}` | Update aid request |
| `DELETE` | `/aid-requests/{id}` | Delete aid request |
| `GET` | `/aid-requests/user/{userId}` | Get user's requests |
| `PATCH` | `/aid-requests/{id}/status` | Update request status |
| `PATCH` | `/aid-requests/{id}/response-time` | Update response time |

### 🌍 Affected Areas
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/affected-areas` | Get all affected areas |
| `POST` | `/affected-areas` | Create new affected area |
| `GET` | `/affected-areas/{id}` | Get specific affected area |
| `PUT` | `/affected-areas/{id}` | Update affected area |
| `DELETE` | `/affected-areas/{id}` | Delete affected area |

### 🎒 Aid Preparation
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/aid-preparation` | Create aid preparation |
| `PATCH` | `/aid-preparation/{preparationId}/times` | Update preparation times |
| `PATCH` | `/aid-preparation/{preparationId}/status` | Update preparation status |
| `GET` | `/aid-preparation/full-details` | Get all aid preparation details |
| `POST` | `/aid-preparation/{preparationId}/volunteers` | Add volunteer |
| `GET` | `/aid-preparation/{preparationId}/volunteers` | Get volunteers |
| `POST` | `/aid-preparation/{preparationId}/resources` | Add resource |
| `GET` | `/aid-preparation/{preparationId}/resources` | Get resources |

### 🚨 Rescue Tracking
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tracking` | Get all rescue operations |
| `POST` | `/rescue-tracking` | Create rescue operation |
| `GET` | `/rescue-tracking/{id}` | Get specific rescue operation |
| `PATCH` | `/rescue-tracking/{id}` | Update rescue operation |
| `GET` | `/rescue-tracking-volunteers` | Get rescue volunteers |
| `POST` | `/rescue-tracking-volunteers` | Add rescue volunteer |

### 📝 Volunteer Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/volunteers/{volunteerId}/aid-prep-tasks` | Get aid preparation tasks |
| `GET` | `/volunteers/{volunteerId}/rescue-tracking-tasks` | Get rescue tracking tasks |

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/DRCS.git
cd DRCS
```

### 2️⃣ Install Dependencies

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd api-backend
composer install
```

### 3️⃣ Setup Database

1. Install and Open XAMPP and start Apache & MySQL
2. Click Admin of MySQl and open phpMyAdmin to see tables under Database
3. Create a new database named `disaster_relief` in phpMyAdmin
4. Delete  existing migration files if needed

### 4️⃣ Configure Environment

Create a `.env` file in your `api-backend` folder and configure your database connection:

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

```

### 5️⃣ Run Migrations & Start Server

```bash
# In api-backend directory
php artisan migrate
php artisan serve
```



## 🎯 System Benefits

* ⚡ **Faster Aid Delivery**: Real-time tracking ensures timely responses
* 📊 **Efficient Resource Allocation**: Optimized management based on live data
* 🤝 **Improved Coordination**: Streamlined communication among stakeholders
* 🔍 **Transparency & Accountability**: Clear tracking of all relief operations
* 📈 **Enhanced Preparedness**: Data-driven insights for future disasters

## 📌 Future Enhancements

- [ ] Mobile application for field workers
- [ ] Real-time notifications and alerts
- [ ] Integration with weather APIs for early warnings
- [ ] Advanced analytics and reporting dashboard
- [ ] Multi-language support for diverse communities
- [ ] Integration with government disaster management systems


---

**Built with ❤️ for disaster relief and community resilience**
