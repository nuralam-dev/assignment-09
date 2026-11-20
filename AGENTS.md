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

## Technician ownership and My Services (2026-11-20)

This implementation request authorizes technician session verification, protected
service creation, and the real My Services listing. These updates supersede the
earlier deferred-auth and sample My Services notes for these endpoints only.

- Inspected installed BetterAuth 1.7.25: this project uses signed cookie/database
  sessions, with no JWT plugin. Reported the required cookie-forwarding integration
  before implementation. No independent JWT issuer, new login system, dependency,
  auth configuration, secret, or database collection was added.
- Backend `src/middleware/verifyToken.js` forwards the cookie to the existing
  BetterAuth `/api/auth/get-session` endpoint with `disableCookieCache=true` and
  `disableRefresh=true`. BetterAuth verifies the cookie signature and persisted
  session; the middleware also checks expiry and session/user ID linkage, then
  attaches only id, name, email and current database role to `req.user`.
- The auth origin comes only from backend `BETTER_AUTH_URL`, then `CLIENT_URL`,
  with localhost:3000 as a development-only fallback. Production requires a
  configured HTTPS frontend origin reachable by Express. Keep the existing
  `/api/auth` mount. Auth responses, tokens and secrets are never returned or
  logged by these middleware. Missing/invalid/expired sessions return 401; auth
  service/configuration failures return a safe 503 and never authorize access.
- Reusable `src/middleware/requireRole.js` enforces the verified role. Both POST
  `/api/services` and GET `/api/services/my` require exactly technician; customer
  and admin receive 403. Private responses use `Cache-Control: private, no-store`.
- `/my` remains before `/:id`; it queries only verified `req.user.email`, ignores
  query/body identity, includes every approval and availability state, sorts by
  createdAt descending, and returns an empty array for an owner without services.
- POST keeps existing business-field validation and derives technicianName/email
  exclusively from `req.user`. Submitted ownership, role, approval, availability
  and date cannot override server values. Defaults remain pending, available true,
  and current createdAt. Public list/details remain unauthenticated and require
  approved plus available. No edit/delete/availability APIs were implemented.
- Frontend `src/app/api/technician/services/route.ts` is a narrow same-origin
  bridge: GET forwards to backend `/services/my`, POST to `/services`. It forwards
  cookies to the configured API prefix, disables caching and redirects, rejects
  cross-origin POST, and does not forward Set-Cookie or auth headers/responses.
  Browser code never reads the HttpOnly session cookie or obtains a fake JWT.
- My Services retains `RolePage`, existing cards, filters, badges and preview
  Edit/Delete controls. `src/components/services/MyServices.tsx` loads actual API
  records with skeleton, safe errors, retry and an empty state. ServiceList accepts
  optional real records and shows stored images, title, category, USD basePrice,
  approval, availability and created date. Other dashboard previews stay samples.
- Add Service uses the same-origin bridge with session credentials and no
  technician identity fields. The existing RolePage guard remains. Successful
  creation shows the existing toast, navigates to My Services and refreshes;
  failure preserves fields and duplicate submission is still prevented.
- Backend `npm test`: 22/22 passed using HTTP auth fixtures and MongoDB driver
  stubs. Coverage includes trusted ownership/defaults, all own states, empty list,
  newest sorting, technician isolation, spoofed identities, 401/403 denials,
  expired/mismatched sessions, safe auth failures and unchanged public visibility.
- A separate temporary harness used the installed real BetterAuth with its memory
  adapter and the actual Express middleware/routes: 24 checks passed, including
  signed-cookie login, blocked public role assignment, tampered credentials,
  current-role changes, sign-out and expiry. No live auth/service records changed.
- An actual-source temporary frontend harness passed 24 fixture checks covering
  real card fields/images/USD/date, badges, empty/loading/error/retry behavior,
  authenticated form payload, success navigation/refresh, failure preservation,
  duplicate prevention, unchanged preview behavior and bridge cookie/origin/error
  handling. These are mocked frontend checks, not a logged-in browser workflow.
- Six live Next.js HTTP smoke checks passed: bridge guest GET/POST 401 with
  private no-store responses, cross-origin POST 403, existing BetterAuth guest
  get-session returning null, and both technician pages emitting sign-in redirects.
  The bridge compares Origin with the incoming Host (and request protocol), since
  Next can construct request.url using a different internal hostname.
