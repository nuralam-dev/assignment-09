FixMate 🔧
Smart Device & Home Appliance Repair Service Platform
FixMate is a full-stack repair service booking platform where customers can discover repair services, request appointments, track repair progress, and pay securely after a job is completed. Technicians manage their services and assigned repair requests, while administrators oversee users, services, bookings, and transactions.
Project: Programming Hero Assignment 9 · Category 006
Payment environment: Stripe Test Mode. No real payments are processed in the demo.

🌐 Live Website
- Client Site Live Link: https://fixmate-client-orpin.vercel.app
- Server Site Live Link: https://fixmate-server-five.vercel.app
- Public services API: https://fixmate-server-five.vercel.app/api/services
✨ Features
Customer
- Create an account and sign in securely.
- Browse approved repair services by category.
- Search, filter, and sort services (subject to the deployed implementation).
- View service details and request a repair booking.
- Review booking status and cancel eligible requests.
- Pay for completed, unpaid repair jobs through Stripe Checkout in test mode.
- View payment history and manage profile information.
Technician
- Manage a technician profile and repair service listings.
- Submit services for administrator approval.
- Edit, remove, and control availability of owned services.
- Review assigned customer bookings.
- Accept or reject requests, update repair progress, and set the final amount upon completion.
- View payment history related to completed jobs, if enabled in the deployment.
Admin
- View an administrative dashboard.
- Manage users and their roles.
- Approve or reject technician service listings.
- Monitor bookings and payment transactions.
Platform
- Role-based access for Customer, Technician, and Admin.
- Secure authentication using Better Auth.
- REST API backed by MongoDB.
- Responsive layouts for desktop, tablet, and mobile.
- Payment processing with Stripe Checkout and server-side payment verification.
- Image uploads and service images (ImgBB integration, where configured).
- Loading, empty, and error states throughout the application.
🛠️ Tech Stack
Layer	Technologies
Frontend	Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, React Icons
Authentication	Better Auth, MongoDB adapter
Backend	Node.js, Express.js (JavaScript / ES Modules)
Database	MongoDB Atlas, MongoDB Native Driver
Payments	Stripe Checkout and Webhooks (Test Mode)
Image Hosting	ImgBB (where configured)
Deployment	Vercel (client and server)


🔄 How FixMate Works
1. Explore services: Customers find a suitable repair service.
2. Book a repair: A customer submits a request with the required details.
3. Technician handles the job: The assigned technician accepts the request, updates its status, and completes the repair.
4. Pay securely: After the job is completed and a final amount is set, the customer pays through Stripe Test Mode.
5. Track records: The customer and administrator can view relevant payment information.
Booking and Payment Status
A typical successful booking follows this progression:
requested → accepted → in-progress → completed → paid
A technician may reject a requested booking, and a customer may cancel an eligible request. Payment should only be initiated for a completed, unpaid booking belonging to the authenticated customer.
📁 Project Structure
The frontend and backend are deployed as separate applications. Exact folder names may differ across your repositories.

Frontend (Next.js)
src/
├── app/                 # Pages, routes, layouts, and API handlers
├── components/          # Shared UI and homepage components
└── lib/                 # Authentication and utility functions
public/                  # Static assets
Backend (Express)
src/
├── config/              # MongoDB configuration
├── routes/              # Users, services, bookings, and payment routes
└── middleware/          # Authentication and authorization (if separated)
🚀 Run Locally
Prerequisites
- Node.js and npm
- A MongoDB Atlas database
- Stripe Test Mode account
- ImgBB API key if image uploads are enabled
1. Clone the repositories
# Frontend
git clone https://github.com/nuralam-dev/assignment-09.git

# Backend
git clone https://github.com/nuralam-dev/fixmate-server.git
2. Install dependencies
In each project folder, run:
npm install
3. Configure environment variables
Create a .env.local in the frontend and a .env in the backend, following the actual variables referenced by your code.

Frontend .env.local (example)
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace_with_a_secure_secret
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_API_URL=http://localhost:4000
Backend .env (example)
PORT=4000
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_test_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_test_webhook_secret
Important: These are examples, not a complete or verified environment-variable contract. Check your existing source code for any additional keys (including ImgBB, token signing, and Better Auth settings). Never commit .env or .env.local files or publish real credentials.

4. Start the backend
npm run dev
The example API base URL is http://localhost:4000 when the backend runs on port 4000.
5. Start the frontend
In a second terminal:
npm run dev
Open http://localhost:3000.
If your backend does not define npm run dev, use the start script specified in its package.json. Check MongoDB connectivity and local environment settings before testing authenticated routes.

💳 Stripe Test Payment
FixMate uses Stripe Test Mode for demo payments. For a standard successful card payment test in Stripe's sandbox:
Field	Test value
Card number	4242 4242 4242 4242
Expiration	Any valid future date
CVC	Any three digits
Cardholder name	Test Customer


A successful checkout should be confirmed server-side, the related booking should become paid, and the payment should appear in the applicable history/transaction views. The app must prevent duplicate payments for the same booking.
🔐 Roles & Security
- Private API routes require valid authentication and the appropriate role.
- Customers should access only their own bookings and payment records.
- Technicians should modify only their own services and assigned jobs.
- Administrators control service approval and management operations.
- Payment amounts and statuses must be verified on the backend rather than trusted from browser input.
- Stripe webhook signatures should be verified and payment updates should be idempotent.
🧪 Demo Accounts
Use the test accounts provided privately in the official assignment submission form:
- Admin
- Technician
- Customer
Do not put test account passwords, database connection strings, or API keys in this public README.
📦 GitHub Repositories
- Client Site Repo: https://github.com/nuralam-dev/assignment-09
- Server Site Repo: https://github.com/nuralam-dev/fixmate-server
📌 Assignment Submission
Programming Hero · Assignment 9 · Category 006

The submission form requests:
- Admin test email and password
- Technician test email and password
- Customer test email and password
- Client live link
- Server GitHub repository URL
- Client GitHub repository URL
Enter credentials only in the designated private submission fields.
📄 License
Created as an educational assignment project. No separate open-source license is declared in this README.