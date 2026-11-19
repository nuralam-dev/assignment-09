<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# FixMate — Assignment 9, Category 006

## Scope and working agreement

- This is a beginner-friendly smart device and home appliance repair platform.
- Keep implementations simple, readable, and practical. Do not over-engineer,
  add unnecessary libraries, custom hooks, architecture, or excessive nesting.
- Reuse existing components and patterns; preserve the FixMate design, working
  authentication, and explicit role route folders.
- Explain changes and implementation decisions in simple Bangla.
- Inspect existing files before editing. Make no unrelated modifications.
- Follow the supplied Assignment 9 requirements. Subscriptions, reviews,
  invoices, and other optional features are outside scope unless requested.
- The initial analysis task authorizes only reading, safe read-only inspection,
  a roadmap, and updating this file. It does not authorize implementation,
  dependency installation, authentication/env changes, refactoring, database
  writes, collection/index creation, or changes to any other file.
- After the analysis report, stop and wait for the user's next instruction.
  The roadmap below is future work, not authorization to implement it.

## Verified architecture (2026-11-19)

### Frontend: this repository, `fixmate-client`

- Next.js 16.4.6 App Router, React 19.3.0, TypeScript, Tailwind CSS 4,
  shadcn/Base UI components, React Icons and Lucide.
- `src/app/(root)`: public layout with navbar/footer; `/` renders `Banner`
  with hero image, search navigation, and all seven required category links.
- `src/app/(auth)`: `/sign-in` and `/sign-up` forms call BetterAuth email APIs.
- `src/app/api/auth/[...all]/route.ts`: BetterAuth GET/POST handler.
- `src/lib/auth.ts`: BetterAuth server with MongoDB adapter, email/password
  enabled, role restricted to customer/technician/admin, default customer,
  and `input: false` on role. Preserve public-registration role protection.
- `src/lib/auth-client.ts`: BetterAuth React client and additional-field typing.
- `src/lib/dashboard-access.ts`: database-backed session checks with
  `disableCookieCache: true`, React request memoization, and role redirects.
- `src/app/dashboard`: shared authenticated layout, `/dashboard` role redirect,
  explicit customer/technician/admin folders, and shared `/dashboard/profile`.
  Role pages use `RolePage`; profile checks its authenticated user.
- `DashboardShell` and `components/dashboard/shared`: responsive shadcn sidebar,
  active role navigation, user name/role/initial avatar, home link, and sign-out.
- `components/dashboard/preview`: sample lists, stats, forms, and dialogs.
  Actions do not persist data or process payments; filters run in the browser.
  Booking/payment samples use fixed example identities, not the signed-in user.
- Shared types are in the existing `src/typs` directory; do not rename it casually.
- Notifications currently use `src/components/ui/toast.tsx` with Base UI Toast,
  not Sonner. Reuse this implementation unless a change is requested.
- `next.config.ts` enables Cache Components, partial prefetching, and the React
  Compiler. Preserve request-time session reads behind Suspense boundaries;
  consult the installed Next.js guides before changing these patterns.

### Backend: separate sibling project, `../fixmate-server`

- Express 5, JavaScript ES Modules, MongoDB Native Driver, dotenv, and cors.
- Only source file is `index.js`; no middleware/route modules currently exist.
- Startup connects to MongoDB before listening; default port is 4000.
- Existing endpoints: `GET /` (greeting) and `GET /users` (unprotected,
  unprojected read from the wrong user collection).
- Uses unrestricted `cors()` and global `express.json()`.
- Handles connection failure by logging without rethrowing, so startup can
  subsequently dereference an undefined client. No consistent API error layer.
- JWT verification, role/ownership middleware, business APIs, Stripe dependency,
  webhook handling, and meaningful tests are absent.
- The sibling backend currently has no Git repository or AGENTS.md. This file
  records the cross-project agreement; do not create duplicate instruction files
  or edit the backend during the initial analysis task.

### Environment and database