- TypeScript no-emit, scoped ESLint, backend existing syntax checks plus both new
  middleware syntax checks, and diff whitespace checks passed. Full lint retains
  the existing `src/hooks/use-mobile.ts:14` set-state-in-effect error. Production
  build compiled and passed TypeScript but failed at the untouched homepage
  `src/components/shared/Footer.tsx:203` current-time prerender error (`new Date`).
- Deployment still needs correct frontend/API origins and backend reachability
  to BetterAuth. A live MongoDB technician browser create/list workflow was not
  tested. No unrelated features or existing records were changed. Stop and await
  the next instruction after reporting this task.

## Technician Edit Service and Availability Toggle (2026-11-20)

This later request authorizes only technician-owned service editing and explicit
availability updates. It supersedes the earlier preview-only Edit notes. Delete
remains a preview; no Delete, Booking, Payment or Admin API was implemented.

- Backend `PATCH /api/services/:id` reuses unchanged `verifyToken` and
  `requireRole("technician")`. It validates ObjectId and accepts only title,
  category, description, image, basePrice, estimatedDuration, serviceMode and
  serviceArea. A simple shared validator in the existing routes file now serves
  POST and PATCH; prior POST field validation, mode normalization and defaults
  remain covered by the regression tests. PATCH rejects empty, unknown and
  protected-field payloads with 400 rather than accepting ownership/status input.
- Edit uses `findOneAndUpdate` with both `_id` and verified `req.user.email` in
  the update filter. A MongoDB `$or` of editable-field `$ne` comparisons ensures
  only actual normalized changes set approvalStatus to pending and updatedAt to
  the current date. No-change submissions return the current owned document and
  preserve approvalStatus and updatedAt. Missing/other-owner documents return the
  same 404. Availability, ownership and createdAt are untouched by edits.
- `PATCH /api/services/:id/availability` requires the same verified technician
  role and ObjectId. It accepts exactly `{ isAvailable: boolean }`; missing,
  non-Boolean or extra fields receive 400. Its atomic MongoDB filter also includes
  owner email. It changes only isAvailable and updatedAt, returns the updated
  owned record, and preserves every approval state. Both PATCH APIs retain safe
  401/403 authentication/role denials and existing JSON/error response patterns.
- Existing public GET list and detail filters are unchanged: only approved plus
  available records are public. Making a pending/rejected service available
  never approves it; editing an approved service hides it pending reapproval.
- Extracted the existing narrow cookie-forwarding bridge into server-only
  `src/lib/technician-services-api.ts`; the existing GET/POST route reuses it.
  Added only PATCH handling under
  `src/app/api/technician/services/[...servicePath]/route.ts`, with validated
  ObjectId and optional availability suffix. Mutation requests retain same-origin
  checking, cookie forwarding, no-store, timeout and redirect rejection. It
  cannot forward arbitrary paths or DELETE. BetterAuth configuration is unchanged.
- `ServiceForm` now also accepts an owned service: all eight editable fields are
  prefilled using raw stored values, including numeric USD price and image URL.
  It sends authenticated PATCH through the same-origin bridge, never ownership
  or approval fields. It preserves inputs on errors, prevents duplicate submits,
  disables fields while saving and reports the actual server result, including
  no-change saves. Existing Add Service and standalone preview behavior remain.
- `TechnicianServiceActions` connects each real card's Edit dialog and controlled
  availability switch. Reused the existing dialog with optional description,
  footer label and busy close prevention; other preview defaults remain intact.
  Added the small `ui/switch.tsx` wrapper using the already installed Base UI
  primitive and existing shadcn-style components/theme; no package was installed.
- Availability sends the explicit requested Boolean and prevents duplicate
  requests. The visible value changes only after a successful server response;
  failure retains the previous value and shows an inline error/toast. Edit and
  availability cannot run together for the same open service. On success,
  MyServices replaces the record with the returned server data and refetches the
  private list, so new approval/availability badges are displayed accurately.
- The request mentioned Sonner, but inspection confirmed the project still uses
  Base UI Toast and has no Sonner dependency. Optional clarification was offered;
  the stated default was to reuse existing toast without adding another package.
  Both new actions use the existing global toast implementation.
