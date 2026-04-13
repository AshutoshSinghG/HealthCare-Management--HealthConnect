# HealthConnect — Healthcare Management System

![HealthConnect Banner](https://via.placeholder.com/1200x400.png?text=HealthConnect+-+Healthcare+Management+System)

**HealthConnect** is a comprehensive, production-grade web application platform built to revolutionize interaction workflows between medical professionals, patients, and system administrators. Delivering a robust micro-service pattern infrastructure utilizing modern **React** frontend and **Node.js/Express.js** backend stacks, it enables end-to-end medical logistics—encompassing everything from intelligent encrypted medical data handling to real-time live chat capabilities seamlessly synchronized across the medical portal.

---

## 🎯 What the Project Is

HealthConnect represents an advanced digital hospital infrastructure mechanism bridging operations across distinct core roles:
- Empowering **Patients** with total transparency regarding their booked appointments, doctor discovery, detailed medical prescriptions, and active treatment schedules.
- Supplying **Doctors** with dynamic shift controls, rapid consultation environments natively injected with real-time WebSocket communication, and detailed patient charting functionalities including medication constraints mapping. 
- Furnishing System **Administrators** with top-down platform authorization controls, high-level analytical dashboards, structured data exporting (PDF/Excel), and deep system-level auditing logs.

It enforces highly secure communication policies backed by structured JWT Refresh/Access strategies interwoven seamlessly with TOTP (Two-Factor Authentication).

---

## ✨ Features and Functionalities

* 🔒 **Role-Based Identity & Security Middleware:** 
  Hierarchical (Admin, Doctor, Patient) strict routing definitions mapping securely to MongoDB models. Includes Multi-Factor Authentication (MFA/2FA) utilizing TOTP for advanced administrative/doctor layers.
* 📅 **Advanced Appointment Slot System:** 
  Intelligent "Virtual" and "Standard" schedule parsing strictly aligned across timezone boundaries automatically computing slot spans based on Doctor-defined availability schedules.
* 💬 **Real-Time Bounded Patient-Doctor Chat:** 
  A seamlessly integrated live interface utilizing **Socket.IO**. Chat scopes are strictly isolated directly to valid temporal boundaries preventing unauthorized out-of-schedule communication while automatically caching history logs.
* ⚕️ **Extensive Medical Formulations Generation:** 
  Doctors can document and iterate Treatment tracking models capturing granular, multi-instance daily prescribed regimens (Oral, Intravenous, etc.), mapping follow-up outcomes, alongside flagging critical "Unsuitable Medicine" warnings securely into patient identities.
* 📄 **Immutable Action Archiving & System Logging:**
  Advanced `Audit Logs` mechanisms tracking `CREATE`, `UPDATE`, `LOGIN`, `LOGOUT`, and `DELETE` requests directly correlated with system models, safeguarding platform accountability. Data endpoints effortlessly expose downloadable exports via `.xlsx` and `.pdf` buffers.
* 🎨 **Bespoke Responsive UI & UX Dashboards:**
  Component-isolated interface mapped flawlessly alongside modern interactive methodologies incorporating dynamic chart metrics (Recharts), fluid Framer-Motion animations, skeleton-loaders (React Query), and complex multi-step validations utilizing Zod schema boundaries.

---

## 🏗 Total Modules & Their Roles (Architecture)

### 1. Patient Module
Serves as the consumer-facing gateway.
* **Dashboard:** Visual overview of upcoming events, past health trends, and latest prescriptions.
* **Doctors Directory:** Browses profiles matching specialty filters to evaluate capabilities or consultation costs.
* **My Appointments:** Books virtual and static timeslots pushing localized requests sequentially back into Doctor queues.
* **Live Chat Area:** Automatically triggers bidirectional sockets granting secure text capacities at the precise instant their booked slot actively begins.

### 2. Doctor Module
Operates as the critical healthcare hub.
* **Patient Database CRM:** Comprehensive interface querying patients tied entirely to doctor-level authorizations preventing cross-doctor data bleeding.
* **Slot & Shift Management:** Rapid deployment capabilities establishing weekly working intervals automatically slicing shift schedules into logical 30-minute availability chunks.
* **Treatment Authoring Engine:** Constructing granular charts mapping medical history.
* **Live Patient Chat:** Simultaneous dynamic window handling patient consultations asynchronously natively through WebSockets.

### 3. Administrator Module
Serves strictly as the platform governance panel.
* **User Aggregates:** Total CRUD mechanisms granting authorizations dynamically.
* **Exporting Core (Reporting):** Dynamically translating complex medical grids into readable flat Excel (`exceljs`) or structured reporting documents (`pdfkit`).
* **Security Sub-System:** Granular tracking of all CRUD events performed against platform entities ensuring absolute immutability.

---

## 🛠 Tools and Technologies Used

### Frontend Stack (Vite + React 18)
* **React 18 & Vite:** Delivering robust rendering cycles with instant HMR compilation. 
* **Tailwind CSS & Headless UI:** Highly scalable multi-viewport component structures supporting strict CSS scopes.
* **Framer Motion:** Handling complex mount/unmount animations rendering polished UI elements.
* **TanStack React Query:** Asynchronous cache-query bindings fetching endpoint schemas effectively resolving hydration loops.
* **React Hook Form & Zod:** Managing complicated nested data objects and strict validation constraints.
* **Socket.IO (Client):** WebSocket bridges mapping real-time text communications.
* **Recharts:** Drawing beautiful analytical health grids for Dashboard interactions.

### Backend Stack (Node.js + Express)
* **Express.js & MongoDB (Mongoose):** Micro-structured MVC backends serving highly structured schema validations mapped directly via Object Relational techniques.
* **JSON Web Tokens & bcrypt:** Advanced dual-token authentication flow (access & refresh) securely caching hashed refresh identifiers.
* **Speakeasy & QRCode:** Handling rigorous TOTP implementations forcing cryptographic login verification natively.
* **Socket.IO:** Synchronized dual-channel event bridges natively resolving temporal overlapping validations enforcing live communication security. 
* **Winston:** Granular endpoint formatting for deployment-grade logging.
* **ExcelJS & PDFKit:** Heavy-duty logic layers producing real-time structural payload exports.

---

## 🚀 Complete Deployment Guide

### Part 1: Deploying the Backend on Render
Render effortlessly handles Node.js applications natively while serving automatic environment configurations.

1. Create an account on [Render.com](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository containing this project infrastructure.
4. Set the following configuration targeting the `backend/` module:
   * **Root Directory:** `backend`
   * **Environment:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `npm start` (or `node src/server.js`)
5. Define the **Environment Variables** in the panel:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
   JWT_SECRET=your_super_secure_secret_key
   JWT_ACCESS_EXPIRES_IN=1h
   REFRESH_SECRET=your_super_secure_refresh_key
   JWT_REFRESH_EXPIRES_IN=7d
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_smtp_email
   EMAIL_PASS=your_smtp_app_password
   # Important: Set to your final frontend URL
   CORS_ORIGIN=https://healthconnect-frontend.vercel.app 
   ```
6. Click **Deploy Web Service**. Render will install packages and serve the backend API.

### Part 2: Deploying the Frontend on Vercel
Vercel perfectly supplements modern frontend applications created with Vite workflows.

1. Establish an account on [Vercel.com](https://vercel.com/).
2. From the Vercel dashboard, click **Add New Project**.
3. Connect your exact GitHub repository.
4. Set up the Vercel configurations exactly as follows targeting the `frontend/` module:
   * **Framework Preset:** `Vite`
   * **Root Directory:** `frontend`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
5. Configure the **Environment Variables** necessary to route the frontend to Render natively:
   ```env
   VITE_API_URL=https://<your-render-app-name>.onrender.com/api
   ```
6. Click **Deploy**. Vercel will process the Tailwind pipeline and expose a live production UI framework URL securely communicating backward perfectly with the Render service.

---

## 💡 Important Notes & Best Practices

1. **MongoDB Access:** Prior to deploying, ensure that your `MONGO_URI` correctly allows inbound external connections via your MongoDB cluster Network Access settings (`0.0.0.0/0` alongside IP whitelisting).
2. **WebSocket WSS:** The frontend application actively connects via native `WS` methodologies. Render properly maps WebSocket upgrades out-of-the-box leveraging their backend environment scaling. 
3. **Admin Setup Configuration:** By default, upon seeding or utilizing empty DBs, ensure you configure a root Admin mapping manually leveraging `Role: 'ADMIN'` through a REST API client (such as Postman) utilizing the `/auth/register` entry definitions.