- Frontend env names: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
- Backend env names: `MONGODB_URI`, `PORT`. Never copy their values into reports.
- Both configurations currently use the same MongoDB URI and explicitly select
  `fixmateDB`. Authorized read-only live inspection found `fixmateDB` and no
  alternate `fixMateDB` in the accessible database listing. Retain `fixmateDB`;
  do not create a case variant or duplicate database.
- Live collections: `user`, `session`, `account`, `verification`.
- **BetterAuth stores users in singular `user`, not `users`.** Adapter defaults
  and the live database agree. Backend `db.collection("users")` is a mismatch.
  Use the existing auth users as the single identity/profile source; do not
  create a duplicate `users` collection or migrate auth naming casually.
- Backend references `services`, `bookings`, and `payments`, but these were not
  present in the live collection listing. Collection handles are not proof of
  persisted business data or implemented functionality.
- Observed indexes: `_id` on each auth collection; unique `user.email`; unique
  `session.token`; `session.userId`; `account.userId`; `verification.identifier`.
  No application collection indexes exist yet. Plan required indexes only when
  database implementation is authorized.
- Observed user fields: `_id`, name, email, emailVerified, role, createdAt,
  updatedAt. Profile image/phone/area/bio were not present in the sampled users.
  Do not assume existing profile persistence supports these fields.

## Current completion and known gaps

- Implemented in code: email auth integration, three-role typing, protected
  dashboard entry/pages, shared dashboard shell, sidebar and sign-out wiring,
  homepage hero/categories, navbar/footer, reusable UI.
- Partially completed: homepage and every business dashboard/profile page.
  Their layouts/forms exist, but statistics and records are previews and actions
  are dialogs. Availability toggling and final amount entry still need work.
- Missing: `/services`, `/services/[id]`, `/about`, repair request form,
  featured latest six approved/available services, How It Works and Why Choose
  FixMate homepage sections, business API integration, and payment result routes.
- Google authentication is only a button/TODO; no Google provider is configured.
- Existing auth uses database sessions. No BetterAuth JWT/JWKS plugin or Express
  JWT verification is configured. A session token is not automatically a JWT.
- Navbar profile link points to nonexistent `/my-profile`; intended shared page
  is `/dashboard/profile`. Hero/footer service/about links target missing pages.
- Signup permits six-character passwords in UI, but installed BetterAuth defaults
  to eight. Signup logs the full success response, potentially including a session
  token; future authorized work must remove sensitive auth response logging.
- Preview data uses BDT, nonrequired categories such as Plumbing, and simplified
  field names (`price`, `status`, `payment`, etc.). Do not reuse these as the
  database schema. Assignment payment currency is USD.
- `auth-client.ts` references server-only env name `BETTER_AUTH_URL` in browser
  code. Same-origin fallback may work; verify deployed origin behavior before
  changing configuration. Never expose private env values to fix this.
- Validation baseline: TypeScript `--noEmit --incremental false` and backend
  `node --check` passed. `npm run lint` fails at `src/hooks/use-mobile.ts:14`
  (`react-hooks/set-state-in-effect`). No fixes made during analysis.
- Needs verification: actual browser sign-in/signup/sign-out, session expiry,
  each role's runtime redirects, admin provisioning, deployment origins,
  production build, and full business workflows. No auth writes or browser
  registration tests were performed during this read-only audit.

## Roles and required routes

Exactly three roles exist; there is no Branch Manager role.

- Customer: browse services, create own repair requests, view/track own bookings,
  cancel only requested bookings, pay completed unpaid jobs, read own payments.
  Routes: `/dashboard/customer`, `/dashboard/customer/bookings`,
  `/dashboard/customer/payments`.
- Technician: create/edit/delete own services, toggle availability, view assigned
  requests, accept/reject/start/complete own jobs and set final amount. Cannot
  approve services, manage users, or create customer bookings.
  Routes: `/dashboard/technician`, `/dashboard/technician/add-service`,
  `/dashboard/technician/my-services`, `/dashboard/technician/requests`.
- Admin: authorized user-role management, all-service approval/rejection,
  read-only all-bookings monitoring, transactions and platform revenue.
  Cannot change their own role; never permit public admin registration.
  Routes: `/dashboard/admin`, `/dashboard/admin/users`,
  `/dashboard/admin/services`, `/dashboard/admin/bookings`,
  `/dashboard/admin/transactions`.