- Backend `npm test`: 33/33 passed with an HTTP session-verification fixture and
  MongoDB driver stubs. Added coverage for every editable field, invalid/protected
  input, all no-change approval states, true/false availability, owner filters in
  atomic updates, wrong owner/missing resource, role/session denial, invalid IDs,
  public visibility transitions, concurrent identical edits and safe DB failures.
  Existing POST, My Services and public list/detail regressions passed as well.
- A separate temporary actual-BetterAuth harness passed 38 checks using its
  memory adapter plus actual Express middleware/routes and service driver stubs.
  This includes signed-cookie PATCH ownership/role denials, owner edit reapproval,
  no-change approval preservation, availability preserving pending status and
  existing login, role protection, sign-out and expiry checks.
- A temporary actual-source frontend harness passed 45 fixture checks, including
  prefilled editing, duplicate/busy/error handling, unchanged Add/preview behavior,
  correct PATCH paths/credentials/Boolean payloads, controlled-switch failure
  preservation, edit dialog wiring, server-record replacement/refetch, and bridge
  path/origin/credential restrictions. These are mocked frontend checks, not a
  logged-in browser workflow or proof of live MongoDB persistence.
- Eight live Next.js HTTP smoke checks passed: both PATCH routes return guest
  401 and cross-origin 403, invalid/unsupported paths return 400, and existing
  private GET plus BetterAuth guest get-session behavior are preserved.
- TypeScript no-emit, scoped ESLint for all changed frontend code, backend syntax
  checks and diff whitespace checks passed. Full lint still fails only at the
  existing `src/hooks/use-mobile.ts:14` set-state-in-effect error. Production build
  compiles and passes TypeScript, then hits the existing untouched homepage
  `Footer.tsx:203` current-time prerender error. No unrelated fixes were made.
- No live auth/service records, env files, middleware authentication behavior,
  dependencies or collections were changed. Live MongoDB and signed-in browser
  edit/toggle flows remain unverified. Report this scope and await the next task.

## Technician Delete Service and confirmation dialog (2026-11-20)

This request authorizes technician-owned service deletion with booking/history
protection and a real confirmation dialog. It supersedes prior Delete-preview
notes for the live My Services catalogue; unrelated dashboard previews remain.

- Inspected current auth middleware, service POST/GET/PATCH routes, collection
  handles, empty bookings router, My Services/actions, dialog primitives and API
  bridge before editing. BetterAuth config and middleware behavior are unchanged.
- Authorized read-only live inspection found `bookings` present but empty and no
  `payments` collection. There is no persisted booking serviceId type to verify,
  and the current empty booking router establishes no snapshot/history behavior.
  Do not describe either String or ObjectId as the verified live booking schema.
- Explained this relationship limitation before implementing deletion. The route
  supports both ObjectId and hexadecimal String serviceId references. It hard
  deletes only unreferenced services; completed/rejected/cancelled or unknown
  booking history also blocks deletion, rather than assuming snapshots make a
  hard delete safe. A future requirement to remove referenced services should
  use a separately agreed minimal soft-delete policy. No soft-delete strategy,
  history migration or booking/payment mutation was introduced in this task.
- Backend `DELETE /api/services/:id` uses unchanged verifyToken plus exactly
  requireRole("technician"), validates ObjectId, and finds the service by `_id`
  and verified `req.user.email`. Wrong owner and missing resources both return
  404 without reading their booking/payment relationships. Submitted body/query
  identity and role are ignored. Invalid IDs return 400; session/role denials
  retain 401/403. Auth-service failure remains fail-closed.
- The route checks bookings with requested, accepted or in-progress status and
  returns 409 with exactly: "Cannot delete this service because it has active
  bookings." It then blocks any historical booking or direct serviceId payment
  reference with a safe 409 explaining that availability can be disabled instead.
  Retaining every referenced booking also protects payments linked via bookingId.
- Added only a paymentsCollection handle to existing getCollections for read-only
  reference checks. A handle or read does not create a persisted collection.
  No booking/payment records are deleted or updated. Any failed relationship
  query prevents deletion and uses the existing safe JSON error handler.
- Eligible deletion uses servicesCollection.deleteOne with both ObjectId and
  verified owner email, checks deletedCount, and returns HTTP 200 with
  `{ success: true, message: "Service deleted successfully" }`. A zero count
  returns 404. Existing static GET /my ordering and other service APIs remain.
- Reference checks followed by deleteOne are sequential, not a cross-collection
  lock. Booking creation currently has no implementation. When it is implemented,
  coordinate creation with deletion so concurrent writes cannot create a new
  reference after the deletion checks; do not claim this future race is solved.
- The existing server-only bridge now supports DELETE without forwarding a body.
  The catch-all API route permits only a single valid service ObjectId for DELETE;
  availability/extra path segments are rejected. Cookie forwarding, same-origin
  mutation checks, no-store, timeout, redirect rejection and status propagation
  remain. No browser code reads HttpOnly cookies or submits trusted ownership.
- Added a small shadcn-style `ui/alert-dialog.tsx` built from the already installed
  Base UI AlertDialog primitive and existing Button/theme. The live Delete button
  now opens `DeleteServiceDialog` with the selected service title, irreversible
  warning, distinct red Delete button and Cancel. Cancel gets initial focus;
  keyboard/modal behavior comes from the accessible AlertDialog primitive.
- Deletion requires explicit confirmation, uses a ref to prevent duplicate
  requests, shows Deleting state, and disables confirm/Cancel/dismissal in flight.
  Errors, including the exact active-booking 409, stay in the open dialog with a
  toast and allow retry or cancellation. Success closes the dialog, removes the
  returned service ID from My Services and refetches the authenticated list.
  Edit and availability are disabled while that service's Delete dialog is open.
- Installed only the explicitly requested Sonner dependency (2.0.8) and mounted
  its Toaster beside the existing Base UI Toaster in the root layout. Delete uses
  Sonner success/error notifications. Existing Add/Edit/Availability/auth toasts
  still use their existing Base UI implementation; no notification migration.
- Backend npm test passed 43/43 with HTTP auth fixtures and MongoDB driver stubs,
  including eligible deletion, ownership in deleteOne, 401/403/404/400, all three
  active statuses in both reference types, historical and direct-payment blocking,
  unchanged booking/payment data, unrelated references, deletedCount, repeat calls,
  fail-closed DB failures and all earlier POST/GET/PATCH regression tests.
- A separate installed-real-BetterAuth harness passed 52 checks with its memory
  auth adapter and actual Express routes/middleware plus driver fixtures. DELETE
  checks cover signed cookies, owner/role/session denial, both active reference
  types, history preservation, successful fixture removal and repeat-call 404.
- Actual-source frontend fixtures passed 71 checks covering existing flows and
  Delete open/cancel/confirmation, duplicate prevention, loading, success removal
  and refetch, Sonner notifications, error/409 preservation and bridge restrictions.
- Headless Chrome using the actual DeleteServiceDialog, Base UI, React, Sonner
  and compiled project CSS passed 13 isolated browser fixture checks at 1440px and
  390px: accessible dialog, Cancel focus/no request, no horizontal overflow, busy
  controls, duplicate prevention, 409/retry, toast visibility, removal and no
  uncaught exceptions. Desktop/mobile screenshots were inspected outside the repo.
  These browser requests were mocked; this is not a live logged-in MongoDB flow.
- Six live Next.js HTTP smoke checks passed for DELETE guest 401/no-store,
  cross-origin 403, invalid and unsupported path 400, and unchanged existing guest
  GET bridge/BetterAuth session behavior. No live service deletion was performed.
- TypeScript no-emit, scoped ESLint, backend syntax and whitespace checks passed.
  Initial full lint/build runs encountered the previously recorded use-mobile and
  Footer errors. During this task, separate workspace edits changed use-mobile.ts,
  Footer.tsx and added Copyright.tsx; these were inspected and preserved, not
  authored as part of Delete Service. Final full lint passes. Final production
  build compiles and passes TypeScript, then fails at the separate
  Copyright.tsx:8 client-component current-time prerender error. No unrelated
  fixes were made by this deletion implementation.
- No real user/auth/service/booking/payment records or env values were changed.
  All deletion writes were confined to test fixtures. Stop after reporting this
  scope and wait for the next instruction.

## Technician Manage Requests: Accept/Reject (2026-11-20)

- This request authorizes technician booking listing and requested -> accepted or
  rejected only. No customer booking creation/cancellation, in-progress/completed,
  payments, Stripe or admin work is authorized by this phase.
- Fresh read-only inspection confirmed `fixmateDB.bookings` exists with zero
  documents. The backend booking router was empty: Customer Booking POST is
  missing. Therefore there is no live stored booking schema to verify and no
  customer-to-technician end-to-end flow yet. Do not invent a POST or demo records.
  The UI follows the assignment booking field names until creation is implemented.