- All authenticated roles may use `/dashboard/profile`. Name, phone, area, bio,
  and photo are editable; email and role are read-only in profile operations.
- Public routes: `/`, `/services`, `/services/[id]`, `/about`, `/sign-in`,
  `/sign-up`. Payment result routes: `/payment/success`, `/payment/cancel`.

## Mandatory API and security rules for future work

- Preserve BetterAuth as the authentication system. Do not add a second login
  system or independent JWT signing flow. First verify the installed BetterAuth
  integration and select its supported session-to-JWT/JWKS approach.
- Implement reusable `verifyToken` then `requireRole("customer" | "technician"
  | "admin")`. Verify signatures, issuer, audience, expiry, and relevant claims;
  decoding a payload alone is never authentication.
- Resolve the authenticated identity and current role on the backend from trusted
  auth/database data. Frontend guards do not protect Express APIs.
- Check ownership for every applicable read and mutation: customers access only
  their bookings/payments; technicians access only their services/assigned jobs.
- Never authorize using submitted customerEmail, technicianEmail, role, or name.
  Derive booking/service identities and price snapshots from trusted data.
- Return 401 for missing/invalid auth, 403 for wrong role, 404 for absent resources;
  keep validation and invalid-transition errors consistent across APIs.
- Whitelist editable fields. Never leak account/password/session data, connection
  strings, secrets, or tokens in responses, logs, documentation, or client bundles.
- Restrict CORS to verified frontend origins when implementing the backend.
- Use simple Express functions, async/await, clear names, MongoDB Native Driver,
  consistent responses, input validation, and explicit error handling.

## Data and workflow contract