- Backend GET `/api/bookings/technician` uses unchanged `verifyToken` then
  `requireRole("technician")`, filters verified req.user.email only, includes all
  statuses, sorts createdAt/_id descending and returns an empty array normally.
- PATCH `/api/bookings/:id/status` accepts exactly one status field, accepted or
  rejected, validates a 24-hex ObjectId and atomically findOneAndUpdates using
  `_id`, verified technicianEmail and status=requested. It modifies only status
  and updatedAt, returns the updated document, and never overwrites customer data.
  Missing/unowned returns identical 404; an owned processed booking returns 409.
  Existing middleware retains 401/403 and safe auth-service 503; DB errors use the
  existing error handler. Concurrent/repeated decisions cannot both succeed.
- During inspection, frontend booking changes appeared in the shared workspace;
  inspected and reused them without overwriting or duplicating functionality:
  `components/bookings/TechnicianRequests.tsx`, technician requests page, narrow
  GET/PATCH booking bridges, and existing `forwardTechnicianApi` utility. They
  were subsequently committed externally during this task.
- `/dashboard/technician/requests` retains RolePage, cards, tabs and status badges,
  uses real private API data with no sample imports, and shows service/customer/
  phone/address/preferred date/problem/USD basePrice/status/optional request date.
  Accept/Reject use same-origin credentials and existing Sonner. Reject uses the
  existing AlertDialog with customer/service information and Cancel initial focus.
  Ref guards and busy controls prevent duplicate submissions/dismissal. Only a
  confirmed success replaces the record and refetches; actions hide afterward.
  Conflicts trigger refresh and disable repeats; errors allow retry. Loading has
  a timeout and cleanup; empty/auth/network/malformed responses are handled.
- Verification: backend npm test passed 54/54 (11 new booking tests plus all 43
  existing service/foundation tests), using HTTP session fixtures and MongoDB
  driver stubs. Covers isolation/all statuses/sorting, acceptance/rejection,
  unchanged fields, invalid IDs/payloads, 401/403/404/409, races and safe failures.
- Actual React/Base UI/Sonner source bundled into a temporary browser fixture
  passed 35 checks: required fields, credentials/payloads, dialog/Cancel focus and
  no-request behavior, duplicate/busy controls, no premature success, status/action
  updates/refetch, errors/conflicts/retry, loading/empty and 390px overflow checks.
  Requests were mocked; this is not a live signed-in MongoDB workflow.
- Nine live guest/API smoke checks passed: booking guest 401, cross-origin 403,
  invalid bridge ID 400, protected requests-page sign-in redirect content, existing
  private services 401 and public services 200. Full lint, TypeScript no-emit,
  production build (25 generated pages), backend syntax and whitespace checks pass.
- No dependencies, secrets, auth configuration, real bookings, collection/index
  setup or unrelated features changed. Live MongoDB status persistence remains
  unverified because no real booking was modified. Report and await instructions.

## Technician Overview dashboard (2026-11-20)

- This request authorizes only the technician overview API and frontend. Existing
  auth, sidebar, Service CRUD, Booking actions, Customer/Admin pages, dependencies
  and environment files are unchanged. Earlier preview overview notes are now
  superseded for `/dashboard/technician`.
- Added backend GET `/api/technician/overview` mounted through a small technician
  router in src/app.js. It reuses unchanged verifyToken and requireRole("technician")
  and existing getCollections, servicesCollection and bookingsCollection handles.
  Every count/find uses verified req.user.email as technicianEmail; incoming query
  identity/role is ignored. No new collection, index or database write is used.
- Response is `{ success: true, message, data: { totalServices, pendingRequests,
  activeJobs, completedJobs, recentRequests } }`. Counts use countDocuments: all
  owned services regardless of approval/availability, requested bookings,
  accepted/in-progress bookings and completed bookings respectively. Empty data
  returns zeros and []. Reads are fresh per request and private/no-store; separate
  queries are not a transactional snapshot across simultaneous database changes.
- Recent requests include all assigned booking statuses, sorted by actual
  createdAt descending with _id descending as a stable tie-breaker and limit(5).
  Projection allows only _id, serviceTitle, customerName, preferredDate, status,
  basePrice and createdAt. Missing document fields are not invented. Database
  failures use the existing safe error handler; session/role failures retain
  401/403 and unavailable authentication stays fail-closed with 503.
- Frontend adds a GET-only same-origin overview bridge using the existing
  forwardTechnicianApi utility (extended resource union with technician). Existing
  cookie forwarding, no-store, redirect rejection and 12-second upstream timeout
  remain. Browser code cannot read the HttpOnly cookie or submit trusted identity.
- Technician page retains RolePage, RoleAccountOverview and PageContainer. New
  TechnicianOverview client component removes this page's sample statistics,
  BookingList, ServiceList and preview notice, reusing existing Card, Panel,
  StatusBadge/Badge, Button/DashboardLink, icons, Skeleton and EmptyState components.
  Other dashboard previews and role pages are unchanged.
- Four cards use the live response; recent rows conditionally show existing fields
  and format basePrice as USD and preferredDate in UTC. View All and Quick Actions
  link to existing requests/add-service/my-services routes. Cards use one/two/four
  columns on mobile/tablet/large desktop with FixMate teal/orange styling.
- Fetch runs on mount or explicit retry, without polling, with same-origin
  credentials, no-store, abort cleanup and a 15-second timeout. Response shape and
  counts are checked before rendering. Loading, zero/empty, 401, 403, network,
  malformed response and generic failure states finish with useful feedback/retry.
  Quick Actions remain available while loading or on errors.
- Verification: backend npm test passed 62/62, including 8 new overview tests and
  all existing foundation/services/bookings regressions. HTTP auth fixtures and
  MongoDB driver stubs test all count groups, five newest rows, projection,
  missing fields, A/B isolation, spoofed identity, empty state, 401/403, expired
  sessions, fail-closed auth/DB errors, read-only behavior and fresh request counts.
- Temporary headless Chrome fixture bundled actual TechnicianOverview/shared UI
  source and project CSS, passing 16 checks for four real response fields, booking
  fields/USD/date, missing-field omission, links, one fetch while idle, loading,
  empty/zero, 401/403/500/network/malformed errors and successful retry. Checked
  1440px/768px/390px grids and no horizontal overflow; desktop/mobile screenshots
  inspected outside the repository. Fixture API data was mocked, not live records.
- Production-server smoke checks passed for guest overview/services/bookings GET
  bridges (401 and private/no-store) plus protected overview sign-in redirect.
  TypeScript no-emit, full ESLint, production build (26 generated pages), backend
  existing syntax checks plus new route/test checks, and whitespace checks pass.
- Authorized read-only live MongoDB inspection found fixmateDB with 1 service and
  0 bookings. The service owner's counts were 1/0/0/0 and recentCount 0; no user
  identities or secrets were printed. No records were inserted or changed.
  A live signed-in technician browser/API flow and populated live recent bookings
  remain unverified. Report actual scope/results and await the next instruction.

## Home Page Our Services API integration (2026-11-20)

- This request authorizes the homepage public-services section only. Inspection
  found that this checkout's homepage rendered only Banner (hero/categories),
  with no existing Our Services section or hardcoded home service records to
  replace. Added a section below Banner using the existing public ServiceCard,
  ServicesLoading and FixMate teal/orange spacing, typography and responsive grid.
  Existing hero, categories, navbar/footer and dashboard work are preserved.
- Verified backend src/app.js mounts the existing services router at
  `/api/services` (the pre-existing duplicate mount is unchanged). GET `/` reads
  the existing servicesCollection with exactly approvalStatus=approved and
  isAvailable=true and sorts createdAt descending. No backend/API/auth/CRUD,
  environment, dependency, database record or approval changes were made.
- New `src/components/services/OurServices.tsx` uses a simple async Server
  Component, a single uncached fetch with a 10-second timeout, response HTTP and
  success/data checks, and result.data rather than the envelope. There is no
  standalone public API utility to reuse; it follows the existing services page
  fetch pattern and the installed Next.js fetching/Suspense guidance.