- Four application data areas: existing auth `user` (assignment's logical users),
  `services`, `bookings`, `payments`; retain BetterAuth auth collections. No extra
  application collections without a justified requirement.
- Services: title, category, description, image, basePrice, estimatedDuration,
  serviceMode, serviceArea, technicianName, technicianEmail, approvalStatus,
  isAvailable, createdAt. Defaults: pending approval, available true.
- Public listing/details must respect approval/availability; homepage shows latest
  six approved and available services. Implement server-side search, category and
  service-mode filtering, price sorting, and newest sorting.
- Required categories: Smartphone, Laptop & PC, AC, Refrigerator, TV,
  Washing Machine, Electrical. Agree stable mode values before API integration.
- Bookings: serviceId, serviceTitle, serviceImage, category, basePrice,
  technicianName, technicianEmail, customerName, customerEmail, customerPhone,
  address, preferredDate, problemDescription, status, finalAmount, paymentStatus.
  Defaults: requested, unpaid, finalAmount equal to stored service basePrice.
- Reject duplicate active bookings by the same customer for the same service;
  active statuses are requested, accepted, in-progress. Enforce this under
  concurrent requests, not only with a frontend check.
- Only allowed transitions: requested -> accepted/rejected by assigned technician;
  requested -> cancelled by owning customer; accepted -> in-progress by assigned
  technician; in-progress -> completed by assigned technician with finalAmount > 0.
  Use conditional database updates to reject invalid or racing transitions.
- Payments: bookingId, serviceTitle, customerName, customerEmail, technicianName,
  technicianEmail, amount, currency, transactionId, stripeSessionId,
  paymentStatus, paidAt. Stripe Test Mode, currency USD.
- Checkout requires an owned completed unpaid booking; read finalAmount from
  MongoDB. Client input cannot control the amount or mark a booking paid.
- Verify Stripe webhook signatures using the raw request body; account for the
  current global JSON parser when adding the webhook. Verify session/payment
  amount, currency, and booking linkage server-side. Success redirects alone
  are not payment proof.
- Prevent duplicate payment records and double checkout fulfillment with suitable
  unique identifiers/indexes and idempotent processing; keep payment recording
  and booking paymentStatus updates consistent and retry-safe.

## Practical roadmap (requires a later implementation request)

1. Backend foundation/MongoDB: fix `user` collection mismatch, protect the existing
   user-data read, fail startup cleanly, validate configuration, standardize
   errors/CORS, and agree field types and required indexes without duplicating DBs.
2. Auth verification: confirm BetterAuth-compatible JWT issuance/JWKS contract,
   implement signature/claim verification plus current-role middleware; verify
   401/403 behavior and preserve existing auth. Arrange controlled admin access.
3. Services: approved/available public queries and details, required server search/
   filters/sorts, technician-owned CRUD/availability, validation, pending defaults.
4. Bookings: customer-only creation, trusted service snapshot, ownership, active
   duplicate prevention, customer list/cancellation, customer statistics.
5. Technician workflow: assigned request listing, atomic allowed transitions,
   completion with positive finalAmount, technician statistics.
6. Admin/profile: safe role updates with self-change prohibition, service approval,
   read-only bookings/status filters, profile field updates and admin statistics.
7. Stripe: eligible Checkout, signature-verified webhook, duplicate prevention,
   consistent paid state, customer history and admin transactions/revenue in USD.
8. Frontend integration: reuse preview UI, replace sample identities/data with
   authorized APIs, add missing public/home/request/payment pages, complete forms,
   align categories/currency/schema, fix broken links and auth UI gaps; include
   loading, empty, success, and error feedback.
9. Verification/deployment: resolve existing lint error; test role/ownership denial,
   invalid transitions, concurrent duplicate requests, payment gates and webhook
   retries; verify responsive flows, build, env/origins, and deployment behavior.

Required challenges: server search/filter/sort; verified JWT and role middleware;
server-enforced status pipeline/payment gate; verified Stripe webhook with
duplicate-payment prevention. Keep optional enhancements separate.

## Public services integration (2026-11-19, current task)

This later user request authorizes the public Services frontend integration and
its environment configuration. It supersedes the initial analysis-only boundary
for this task. Preserve all other instructions and existing authentication.
The original architecture/gap sections above describe the earlier audit; the
verified updates below supersede those historical details for this feature.

- At the start of this task there was no public `/services` page or standalone
  public Service Card in this checkout. Only dashboard preview cards existed.
  Added `src/app/(root)/services/page.tsx` within the existing navbar/footer layout,
  matching the existing teal/orange design, Card primitives and responsive grid.
  Dashboard preview lists/data and all unrelated routes remain unchanged.
- Backend inspection confirmed `src/app.js` mounts the services router at both
  `/services` and `/api/services`; its GET `/` handler queries MongoDB for exactly
  approved and available records, newest first, and returns
  `{ success: true, message, data: Service[] }`.
- The listing uses a simple async Server Component with uncached fetch, a ten
  second timeout, response status/success/data checks and an additional exact
  approved/available visibility filter. No hardcoded records or preview imports
  are used in the live public listing. Do not substitute sample data on failure.
- Configure `NEXT_PUBLIC_API_URL` as the API prefix, including `/api` and excluding
  `/services`: local value `http://localhost:4000/api`. It is configured in ignored
  `.env.local`; existing private `.env` and BetterAuth settings were untouched.
  Set the appropriate reachable backend origin in deployment; missing config
  shows the friendly error state. Restart development after env changes.
- `src/components/services/ServiceCard.tsx` displays the MongoDB `_id`, image,
  title, category, description, numeric basePrice formatted as USD, technicianName,
  serviceMode, serviceArea and estimatedDuration. Details links use
  `/services/${_id}`. A public `[id]` page does not exist yet and was not added by
  this listing-only task; do not claim a working details screen.
- Remote images use Next Image with per-image `unoptimized` to display the stored
  source URL without broad global remote-host configuration. Existing preview
  ServiceList/Card components were preserved.
- `ServicesLoading.tsx` supplies accessible skeleton cards inside Suspense,
  matching the installed Next.js Cache Components guidance. An empty result shows
  a friendly empty state; failures show a safe message and a normal GET retry
  form that reloads `/services`. Backend errors/secrets are not shown to visitors.
- Verification: live GET `http://localhost:4000/api/services` returned HTTP 200
  with an empty data array. A separate read-only query confirmed `fixmateDB`
  services has zero total/approved-available documents and its IDs match the API.
  No database records were inserted or changed. Populated live MongoDB cards
  cannot be verified until real approved/available records exist.
- Headless Chrome verified `/services` empty state at 1440px and 390px, with no
  horizontal overflow, fake cards or uncaught JavaScript exceptions. Screenshots
  were inspected outside the repository.
- A temporary render harness using actual page/card source and mocked fetch
  verified populated fields, USD price, image URL, correct `_id` link, exclusion
  of pending/rejected/unavailable records, empty/error/malformed response states,
  missing configuration, and accessible loading skeletons. These are fixture
  checks, not evidence of populated live MongoDB data.
- TypeScript `tsc --noEmit --incremental false`, scoped ESLint for the new page
  and components, and `git diff --check` passed. No dependencies were installed;
  backend, auth, dashboard and unrelated public pages were not modified.
- Stop after the requested integration and report; await the next instruction.

## Technician Add Service integration (2026-11-19)

- The current user request authorizes Add Service frontend/backend integration;
  authentication and role middleware remain a later phase. Preserve BetterAuth.
- `/dashboard/technician/add-service` retains its existing `RolePage` guard and
  layout. A small server component calls `requireDashboardUser("technician")`
  and passes only name/email to the existing shared `ServiceForm`.
- `ServiceForm` submits only when supplied technician metadata and no preview
  service. Existing edit/standalone preview modes keep their dialog/file input
  and never POST. Dashboard My Services still uses sample previews; do not claim
  an authenticated private listing has been completed.
- Real creation uses required named inputs, the seven Assignment 9 categories,
  Home Visit/Shop Drop-off modes, positive USD price converted using Number(), and
  an HTTP(S) image URL. There is no image hosting/upload integration; the original
  instruction ended at “Convert basePrice to Number”, and optional clarification
  was requested. No upload provider, secret, dependency, or API was invented.
- Uses `NEXT_PUBLIC_API_URL` API prefix plus `/services`, JSON POST, a 15-second
  timeout, pending/duplicate-submit guards, safe error feedback, existing toast
  notifications and an inline saved-title/approval message. Reset only on success;
  preserve fields on failure. Server alone controls approval, availability/date.
- Session name/email in this temporary POST are metadata, not backend proof of
  identity. The existing POST remains in the explicitly deferred-auth phase;
  later verification must derive identity on the backend.
- Inspected and retained existing POST validation, insertOne and 201 data response,
  approved/available/newest public GET, and ObjectId-validated public detail GET.
- Added fail-closed GET `/api/services/my` before `/:id` in the backend. It returns
  503 without database reads until verified technician identity/role/ownership
  checks exist. Never enable it with email query filtering as authentication.
- New records remain pending and must not be visible on the public Services page.
  No admin approval API was added or real approval status bypassed for testing.
- Backend tests passed 18/18 with driver stubs, including POST persistence/defaults,
  private /my no-read behavior, and POST -> pending hidden -> simulated fixture
  approval -> public list/details -> unavailable hidden. A legacy test URL was
  aligned to the already-existing /api/services mount; user edits to src/app.js,
  including its duplicate services mount, were preserved.
- A temporary actual-form-handler harness verified payload fields, numeric price,
  session metadata, duplicate prevention, disabled fields, success reset, invalid
  price rejection, error preservation and unchanged preview behavior. This is
  mocked-handler testing, not an authenticated technician browser submission.
- Live checks passed for POST validation (no write), /my 503 with spoofed identity,
  public GET, invalid ID 400 and absent ID 404. Read-only MongoDB inspection found
  one existing service and zero approved+available services; public API IDs matched.
- Headless Chrome verified public empty state at desktop/mobile sizes, no overflow
  or uncaught exceptions, and guest Add Service navigation redirecting to sign-in.
  No logged-in technician browser session was available; no test auth/service
  records were created and no existing records changed.
- TypeScript no-emit and scoped ESLint passed. No new libraries, auth/config,
  booking, payment or admin changes were made. Stop and await the next instruction.