- Existing NEXT_PUBLIC_API_URL is the API prefix, including `/api` (local
  http://localhost:4000/api), so append only `/services`. Do not change it to a
  bare host: existing public/private integrations depend on this convention.
  No URL is hardcoded into the new component; configuration was not edited.
- The backend's newest-first order is retained. An additional exact visibility
  filter runs before slice(0, 6), never exposing pending/rejected/unavailable
  records. Shared ServiceCard displays stored image, title, category, description,
  USD basePrice, technicianName, serviceArea, duration/mode and existing
  `/services/${_id}` links. View All Services points to `/services` and is available
  in loading/empty/error states too. Existing ServiceCard is unchanged.
- Suspense streams the existing six-card accessible skeleton while fetching.
  Missing config, failed requests and malformed response envelopes show a safe
  error with a normal GET retry to `/#our-services`. Empty responses show a
  friendly no-services state, with no fake cards. No client effect, polling or
  retry loop is used; fetch runs on the server per page request.
- Live read-only MongoDB/API comparison confirmed fixmateDB has 3 services and
  zero approved+available services. GET http://localhost:4000/api/services returned
  200, success:true and data:[]; API IDs exactly matched the MongoDB query. No
  records were inserted, approved or otherwise modified for testing.
- Temporary actual-source fixture checks passed 16/16: result.data, max six,
  preservation of newest-first API order, pending/rejected/unavailable exclusion
  before limit, API prefix, one uncached fetch, shared card fields/image/USD/IDs,
  View All, empty/private-only states, 500/success:false/malformed/network/invalid
  JSON/missing config, retry target and accessible Suspense skeleton.
- Headless Chrome passed 14 checks: six shared-card fixture images load, 1440px/
  768px/390px grids use three/two/one columns without overflow, fixture empty/error/
  loading states have no fake cards, actual production homepage shows the live
  empty state at desktop/mobile sizes with hero/categories/footer intact, live
  View All navigation works, existing absent-detail not-found UI and no uncaught
  exceptions. Screenshots were inspected outside the repository. Next streaming
  may send HTTP 200 with not-found metadata when the response has already begun.
- Backend existing regression tests passed 62/62, including public visibility,
  newest ordering and pending creation/visibility behavior. TypeScript no-emit,
  full ESLint, production build (26 generated pages, homepage now partially
  prerendered), and whitespace checks passed. No new libraries or test records.
- Populated homepage cards and detail link IDs were tested with fixtures, not
  live approved MongoDB documents, because none currently exist. Do not claim a
  successful populated live service-details flow. Stop and await the next task.

## Our Services empty-state investigation (2026-11-20)

- Fresh read-only diagnosis confirmed the exact cause: all 3 documents in
  fixmateDB.services have approvalStatus="pending" (String) and isAvailable=true
  (Boolean). There are zero approved+available services. These are actual stored
  documents, not missing submissions. They require Admin Approval before public
  display; do not bypass approval or automatically approve new services.
- MongoDB connect/ping succeeded. The services collection exists, frontend/backend
  configured MongoDB URIs match (compared without printing credentials), and the
  backend explicitly selects fixmateDB. All sampled documents (the complete 3)
  contain the card's required title/category/image/basePrice/technicianName/
  serviceArea fields, numeric basePrice and Date createdAt. No relevant field-name
  or approval/availability value-type mismatch was found.
- Reconfirmed src/app.js mounts the existing router at /api/services, public GET
  filters approved plus available and sorts createdAt descending, while technician
  POST deliberately sets pending/true. Configured frontend API prefix resolves
  exactly to http://localhost:4000/api/services, without missing/doubled /api.
- Live endpoint returned HTTP 200 with
  { success: true, message: "Services fetched successfully", data: [] }.
  Its returned IDs exactly matched the approved+available MongoDB query. The empty
  response is expected business behavior, not a failed fetch or JSON-envelope bug.
- OurServices correctly uses result.data, exact visibility filtering, slice(0,6)
  and ServiceCard mapping. Live Home Page GET returned 200 and rendered the actual
  Our Services empty state, View All link and existing hero; no services-fetch
  error state was found. Re-ran the existing temporary actual-source fixture
  harness: 16/16 checks passed for populated/empty/private-only/error/loading,
  six-card limit/order, fields/USD/images/links, prefix and response handling.
  Populated checks remain mocked; no live approved records were available.
- No application-code defect was found in this investigation, so only this
  AGENTS.md finding was appended. Existing UI, authentication, API filters,
  frontend/backend code, env configuration and all database records remain
  unchanged. No new tests/dependencies, fake records, approval writes or unrelated
  fixes. Await the user's next instruction; database changes require approval.
