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

## Admin Manage Services: Approve/Reject (2026-11-20)

- This request authorizes admin service listing and pending -> approved/rejected
  review only. Preserve all existing Service CRUD, Booking, overview, sidebar,
  BetterAuth configuration, environment, dependencies and public filters.
- Added backend `src/routes/admin/routes.js`, mounted once at `/api/admin` in
  existing src/app.js. GET `/api/admin/services` uses unchanged verifyToken then
  requireRole("admin"), existing servicesCollection, includes every approval and
  availability state, ignores submitted identity/status filters and sorts by
  createdAt descending with _id descending as tie-breaker. Empty results are [].
- PATCH `/api/admin/services/:id/approval` uses the same guards, validates a
  24-hex ObjectId, and accepts exactly one approvalStatus field: approved/rejected.
  Atomic findOneAndUpdate filters `_id` and approvalStatus=pending, sets only
  approvalStatus and updatedAt and returns the updated document. isAvailable,
  ownership, pricing and other fields are unchanged. Missing returns 404;
  reviewed returns 409. Existing 401/403, safe auth-service 503, and DB error
  handling remain. Repeated/concurrent review cannot both succeed.
- Reused `forwardTechnicianApi` (legacy name retained to avoid unrelated renames),
  extending only its resource union with admin and clarifying its role comment.
  New narrow same-origin GET and PATCH bridges under `src/app/api/admin/services`
  retain cookie forwarding, Origin checks, no-store, timeout, redirect rejection,
  upstream status handling and no forwarding of Set-Cookie/auth headers.
- Admin service page retains RolePage, PageContainer, header and Panel. Replaced
  this page's preview notice/list with `components/services/AdminServices.tsx`.
  Existing unrelated dashboard previews are unchanged. Reuses Card, StatusBadge,
  Button, Tabs, ServicesLoading, AlertDialog, React Icons and existing Sonner.
- Responsive live cards show stored image/title/category, technician name/email,
  USD basePrice, service area, approval, availability and created date in UTC.
  All/Pending/Approved/Rejected filters run locally on the authenticated list.
  Only pending services have Approve/Reject. Reject requires explicit confirmation
  with selected title/technician and initial Cancel focus; Cancel sends no PATCH.
- No optimistic success: confirmed updated records replace the old cards, hide
  actions and trigger GET refetch. Ref guards, disabled controls, spinner labels
  and busy modal dismissal prevention stop duplicate submissions. Errors retain
  pending state and support retry; 404/409 refresh and disable stale actions.
  Fetch uses same-origin credentials, no-store, abort cleanup and 15-second
  timeout; loading/empty/auth/network/malformed/error states terminate properly.
- Public GET list/details remain unchanged: only approved+available is visible.
  OurServices remains uncached per request and shows up to six visible records,
  so ordinary home refresh sees current approvals. My Services remains uncached,
  owner-filtered and shows current approval on refresh. Technician cannot review.
- Verification: backend npm test passed 75/75, including 13 new Admin HTTP tests
  using session fixtures and MongoDB driver stubs, plus all existing services,
  bookings and overview regressions. Covers all states/newest/empty, 401/403,
  expired sessions/auth failures, invalid/protected payloads, 404/409, concurrent
  review, unchanged fields/availability and safe DB errors. Actual route fixture
  POST -> pending -> admin approval -> public list/detail/My Services passed;
  unavailable approval/rejection stayed hidden and another owner saw no services.
- Actual-source React/Base UI/Next Image/Sonner browser fixture passed 43 checks:
  fields/images/USD/date, all filters, credentials/payloads, confirmation/Cancel,
  busy/duplicate controls, no premature success, confirmed statuses/refetch/toast,
  401/403/409/network/malformed/error/retry, initial loading/empty, 3/2/1 columns
  at 1440/768/390px and no overflow, including mobile dialog. No console errors
  in the inspected final fixture tab. Browser HTTP calls were mocked.
- Production build passed (27 generated pages), full ESLint, TypeScript no-emit,
  backend existing syntax checks plus new admin route/test checks and whitespace
  checks passed. Ten live production/guest smoke checks passed: guarded GET/PATCH
  401, invalid cookie 401, cross-origin 403, invalid bridge ID 400, protected Admin
  page sign-in redirect content and unchanged public/private services behavior.
- Fresh read-only live inspection found 2 pending+available and 1 approved+available
  services. API IDs matched MongoDB; live homepage contained only visible detail
  links and public detail APIs respected visibility (200/404). No record was
  approved, rejected, inserted or otherwise modified by this task's tests.
- Live signed-in Admin PATCH persistence and Technician browser refresh were not
  tested against real records. Those updates/flows were verified with driver and
  browser fixtures, not claimed as live MongoDB writes. No collections/indexes,
  dependencies, secrets, auth config or unrelated features changed. Await next task.

## Complete Admin Dashboard (2026-11-20)

- This request authorizes all Admin dashboard pages/APIs and shared profile
  integration. Preserve prior uncommitted service-review work and unrelated
  Customer/Technician functionality. No dependencies, env/auth configuration,
  real records, collections, indexes or schema were added/changed.
- Fixed backend getCollections().usersCollection to physical `user`, matching
  the existing BetterAuth MongoDB adapter. Never recreate physical `users`.
  Updated the booking test's handle-name whitelist accordingly; booking handlers
  and workflows remain unchanged.
- Extended the existing `/api/admin` router with GET `/overview`, `/users`,
  `/bookings`, `/payments` and PATCH `/users/:id/role`. Existing GET `/services`
  and atomic PATCH `/services/:id/approval` are reused without weakening their
  pending-only review or public visibility rules. All endpoints use unchanged
  verifyToken then requireRole("admin"), BetterAuth signed-cookie/database-session
  verification, current trusted role, private/no-store and safe error handling.
- Overview counts total users/customers/technicians/services/pending approvals/
  bookings/active bookings/completed bookings directly in MongoDB. Active means
  accepted or in-progress. Recent service submissions/bookings sort createdAt and
  _id descending, limit five, with safe field projections. Empty counts are zero.
- Users GET projects only _id/name/email/image/role/createdAt. UI searches name/
  email and filters all three roles. Role PATCH validates ObjectId and an exact
  customer/technician-only payload; prohibits self changes (including uppercase
  IDs), admin promotion and demotion of existing admins. Its atomic filter permits
  only current customer/technician roles; only role/updatedAt change. Existing
  BetterAuth account/session relationships are preserved. Confirmation, duplicate
  submission guard, disabled controls, Sonner feedback and refetch are wired.
- Bookings GET is Admin-only, newest first, and projects the existing assignment
  business fields only. UI supports search by customer/technician/service, all six
  status filters, base/final USD amounts, stored payment status and a read-only
  details dialog. No Admin status mutation or Customer booking creation was added.
- Stripe Checkout, webhook verification and a trusted payment producer do not
  exist. Payments GET reads existing records only (reading a collection handle
  does not create it), projects payment fields, sorts paidAt/_id descending and
  returns verificationAvailable:false, revenue:[], and a dependency message.
  Stored paid status alone never establishes payment proof. UI shows actual
  stored records/status/currency if present, labels them unverified/excluded from
  revenue, supports status filtering and a useful empty state. Overview makes no
  revenue claim; different currencies are never added together. Verified revenue
  reporting remains dependent on a later audited payment integration.
- Added five narrow same-origin bridges for overview/users/user-role/bookings/
  payments using existing forwardTechnicianApi. No duplicated backend origin or
  auth system. Existing API prefix, cookie forwarding, Origin check for PATCH,
  no-store, upstream timeout and redirect rejection remain unchanged.
- New components/admin contains AdminData, AdminOverview, AdminUsers,
  AdminBookings, AdminPayments and types/formatters. AdminData centralizes bounded
  authenticated reads, response checks, loading, safe errors, explicit retry and
  refresh without polling. Admin pages retain RolePage, PageContainer, shared
  cards/tables/dialogs and layout. No preview data imports remain in Admin pages.
- Existing AdminServices adds local title/category/technician search alongside
  prior approval filters and real Approve/Reject controls. Existing shared Sidebar
  keeps its responsive/active role navigation; labels now read Manage Services
  and Profile. No Customer/Technician links are added to the Admin menu.
- Shared `/dashboard/profile` now saves name and optional HTTP(S) image URL via
  the existing BetterAuth authClient.updateUser API. It uses the current session,
  never submits another user ID/email/role, prevents duplicate submits, disables
  fields while saving, refreshes the shell, and provides reset/error/success
  feedback. Email/role remain read-only and role input:false remains unchanged.
  Phone/area/bio are not configured BetterAuth fields and no existing persistence
  API supports them, so no schema expansion or nonfunctional inputs were added.
- Backend npm test passed 88/88: 13 new Admin tests plus 75 prior regressions,
  including existing public visibility/review races/technician ownership. New
  fixture coverage includes correct counts/recent-five ordering/empty states,
  safe projections, singular user collection, role round trips and denials,
  read-only bookings/payments, mixed currencies, unavailable verification,
  auth/DB errors and no privileged DB access before authorization. Fixed a
  synchronous cursor-error path that could leave count promises unhandled.
- Temporary actual-source React/Base UI/Sonner browser fixtures passed 68 checks:
  overview fields/links, user search/filter/confirmation/cancel/update/refetch,
  booking search/filter/USD/details, service search/approval, payment filters/
  currency/exclusion, empty/loading/malformed/401/403/500/network/retry, profile
  safe payload/session error/reset, no uncaught exceptions and no page overflow
  at 1440/768/390px for all six screens. Desktop/mobile screenshots inspected.
  Fixture fetch/auth/router/image adapters were mocked; this is not a live signed-in
  Admin browser persistence test. Mobile tables use existing horizontal scrolling.
- Installed real BetterAuth with its memory adapter passed 10 additional checks:
  signed-session profile save/image removal, blocked signup admin assignment,
  blocked role/email edits, ignored alternate identity, guest/tampered-cookie
  denial, and current user/profile readback. No live auth records were written.
- Actual index.js startup on an isolated test port connected/pinged MongoDB.
  Twenty-four live production/guest smoke checks passed: all Admin GET bridges/
  backend denials, guest PATCH and cross-origin denial, invalid cookie, all six
  protected pages, unchanged public visibility and guest profile-update denial.
  Backend test process was stopped afterward. No successful live mutations tested.
- Read-only MongoDB inspection confirmed fixmateDB, physical user and existing
  services/bookings, 3 users, 3 services, zero bookings and no payments collection.
  At that snapshot roles were 2 admins/1 technician; services were 2 pending/1
  approved. A later public API smoke returned 3 approved+available services;
  stored data changed independently during the session. These are observations,
  not fixed statistics or records modified by this task. No identities printed.
- Full frontend ESLint, TypeScript no-emit, production build (31 generated pages),
  backend syntax checks including Admin route/test, and diff whitespace checks
  passed. Temporary fixture/audit scripts and screenshots are outside the repo.
- Remaining dependencies: Customer booking creation and the rest of unfinished
  booking/payment workflows are not implemented by this Admin task. Populated
  live bookings/transactions and live signed-in Admin mutations remain unverified.
  Report actual results and await the next instruction.

## Homepage Why Choose Us and Customer Reviews (2026-11-20)

- This request authorizes two separate homepage UI sections only. Inspected the
  existing homepage, shared Card primitives, component tree, backend route files
  and collection references, and installed Next.js Server/Client Component guide.
  No existing WhyChooseUs/CustomerReviews component or working reviews API/data
  integration was found. No live database review collection inspection was needed
  or performed; no review collection/API/submission system was created.
- Added src/components/home/WhyChooseUs.tsx with the requested heading/subtitle
  and all six supplied feature titles/descriptions. Uses existing shadcn Card/
  CardContent, React Icons, FixMate teal/orange, subtle color hover effects and
  reduced-motion support. Cards keep consistent heights via auto-rows-fr.
- Added src/components/home/CustomerReviews.tsx with the requested heading and
  subtitle and three clearly disclosed development-preview placeholders. Each
  card is labelled Preview placeholder, uses a generic Sample customer label and
  SC initials, five unfilled decorative star icons with Not rated, instructional
  placeholder text and an explicitly labelled example repair service. No genuine
  customer identity, numeric rating, testimonial endorsement or date is invented.
  Real reviews remain dependent on a later verified review system.
- Both components are Server Components without use client, effects, additional
  fetches, dependencies or unnecessary interactive controls. Each reuses the
  existing Card components. Responsive grids use one column below md, two from
  md, and three from xl, matching existing homepage services breakpoints.
- Modified only src/app/(root)/page.tsx to render Banner -> OurServices ->
  WhyChooseUs -> CustomerReviews, plus this AGENTS.md. Existing hero/categories,
  navbar/footer, OurServices implementation/API calls, auth, dashboard, backend,
  environment and database records are unchanged by this task. Prior uncommitted
  Admin work was preserved.
- Verification passed: TypeScript no-emit, full ESLint, production build (31
  generated pages), and git diff --check. No packages were installed.
- Headless Chrome against the actual production homepage passed 35 checks:
  requested headings, six feature cards/icons, three disclosed review placeholders,
  initials/star icons/unrated labels/no fabricated dates, existing hero/navbar/
  footer, section order, equal card heights and grids at 390/768/1024/1440px,
  no horizontal overflow and no uncaught JavaScript exceptions. Desktop/mobile
  screenshots were inspected outside the repo. Temporary browser test server
  was stopped; existing development/backend processes were not stopped.
- Live read-only GET /api/services returned three approved+available records;
  homepage service detail-link IDs matched the first six visible API records
  exactly, with no services-fetch error. These services came from the existing
  backend; review cards are explicitly placeholders, not API-backed testimonials.
  No backend regression suite was rerun because backend code did not change.
- Task complete; report actual results and await the next instruction.

## Customer Dashboard: Phase 1 and booking/payment prerequisites (2026-11-20)

- Latest user request covers the full Customer workflow but explicitly requires
  ordered phases, verification before proceeding, and approval for required
  database schema changes. Only Phase 1 is completed in this handoff; do not
  describe the entire Customer dashboard, booking or payment system as complete.
- Inspected current Customer pages, shared Profile, Service Details, Admin and
  Technician integrations, existing auth/session and cookie bridge, backend
  router mounts, MongoDB handles and booking middleware before implementation.
- Fresh read-only MongoDB metadata confirmed fixmateDB.bookings exists, contains
  zero records and has only its _id index. There is no persisted serviceId type
  to establish. MongoDB topology supports transactions. No database records,
  indexes, collections, environment values or auth configuration were changed.
- Backend has no Customer booking POST/list/cancel or Stripe payment routes yet.
  Stripe SDK is not installed; no STRIPE/payment-currency variable names were
  found in backend env/example or inherited process env. Values were not printed.
  Existing prices/assignment contract are USD; never silently reinterpret them.
- Added backend GET `/api/customer/overview` in src/routes/customer/routes.js and
  mounted it at /api/customer in existing src/app.js. It reuses verifyToken then
  requireRole("customer"), trusted req.user.email, existing bookingsCollection and
  private/no-store responses. Other roles are denied; supplied identity/role is
  ignored. All reads constrain customerEmail to the verified customer.
- Response data: totalBookings, pendingRequests=requested,
  activeBookings=accepted/in-progress, completedBookings=completed,
  recentBookings=latest five by createdAt/_id descending. Projection includes
  only _id/serviceTitle/preferredDate/status/createdAt. Empty is four zeros + [].
  Queries are fresh reads, not a transactional snapshot. Existing error handling
  returns safe auth/DB failures; endpoint never performs a database write.
- Replaced only Customer overview's preview records/stats/actions with
  components/customer/CustomerOverview.tsx. Reuses RolePage, RoleAccountOverview
  for current-session name/welcome, PageContainer, StatsCard, Panel, StatusBadge,
  PageSkeleton, EmptyState, Button, DashboardLink and React Icons. Layout/sidebar
  are unchanged. Overview contains no sample data, simulated actions or polling.
- New GET-only same-origin `/api/customer/overview` bridge reuses existing
  forwardTechnicianApi, adding customer to its resource union only. Existing
  cookie/no-store/timeout/redirect/header handling and auth configuration remain.
- Client validates response counts/list, shows four real stats, five recent
  services/preferred dates/statuses, zero/empty/loading/auth/network/malformed
  feedback, explicit retry/refresh, Browse Services and View All Bookings links.
  Fetch has same-origin credentials, no-store, 15s timeout and abort cleanup.
- Added backend test/customer-overview.test.js (8 tests). Full npm test passed
  96/96, including all prior Admin approval/Service CRUD/Booking/overview tests.
  New HTTP session/driver fixtures verify count groups, five newest, isolation,
  spoofed identity, projections, empty, invalid/expired/mismatched session,
  401/403/503/500, safe errors, no writes and refresh after technician changes.
- Actual-source isolated browser fixture passed 33 checks: four response counts,
  recent rows/date/status, real links, credentials/no-store, one initial fetch,
  zero/empty, 401/403/500/network/JSON/shape errors, retry/manual refresh, missing
  date, loading completion and 4/2/1 grid at 1440/768/390px without overflow.
  Browser fetch was mocked; no live signed-in Customer workflow was tested.
- Six live guest/regression smoke checks passed: overview backend/bridge 401 and
  no-store, Customer page sign-in redirect content, public services 200 and private
  Technician/Admin service bridges 401. Full lint, standalone TypeScript after
  type regeneration, production build (32 generated pages), backend syntax checks
  plus new route/test checks, and whitespace checks passed. An initial standalone
  tsc run raced build's generated route types; after build it passed unchanged.
- Phase 2 is pending explicit approval for a unique partial bookings index on
  customerEmail/serviceId over requested/accepted/in-progress, and coordinated
  transaction-safe booking creation versus existing service deletion. A
  check-then-insert or in-process lock is not acceptable concurrent protection.
  Do not enable a POST that can create orphaned/duplicate bookings. No migration
  or index creation was run. The user's latest creation contract finalAmount:null
  supersedes the old roadmap default when creation is implemented.
- Phase 3–7 are not implemented in this handoff. Existing Customer bookings and
  payments pages still contain earlier previews; Service Details booking link
  and Technician accept/reject-only transitions remain unchanged. Shared Profile
  already securely saves name/image through BetterAuth; phone/area/bio remain
  unsupported and must not be represented as persisted. Stripe Test Mode config,
  SDK, verified producer, raw webhook processing and payment unique identifiers
  remain prerequisites. Request approval/configuration without asking for secrets
  in chat, report this partial scope clearly, then await the next instruction.

## Customer My Bookings: real listing and cancellation (2026-11-20)

- This request authorizes Customer My Bookings integration and owned requested-only
  cancellation. Earlier preview-only notes are superseded for this page. Existing
  uncommitted Customer overview work was preserved. No Admin/Technician page,
  BetterAuth configuration, dependency, env, collection, index or real record changed.
- Root causes: the page rendered preview BookingList/sample field names and dialog
  actions, with no Customer API call. The existing booking router had only
  Technician GET/status PATCH; Customer GET, cancel and POST were absent. Live
  read-only inspection confirmed fixmateDB.bookings has zero documents and only
  its _id index. There is no populated live booking document/type to inspect.
  The UI follows the existing assignment contract/Technician/Admin field names;
  do not describe fixture fields as an observed live document schema.
- Added GET /api/bookings/my to the existing backend booking router, using unchanged
  verifyToken then requireRole("customer"). It filters customerEmail by verified
  req.user.email only, ignores query identity, sorts createdAt/_id descending,
  returns existing success/message/data JSON with [] for an empty owner, and uses
  existing private/no-store and safe auth/database error handling.
- Added PATCH /api/bookings/:id/cancel in the same router. Validates 24-hex ObjectId,
  accepts no booking fields (empty object or absent body), and atomically updates
  with _id + verified customerEmail + status=requested. Only status=cancelled and
  updatedAt change; document/payment/amount fields are preserved. Returns updated
  data on 200, same 404 for absent/unowned, 409 for owned non-requested, 400 for
  invalid input, 401 for invalid/missing session, 403 for non-customer roles.
  Technician acceptance and Customer cancellation cannot both win the same request.
- Added narrow same-origin GET /api/customer/bookings and PATCH
  /api/customer/bookings/[id]/cancel bridges using existing forwardTechnicianApi.
  They forward only fixed business paths/cookies, retain no-store, Origin checks
  on mutations, ObjectId validation, timeout and redirect rejection. Browser code
  does not read the HttpOnly cookie or submit trusted identity/role/status.
- Customer page retains RolePage, PageHeader/Panel and existing design. New
  components/customer/CustomerBookings.tsx reads result.data, validates records,
  shows image/title/technician/created/preferred/address/status/base/final/payment
  using actual contract fields and USD. Missing/broken image, missing values,
  invalid dates and unknown statuses have explicit fallbacks. All plus all six
  booking status filters work locally. Existing shared Base UI Dialog wrapper
  (PreviewDialog, with real description/Close labels) displays full owned details.
- Requested bookings alone show Cancel Booking. Existing AlertDialog requires
  confirmation, initially focuses Cancel, prevents dismissal/duplicate submits
  while busy, and uses installed Sonner success/error notifications. Confirmed
  response updates state and refetches; 404/409 disable stale actions and refetch.
  GET uses same-origin/no-store, abort cleanup and 15s timeout. Loading terminates
  on success/failure; safe errors support retry/sign-in. Empty state reads
  "You haven't booked any services yet." and links Browse Services to /services.
- Stripe SDK/Checkout/webhook/trusted payment producer remain absent. Completed
  unpaid bookings show payment pending/unavailable; no fake Pay Now or paid write
  is introduced. Existing stored paid status is displayed, not certified as proof.
  POST /api/bookings is absent (live POST {} returned 404). It was not implemented
  or replaced by this listing/cancel task; previously documented index/transaction-safe
  creation prerequisites remain outstanding. Never claim existing POST regression
  or end-to-end customer creation/payment was verified.
- Backend npm test passed 107/107, including 11 new customer-bookings HTTP tests
  with session fixtures and MongoDB driver stubs. Covers own/all states/newest/empty,
  identity spoofing/isolation, 401/403/400/404/409/500/503, unchanged fields, repeated
  and concurrent cancellation, and cancellation racing Technician acceptance.
  All existing Technician requests/Customer overview/Admin/Services tests passed.
  npm run check plus new test syntax check passed. Initial sandbox HTTP tests
  hit listen EPERM; the permitted rerun passed without live database writes.
- Actual-source React/Base UI/Next Image/Sonner headless browser fixture passed
  51 checks: response mapping/credentials, fields/USD/dates, seven filters, details,
  confirmation/Cancel focus/no mutation, busy/duplicate prevention, success/refetch,
  error/conflict preservation and retry, empty/loading, malformed/invalid JSON,
  missing fields/broken images, and no overflow at 1440/768/390px including details.
  Screenshots inspected; no uncaught browser exceptions. Fetch was mocked, not
  a live signed-in customer session or live cancellation persistence test.
- Twelve live guest/regression HTTP smoke checks passed: backend/bridge guest
  denials and no-store, invalid-cookie denial, cross-origin 403, invalid bridge ID
  400, protected page redirect, Technician guest denial and public Services 200;
  also confirmed absent booking POST 404. No real customer bookings were modified.
- Frontend TypeScript no-emit, full ESLint, production build (33 generated pages)
  and both repositories' whitespace checks passed. Temporary scripts/screenshots
  remain outside the repositories. Report these results and await next instruction.

## Service booking authentication and creation (2026-11-20)

- This request authorizes the Service Details booking/login flow and secure booking
  creation. Supersedes earlier missing-POST/form notes. Root cause was the static
  /sign-in link in Service Details, with no session check; Sign In always used /
  as callback. No existing form or POST /api/bookings existed. No proxy/middleware
  or verified BetterAuth configuration fault caused this redirect.
- Replaced only that link with components/bookings/BookingRequest.tsx. Reuses
  authClient.useSession: initial isPending disables the button without navigation;
  a verified client Customer session opens the shared Dialog wrapper; guest click
  preserves /services/:id in callbackURL; other roles receive a Customer-only
  message, not a guest redirect. Session lookup errors allow retry, never a fake
  guest decision. Existing BetterAuth config, cookies and backend middleware stay.
- Sign In reads callbackURL only on submit, validates it through the small
  lib/auth-redirect.ts helper, then passes it to existing BetterAuth signIn.email.
  Only an exact /services/24-hex-id path is accepted; whitespace/control characters,
  external/protocol-relative/encoded/query paths fall back to /. Normal sign-in
  behavior stays /. Installed BetterAuth's existing redirect plugin navigates
  after login; no alternate login, token issuer or browser storage proof added.
- The new form requires customerPhone/address/preferredDate/problemDescription,
  validates phone/date/lengths and posts only these plus serviceId through the
  existing same-origin /api/customer/bookings bridge (added POST alongside GET).
  Cookie forwarding, Origin check, no-store, timeout and redirect rejection remain.
  Duplicate submits/dismissal are blocked while saving. Failure retains inputs,
  gives safe 401/403/404/409/network/malformed feedback and an expired-session login
  link. Confirmed success uses Sonner, then navigates/refreshes My Bookings.
- Added POST /api/bookings in the existing router, using unchanged verifyToken
  then requireRole("customer"). Rejects extra/protected fields; validates native
  ObjectId, phone, address, problem and real non-past date-only input. Customer
  name/email come solely from req.user; service title/image/category/price/provider
  come from an approved+available stored service. Defaults: requested, unpaid,
  finalAmount:null and server createdAt/updatedAt. String serviceId is canonical
  lowercase ObjectId hex; preferredDate is a BSON Date at UTC midnight.
- Explicit approval granted through the setup command for the unique partial index
  on bookings {customerEmail:1,serviceId:1}, named unique_active_customer_service,
  restricted to requested/accepted/in-progress. Added scripts/setup-booking-index.js;
  run it from the backend directory for another deployment. No automatic index
  mutation on startup. POST checks the required index and fails closed with 503
  if absent; duplicate active requests return 409. No extra collection added.
- Added withDatabaseTransaction to existing db.js. Booking creation increments
  internal services.bookingRevision and inserts its snapshot in one transaction.
  Service deletion now checks ownership/references and deletes within a transaction
  on that same service, preserving prior 404/409/history rules. Conflicting
  create/delete or availability updates retry rather than creating orphan bookings.
  Failed/duplicate creation rolls back the service counter. This necessary
  coordination is not a new Technician feature or a service approval change.
- Backend npm test passed 119/119, including 12 new booking-create HTTP driver/session
  fixture tests and all prior Customer/Technician/Admin/Service tests. New coverage:
  trusted snapshots/defaults, both role lists, 401/403/400/404/409/503, missing index,
  concurrent/processed duplicates, cancellation/rebooking and rollback on failure.
  Existing service tests now require transaction sessions on reference reads.
- Installed real BetterAuth signed-cookie/memory-adapter harness passed 15 checks:
  signup role protection, password login/failure, service callback and normal /,
  authenticated creation/Customer+Technician reads, duplicate 409, current-role
  changes, tampered credentials, sign-out, expiry and unsafe callback rejection.
  MongoDB driver was stubbed; no live auth or booking writes by this harness.
- Browser fixture using actual components/Base UI/Sonner passed 33 checks for
  session pending/customer/guest/roles/retry, fields/validation, safe payload,
  duplicate/busy/error behavior, success toast/navigation, callbacks and responsive
  dialogs at 1440/768/390px. Three further checks against the real running app
  verified guest service button -> callback-preserving Sign In and mobile layout:
  36 total, no uncaught exceptions. Screenshots inspected outside the repository.
- Twelve live guest/regression HTTP checks passed for new POST 401/no-store with
  missing/invalid cookies, cross-origin 403, existing role GET denials, public
  Services/Details, callback Sign In and BetterAuth guest session behavior.
- Read-only live metadata initially showed zero bookings and transaction support.
  Approved setup created only the specified index. A later read found one booking
  created independently of automated tests: correct requested/unpaid/null defaults,
  String serviceId, BSON dates, matching service snapshot and current Customer
  owner; services.bookingRevision was 1. Its stored provider account currently has
  Admin role. Do not change roles or bypass Technician protection to show it there;
  live signed-in Technician UI persistence remains unverified for that record.
- No live records were inserted/cancelled/edited solely for testing. Fixture
  persistence tests do not establish a live signed-in browser booking test. No
  dependencies, secrets, env/auth configuration, Admin pages, Google TODO or
  unrelated frontend features changed. Prior Customer work and external commits
  were preserved. Report verified results and await next instruction.

## Stripe Test Mode setup and full payment flow (2026-11-20)

- This request authorizes Stripe SDK/CLI/account setup, local environment changes,
  payment APIs/frontend and explicitly labelled safe Test Mode fixtures. Earlier
  missing-payment/preview notes are superseded for these endpoints/pages. Existing
  real customer bookings/payments, BetterAuth configuration and unrelated features
  were preserved. No live-mode payments are supported or processed by this work.
- Stripe CLI was already installed (1.55.14). Browser device authorization completed.
  User-requested `stripe agent setup --client codex` installed official
  stripe@openai-curated plugin 82fd64bc at user scope; status confirmed installed.
  Applied stripe-best-practices and its payments reference. Installed only the
  necessary backend official stripe SDK 23.2.0 (API 2026-11-18.endive).
- Existing backend STRIPE_SECRET_KEY was retained and securely validated with a
  read-only Stripe balance response (livemode:false). Its historical rotation is
  not independently verifiable; never claim verified rotation or print the value.
  Current CLI signing secret and CLIENT_URL=http://localhost:3000 were written to
  ignored .env without changing unrelated values; listener enforces file mode600.
  .env.example contains placeholders only. Never copy secrets into this file.
- scripts/listen-stripe.js starts CLI with the backend test key via environment,
  not argv, to keep listener/API in the same test account. It buffers complete
  output lines, captures whsec directly to .env and redacts secret output. CLI1.55
  requires --events: subscribes checkout.session.completed and
  checkout.session.async_payment_succeeded, forwarding to
  localhost:4000/api/payments/webhook. Bare listen --forward-to is insufficient
  with this installed version. Restart backend after the secret changes; existing
  node --watch was restarted by touching app.js. Listener stayed running for tests.
- Added config/payments.js and routes/payments/routes.js. Public POST webhook is
  mounted with express.raw(application/json) BEFORE global express.json. SDK
  signature verification rejects invalid signatures; live-mode events are refused.
  Unrelated/generic CLI fixture events acknowledge 200 without booking mutations.
  FixMate fulfillment retrieves the real Session with expanded PaymentIntent and
  verifies test mode, complete/paid/succeeded state, booking/customer/attempt/session
  linkage, amount received, MongoDB finalAmount and USD before any paid update.
- POST /api/payments/create-checkout-session reuses unchanged verifyToken then
  requireRole(customer). Accepts only bookingId, validates ObjectId/ownership and
  completed+unpaid, and reads positive two-decimal USD finalAmount (Stripe minimum
  $0.50). Atomic checkoutRequestId/amount/currency claims plus versioned Stripe
  idempotency keys reuse current open sessions and safely renew expired ones.
  Success/cancel URLs come only from configured CLIENT_URL. No client amount or
  identity is trusted; neither return page can mark a booking paid.
- Current API rejects payment_method_types on Checkout creation. Removed it and
  uses Dashboard dynamic payment methods; async success is supported by webhook.
  Explicit adaptive_pricing.enabled=false prevents conversion to local currency;
  actual hosted Checkout displayed USD12.50. Final idempotency namespace is
  fixmate-checkout-v2- plus stored attempt UUID; earlier rejected test payloads had
  cached Stripe idempotency errors. Only old unpaid fixture sessions were expired.
- User approved payment schema setup through scripts/setup-payment-indexes.js:
  created existing planned payments area with three unique partial indexes on
  bookingId/stripeSessionId/transactionId where verified:true. Checkout linkage
  fields are stored on bookings. Verified payment fields extend assignment fields
  with verified:true, verificationSource:stripe-webhook and testMode:true. One
  MongoDB transaction inserts the payment and conditionally updates the completed
  unpaid booking; retries/duplicates preserve one payment and consistent paid state.
  Missing required indexes/config fail closed. No extra application collections.
- GET /api/payments/my is current-Customer-only, owner-filtered and newest-first.
  GET /api/payments/session/:id returns only an owned MongoDB-backed verification
  result. GET /status exposes only availability. Existing Admin payments endpoint
  projects real records and reports verified USD Test Mode totals; legacy/unknown
  records/currencies never establish verification or enter the total. Overview's
  dependency explanation was updated without unrelated Admin mutations.
- Frontend adds narrow cookie-forwarding Customer payments/history/status/checkout/
  session bridges using existing utility. PayBooking appears only for completed
  unpaid bookings when payment setup is available; disables duplicate clicks and
  restricts external redirects to HTTPS checkout.stripe.com. PaymentHistory reuses
  existing tables/filter/loading/error/retry for Customer and Admin, showing actual
  transactions/verification and explicit Test Mode totals. No frontend Stripe SDK.
- Customer payment previews/fake BDT totals were removed. /payment/success requires
  Customer role and an owned verified backend result; a URL alone shows processing.
  /payment/cancel performs no payment mutation. Existing DashboardLink now sets
  nativeButton=false when rendering Link, fixing Base UI's native-button warning
  observed on the real payment pages. No unrelated redesign or auth change.
- Backend npm test passed 131/131 (12 new payment HTTP/SDK/driver tests, all old
  regressions): ownership/roles/validation/index/config gates, amount/currency,
  current/expired/concurrent Checkout, real SDK signature verification, unlinked
  events, paid fulfillment, duplicate delivery, rollback and scoped verified history.
  Syntax checks and both repositories' whitespace checks passed. Frontend no-emit,
  full ESLint and default Turbopack production build passed (38 generated pages).
- Initial Turbopack sandbox worker EPERM was cached. Cache was moved reversibly
  outside the repository and permitted default build passed. Webpack fallback
  compiles but does not process this repo's @tailwindcss/turbopack-only CSS rule;
  do not use that fallback to claim styling verification or add unrelated config.
- Actual-source browser fixtures passed44 checks: safe Checkout URL/payload,
  busy/duplicate/failure states, conditional Pay Now, history/currency/filters,
  success URL not proof, retry and no page overflow at1440/768/390px. Used actual
  compiled Tailwind CSS; screenshots inspected. Thirteen live guest/API smoke
  checks passed, including existing Service/Booking APIs and protected routes.
- REAL Test Mode flow verified with a dedicated labelled test customer and three
  new [Stripe Test: pay/cancel/incomplete] bookings. No existing real booking or
  payment was used/changed. Incomplete Checkout returned409; actual Stripe Session
  amount/currency matched MongoDB (1250 cents/USD). Generic CLI trigger delivered
  HTTP200 and was ignored for booking fulfillment. Hosted Checkout with Stripe's
  test card produced a signed event, HTTP200, one verified USD12.50 payment and
  booking paid; success page and My Bookings showed verified/Paid with no Pay Now.
- Replayed the real event twice with valid local signatures: still exactly one
  payment. Actual Customer History and Admin Transactions displayed the same
  verified record/total. Only the dedicated fixture user's role was temporarily
  changed for role403/Admin browser checks, then restored to Customer in finally.
  No real account role changed. Actual Stripe Back returned /payment/cancel;
  that fixture stayed unpaid with zero payment records and backend paid:false.
- One labelled test customer was created; three test bookings and one verified
  test payment remain for review. A later read-only audit no longer found the
  fixture user by either ID or email; no test script deleted it. Its role had
  already been restored to Customer and both real role UIs were verified before
  that observation. Do not assume the temporary identity still exists. Credentials/cookies and test scripts/screenshots are
  private temporary artifacts outside Git; never print their private JSON file.
  CLI listener is intentionally left active. Key rotation history remains the
  only externally unverified credential fact; no secret values were disclosed.

## Missing Customer Pay Now button and completion pipeline (2026-11-20)

- Current request authorizes only diagnosing/fixing Customer payment eligibility,
  the missing Technician completion workflow and existing Checkout wiring. This
  supersedes earlier Accept/Reject-only notes for the status endpoint. Preserve
  BetterAuth, ownership middleware, existing payment verification and unrelated UI.
- Read-only live MongoDB inspection found six bookings: two requested/unpaid/null,
  one accepted/unpaid/null, one cancelled/unpaid/null, one labelled Stripe fixture
  completed/paid/12.50 and one labelled Stripe fixture completed/unpaid/12.50.
  Only the last was eligible. No inconsistent status/payment strings or numeric
  amount mappings were observed. Nonfixture records were correctly ineligible;
  the assigned provider for the accepted record currently has Technician role.
- Main workflow defect: TechnicianRequests and PATCH /api/bookings/:id/status
  supported only requested -> accepted/rejected, so a normal booking could never
  become completed with a final amount. Added accepted -> in-progress and
  in-progress -> completed with required finite numeric finalAmount > 0. The
  existing atomic update filters both verified technicianEmail and exact previous
  status. Only completion changes finalAmount; paymentStatus remains untouched.
  Invalid fields/types, wrong owners, wrong roles, skipped/repeated/racing
  transitions still fail. No bookings are automatically completed or backfilled.
- Technician UI reuses Button/Input/cards/tabs. Start Repair appears only for
  accepted; in-progress shows a required USD amount and Complete Repair. Sends
  numeric amount only for completion, prevents duplicates, retains failed inputs,
  and replaces/refetches only confirmed server results. Completed amount is shown.
- CustomerBookings retains actual API fields and now requires completed AND unpaid
  AND finite Number(finalAmount) > 0 before mounting PayBooking. Invalid completed
  amounts get an explanatory message; paid/other statuses never get Pay Now.
  Existing amount display, filters, cancellation and layout remain. Window focus
  refetches fresh booking data; explicit Refresh remains available.
- PayBooking previously hid its button after any /payments/status failure and
  lacked a retry for that preflight. Removed that frontend visibility dependency;
  the authoritative authenticated Checkout API still checks configuration/indexes,
  Customer ownership, completed/unpaid and MongoDB amount before creating a Session.
  No eligibility/security check was removed from that API. The button submits only
  bookingId via the existing same-origin cookie bridge, retains timeout/duplicate
  guards and Stripe-only HTTPS redirect validation, reports safe 503 errors, and
  requests fresh bookings on 404/409. Stripe minimum remains $0.50 with USD cents;
  a smaller positive finalAmount can complete but Checkout rejects it explicitly.
- Existing stripe SDK, test key, webhook-secret presence, frontend origin and three
  unique verified-payment indexes were confirmed. Live GET /api/payments/status
  returned available:true. No dependency/env/auth/index setup changes were needed.
- Backend native suite passed 134/134 after final changes, including three new
  pipeline/amount/ownership/race tests and all prior booking/payment regressions.
  Existing payment tests cover unowned Checkout denial, trusted USD amounts,
  invalid eligibility, idempotency, signed webhooks and unchanged fulfillment.
  Backend npm run check and explicit modified route/test syntax checks passed.
- Actual-source browser fixtures passed 31 checks: every booking/payment state,
  invalid/zero amounts, completed filter, USD display, authenticated ID-only payload,
  duplicate/loading/error recovery, safe redirect, focus refresh, full Technician
  pipeline, failed completion input preservation, 1440/390px overflow and no uncaught
  exceptions. Fetch was mocked; these are not live signed-in MongoDB mutations.
- Additional isolated actual Express/middleware/route test used only an in-memory
  booking and fixture auth endpoint, then the REAL Stripe SDK/network. Verified
  Accept -> Start -> Complete, GET /api/bookings/my returning completed/unpaid/12.50,
  another Customer receiving 404, and a real Test Checkout Session for 1250 USD
  cents. Two hosted Chrome checks verified checkout.stripe.com and $12.50; inspected
  screenshot showed Sandbox and payment form. No card/payment was submitted. The
  newly created isolated Session was expired afterward; no fake payment inserted.
- Live backend guest GET /bookings/my, guest Checkout POST and frontend bookings
  bridge all returned 401. A live signed-in Customer GET /my and live Technician
  completion against MongoDB were not performed; no current credentials were
  supplied and existing records were preserved. Actual MongoDB inspection was
  read-only; fixture persistence/mapping tests do not prove live browser persistence.
- Frontend TypeScript no-emit, full ESLint and both repositories' diff whitespace
  checks passed. Prior workspace edits to DashboardUI, PaymentHistory, Stripe
  listener/payment routes/tests and earlier AGENTS notes were preserved.
- Production build passed with default Turbopack: compiled, TypeScript and 38/38
  generated pages. Initial sandbox build stalled during compilation and was
  stopped; the permitted rerun completed. No build/config workaround was committed.
- Modified for this task: CustomerBookings.tsx, PayBooking.tsx,
  TechnicianRequests.tsx, backend bookings/routes.js and test/bookings.test.js,
  plus this AGENTS.md. Stop after reporting this feature and await next instruction.

## Production frontend API URL fix (2026-11-21)

- Supersedes the earlier requirement that NEXT_PUBLIC_API_URL must already
  include `/api`. `src/lib/api-url.ts` accepts an HTTP(S) backend origin or the
  same origin with `/api` and normalizes either to exactly `origin/api`. It
  rejects invalid configuration without logging supplied values.
- Our Services, the public list/details pages, and the existing private cookie
  bridge share that helper. Authentication, payment logic, filtering, newest-first
  order and the homepage six-card limit are unchanged.
- Production diagnosis: the bare origin previously produced `/services` (404);
  `/api/services` returned 200 with eight approved/available records. The live
  homepage had the error state. The homepage fetch runs on the Next.js server;
  the backend also returned the expected CORS origin. Vercel build logs showed
  successful deployment; the sampled runtime logs did not show this caught error.
- Local production build using the deployed backend and bare-origin setting
  passed (38/38); SSR showed exactly the latest six real services on the homepage,
  all eight on the listing, and a working public detail page. URL checks (10),
  source ESLint, TypeScript and guest auth/bridge checks passed. Unscoped ESLint
  also picked up existing generated `.vercel/output` and is not a clean run.
- `.env`/`.env.local` were inspected with secrets redacted and are ignored and
  untracked. No env values, backend code or database records were changed. No
  deployment was made without explicit permission; live verification of the fix
  remains pending redeployment.

## Paid Stripe Checkout reconciliation and production webhook (2026-11-21)

- This request authorizes diagnosing the existing $200 payment, trusted repair of
  its payment state, Stripe Test Mode webhook configuration and Vercel deployment.
  Supersedes webhook-only fulfillment/read-only success-verification notes above.
  BetterAuth, role/ownership guards, unrelated bookings/services and auth env stay.
- Read-only Stripe API confirmed the affected completed/unpaid/$200 booking had
  Checkout complete/paid and PaymentIntent succeeded/received 20000 USD cents.
  Booking/customer/attempt/session/intent metadata and MongoDB amount all matched.
  Initially no payment document existed. It was already paid in Stripe Test Mode;
  no second Checkout/charge was created during this diagnosis or recovery.
- Root cause: the account had no registered webhook endpoints. Production had the
  local CLI listener's signing secret. The old paid Session also had localhost
  return URLs. The old create endpoint correctly refused a completed Session but
  had no reconciliation path; the frontend hid that distinction behind a generic
  409 error. Current production CLIENT_URL was already the correct HTTPS frontend.
  No historical webhook failure delivery can be claimed; no endpoint was present.
- Backend config/payments.js now shares strict Stripe retrieval/verification and
  transactional fulfillment between signed webhook and authenticated reconciliation.
  Source stripe-api joins stripe-webhook as a valid verified payment source.
  Test mode, complete/paid/succeeded, USD/amount received, MongoDB finalAmount,
  ownership/metadata/attempt linkage and the three unique partial payment indexes
  remain required. Exact matching verified records can repair an unpaid booking
  without another insert. Direct recovery uses Stripe charge creation time as paidAt.
- GET /api/payments/booking/:id and existing owned /session/:id consult Stripe;
  Checkout POST also reconciles an already-paid Session and returns paid:true.
  Open matching Sessions are reused; expired or terminal failed Sessions can retry.
  Processing/unknown payment intents stay blocked. New checkoutStartedAt bounds
  retries when a Session ID was not saved; missing/old reservation timestamps fail
  closed beyond Stripe idempotency retention rather than risk another charge.
- Signed unpaid async completion is acknowledged without marking paid; async
  success uses the same verified fulfillment. Safe event ID/type/status logs aid
  retries without secrets. Raw body before express.json and signature checks stay.
- Added narrow same-origin booking verification bridge. PayBooking checks status
  before offering Pay Now, shows checking/processing/unknown/Paid, refreshes after
  verification, preserves duplicate-click/Stripe-host restrictions and uses Sonner.
  PaymentResult distinguishes unfinished from processing payments; PaymentHistory
  and result validation accept both trusted verification sources. No sign-out or
  authentication behavior was added/changed. Future Sessions use configured origin;
  existing Stripe Session return URLs are historical and were not rewritten.
- Registered enabled Test Mode endpoint at the production backend's
  /api/payments/webhook for checkout.session.completed and
  checkout.session.async_payment_succeeded. Stored its endpoint-specific secret
  securely in Vercel production and deployed backend/frontend to existing aliases.
  Local .env/CLI listener secret was not changed; no secret is in Git or these notes.
- Production recovery occurred through the deployed authenticated Checkout POST:
  Vercel logs show the previous 409 becoming 200 and MongoDB source stripe-api.
  The affected booking is now paid with exactly one verified USD200 payment.
  Replayed the ORIGINAL successful event twice through Stripe CLI to the new
  endpoint; actual Stripe delivery received HTTP200. Invalid signatures return400.
  Final MongoDB check after replay confirms no duplicate verified booking payment,
  correct owner/Session/intent/paidAt, and inclusion in Customer/Admin report queries.
- Verification: full backend suite 143/143, including recovery/history/auth checks;
  23 temporary actual-source PayBooking handler checks, source ESLint/TypeScript,
  Next production build (38 static pages), syntax/whitespace checks and 15 deployed
  guest/API smoke checks. Fixtures are not signed-in browser tests. Production
  history data/query inclusion was verified; Customer/Admin browser screens were
  not independently exercised with user credentials. No fake records or second
  charge, unrelated data changes, dependency installs or auth changes were made.

## Technician Payment History (2026-11-21)

- Current request authorizes this additional Technician read-only payment feature;
  existing Stripe Checkout/webhook/fulfillment and Customer/Admin history remain.
- GET /api/payments/technician is registered before the Customer-only router gate
  and uses unchanged verifyToken then requireRole("technician"). It derives owner
  email only from req.user, queries the existing payments collection for that
  owner plus verified:true/paymentStatus:paid/USD, projects the existing safe
  fields and sorts paidAt descending with _id descending as a tie-breaker.
- The existing verifiedPayment predicate additionally excludes unknown sources,
  non-Test Mode data, invalid amounts and malformed Stripe identifiers. Both
  stripe-webhook and stripe-api verified sources are supported. paymentReport
  supplies the same cents-based USD total; the response adds totalPaidAmount and
  paidJobCount. Existing unique verified-booking indexes give one record per paid
  job. No booking finalAmount is counted as revenue and no Stripe request/write,
  payment mutation, payout, collection/index or auth change was introduced.
- Added /dashboard/technician/payments behind the existing RolePage guard, the
  Technician Sidebar Payment History item, and a narrow same-origin GET bridge
  at /api/technician/payments forwarding cookies to /api/payments/technician.
  Frontend never submits technicianEmail; the bridge retains private/no-store.
- Shared PaymentHistory accepts an optional Technician mode. It displays real API
  total USD/paid-job count and a table of service/customer/amount/currency/status/
  transaction/date, with existing loading, empty, error and retry states. Customer
  and Admin modes keep their existing endpoints/columns/filter/verification UI.
  Used ordinary Card primitives for real summary data because preview StatsCard
  has a hardcoded Sample preview caption. Payments are described as customer
  payments for completed repairs, explicitly not bank payouts; Test Mode note stays.
- Native backend tests147/147 passed (four new Technician tests): missing/invalid/
  expired401, Customer/Admin403 before DB access, separate Technicians and spoofed
  email isolation, newest sorting, strict verified-state/currency/source filtering,
  exact decimal total/job count, unpaid-booking exclusion, empty zeros, safe errors,
  no writes and history available without Stripe credentials. Existing Customer/
  Admin history, Checkout/webhook and payment-recovery regression tests all pass.
- Headless Chrome actual-component fixtures passed38 checks, including loading,
  populated/empty/error/retry/401/403/malformed totals, summary/columns/sidebar link,
  Customer/Admin regressions and 1440/768/390/320px layouts. No document overflow
  or uncaught exceptions; table scrolls locally on narrow screens. Mobile and
  desktop screenshots were captured outside Git; mobile was visually inspected.
  Browser fetch responses were fixtures, not signed-in live MongoDB history.
  Temporary public test route was removed before the production build.
- Read-only live MongoDB inspection found four verified payments across three
  stored Technician ownership emails; all linked bookings were completed/paid.
  Own-query sorting/totals matched the existing verification/report rules. No
  account, booking, service or payment was written for tests. Five local HTTP
  smoke checks passed for guest Technician API/bridge/page and Customer/Admin
  bridge401/no-store behavior. Scoped ESLint, TypeScript and syntax/whitespace
  checks pass. Final default Turbopack production build passed (40/40 generated
  pages), including both new routes and no temporary browser route. Signed-in
  live Technician browser history remains untested; no Vercel deployment was
  requested/performed for this feature.
- Concurrent homepage/HowFixMateWorks edits appeared during this task and were
  preserved. No homepage changes belong to the payment-history implementation.

## Home Page: How FixMate Works section (2026-11-21)

- This request authorizes a homepage UI enhancement only. Read AGENTS.md and
  inspected the homepage plus home/shared components first. No How FixMate Works
  section existed on `/`; the separate `/about` page keeps its own "How it works"
  content, so this is not a duplicate homepage section. No backend API, database,
  auth, Stripe, dependency, environment or unrelated file was changed.
- Added `src/components/home/HowFixMateWorks.tsx`: a static Server Component
  following the existing WhyChooseUs/CustomerReviews patterns (section id +
  aria-labelledby, orange eyebrow, teal heading, existing Card/CardContent,
  React Icons, Tailwind breakpoints). It renders the ordered four steps Find a
  Service, Book a Repair, Get It Fixed, Pay Securely with the requested copy,
  large 01-04 numbers, a teal icon tile with orange icon, a small orange Step
  label, and consistent equal-height cards via an auto-rows-fr grid.
- Four visually connected steps use one absolutely positioned dashed teal line
  behind the opaque cards at `top-[52px]`, `inset-x-8`, visible only at xl where
  the grid is four columns; it is `hidden` below xl and `aria-hidden`/pointer-events
  none, so mobile and tablet show a clean 1-column and 2-column layout with no
  fake connectors. Subtle hover changes (orange tint + ring) reuse the existing
  motion-reduce-safe style; no animation libraries or gradients were added.
- CTA is a normal Next.js Link to `/services` styled like the existing Our
  Services button (orange, focus-visible outline) with a FiArrowRight icon.
- Only `src/app/(root)/page.tsx` changed for integration: Banner -> OurServices ->
  HowFixMateWorks -> WhyChooseUs -> CustomerReviews. Background rhythm stays
  balanced (gray Banner/Our Services block, white How FixMate Works/Why Choose
  Us block, gray Customer Reviews block). No existing section or preview notice
  was removed; Our Services keeps its live API integration.
- Verification: `npx tsc --noEmit` and `npx eslint src` passed; `npm run build`
  passed. A headless Chrome CDP check at 1440/768/390px measured 4/2/1 grid
  columns, equal 242px card heights, correct heading/numbers/titles/copy, CTA
  text+href, connector shown only at xl, white section background and zero
  horizontal overflow at the page and section level; screenshots were captured
  and visually inspected. The live production homepage rendered all four steps,
  six real Our Services cards, Why Choose Us and Customer Reviews with no console
  errors; clicking Explore Services navigated to `/services`, whose SSR HTML
  listed all currently visible services while the homepage stayed capped at six.
- Temporary CDP script and screenshots live outside the repository. The concurrent
  Technician Payment History work in this checkout was preserved untouched.
  Stop after reporting this UI enhancement and await the next instruction.

## Local development origin diagnosis and repair (2026-11-21)

- User authorizes diagnosis/fix of localhost failures while preserving production.
  Initial and repeated local GET /, /services and auth pages returned200; the
  reported generic500/Internal Server Error was not reproduced and no500 stack
  was present in the available current Next development log. Do not claim that
  the historical500 was proven to have the same cause as the verified403 below.
- Confirmed terminal error: Better Auth Invalid origin: http://localhost:3000;
  a syntactically valid sign-in for a nonexistent diagnostic email reproduced
  HTTP403/INVALID_ORIGIN before changes. No diagnostic signup/account was made.
  frontend .env used the production BETTER_AUTH_URL; .env.local only overrode API
  with the production backend. Backend .env CLIENT_URL also used production, so
  its localhost CORS response named the wrong origin. Both URIs/database names
  were already aligned; no MongoDB credentials, adapter or schema fix was needed.
- Added ignored frontend .env.development.local with ONLY development origins:
  BETTER_AUTH_URL=http://localhost:3000 and
  NEXT_PUBLIC_API_URL=http://localhost:4000/api. Installed Next docs confirm this
  overrides .env.local/.env during next dev, and is excluded from production builds.
  Existing .env/.env.local and production settings/secrets remain unchanged.
  Next hot-reloaded the file; the subsequent local sign-in reached credential
  checking (401/INVALID_EMAIL_OR_PASSWORD) rather than rejecting localhost.
- Added ignored backend .env.development.local with localhost CLIENT_URL and
  BETTER_AUTH_URL. Backend npm run dev now uses Node's existing
  --env-file-if-exists=.env.development.local before --watch index.js. Dotenv still
  loads all existing secrets from .env; no dependency/startup/auth middleware code
  changed. npm start and Vercel keep their original environment handling. Direct
  nodemon index.js does not load this dev override; use npm run dev in each repo.
- Replaced the verified old backend nodemon watcher with npm run dev. MongoDB
  connect/ping succeeded, exact fixmateDB retained, listening on4000. Frontend dev
  stays on3000. Backend CORS now returns http://localhost:3000 with credentials;
  no wildcard or relaxed auth/trusted-origins rule was added. Stripe settings,
  Checkout/webhook, payment data and production deployment were not changed.
- During log inspection an old signup debug statement exposed the complete auth
  success response. Removed only that console.log and unused response destructure
  from sign-up/page.tsx; normal signup/toast/redirect behavior stays. Never dump
  raw development logs again without filtering auth response/token output.
  A separate user's concurrent successful signup was observed after the origin
  fix; it was not a diagnostic test account or an independently exercised role flow.
- Verified Next environment resolution in fresh processes: development uses both
  localhost origins; production keeps the original HTTPS Vercel auth/API origins.
  Verified backend dev vs normal-start resolution likewise preserves production.
  All local override files remain ignored/untracked; no secrets were copied.
- Local HTTP verification15/15 passed: home/services/auth pages200, real Services
  response (11 public records at check time), guest get-session200/null, valid local
  origin admitted to credential validation, untrusted origin still403, all three
  role guest redirects/bridge401/no-store and backend health/CORS. No existing
  user password/cookie was borrowed, and no auth/business record was created or
  modified by diagnostics. Fully signed-in Customer/Technician/Admin browser
  workflows could not be independently tested without authorized credentials.
- Complete backend regression suite147/147 passed. Scoped signup ESLint and
  whitespace checks pass. Final production build passed40/40 generated pages
  with the original production origins. Headless Chrome7 checks passed using real
  local API fetches: homepage six real services, Services listing, three actual
  guest redirects and zero uncaught exceptions. No browser API mocks were used.
  Existing payment-history and concurrent homepage changes were preserved.

## Modern homepage workflow and About section (2026-11-21)

- This request authorizes homepage UI work only. Read these instructions, inspected
  all existing home components, Banner, OurServices, shared layout/footer, separate
  About page and installed Next.js client/server, CSS and image guides first.
  Existing HowFixMateWorks was replaced in place; no homepage About section existed,
  so one AboutFixMate was added immediately after it. The separate /about page,
  WhyChooseUs, review preview disclosure, hero/categories, live services and footer
  remain. No new Final CTA or duplicate process/about section was added.
- HowFixMateWorks is now a small Client Component with exactly Explore Services,
  Book a Technician, Track Your Repair and Secure Payment. Four numbered 01–04
  buttons implement accessible tabs, one selected tab/panel, linked IDs, a roving
  tab stop and Left/Right/Home/End navigation with native button activation. Cards
  show active teal/orange feedback; selected content describes the real request,
  technician confirmation, repair tracking and completed-unpaid payment workflow.
  The panel CTA links to /services. No timer or automatic step advancement exists.
- Desktop has four cards with a connecting line that fills as selection changes;
  mobile/tablet have a two-column selector and an animated progress bar. These
  indicate the explanation's selected step, not a real customer's repair status.
  Copy explicitly requires job completion and final-amount review before payment.
- AboutFixMate uses the exact requested heading/description, four feature cards
  (Secure Booking, Clear Repair Progress, Secure Stripe Checkout, Multiple Repair
  Categories), existing Card primitives, React Icons, teal/orange accents and a
  /about link. Desktop places the photo left and content right; below lg the image
  comes first. Feature copy focuses on account requests, actual dashboard progress,
  post-completion checkout and seven categories rather than repeating WhyChooseUs
  claims. About is a Server Component with small reveal wrappers around its content.
- New public/images/about-repair.jpg is a roughly 40KB local copy of Pexels photo
  6755075 showing precision smartphone repair, visually inspected before use.
  Source: https://images.pexels.com/photos/6755075/pexels-photo-6755075.jpeg
  License checked at https://www.pexels.com/license/ (free website use permitted).
  Source/license are also recorded in AboutFixMate.tsx. Next Image uses fill,
  responsive sizes, reserved aspect ratio and normal lazy loading; no remote image
  config, dependency or image-generation tool was needed for this section.
- SectionReveal uses one IntersectionObserver per wrapper, disconnects after first
  entrance and cleans up on unmount. Content defaults visible without JavaScript;
  reduced-motion skips the observer and CSS removes entrance/panel animation,
  hover movement/zoom and progress/button transitions. Hover effects only apply to
  hover-capable pointers. All animations are short, triggered and noncontinuous.
- Styling lives in home-sections.css, imported by the homepage and scoped through
  fixmate-home/workflow/about class names. Actual browser verification caught this
  checkout's custom Tailwind CSS loader emitting unscoped CSS Module rules while
  imports used different names. The temporary CSS Module was replaced with these
  prefixed styles; next.config.ts was preserved. Do not assume CSS Module animations
  work here without browser verification. The final photo zoom was verified at
  scale 1.04, not inferred from source alone.
- Real localhost headless Chrome suite passed 57 checks with no API mocks: all
  four clickable steps and dynamic panels/ARIA links, arrow/Home/End keyboard
  navigation, payment wording, section uniqueness/order, image loading/hover zoom,
  viewport layouts at 1440/1024/768/390/320px, desktop image-left/mobile image-above,
  scroll reveals, reduced-motion styles, live /about and /services CTA navigation,
  existing hero/footer/three review cards, and no document horizontal overflow.
  No uncaught exceptions, console errors or hydration mismatch messages occurred.
  Desktop/mobile screenshots were captured and visually inspected outside Git.
- The existing services error handling was untouched. At the final localhost
  browser check OurServices displayed six real service cards and did not show
  "We couldn't load services" or the empty state. This is an observation of that
  run, not a claim that the earlier API failure was diagnosed or permanently fixed.
- Final npm run build passed (40/40 generated pages), TypeScript no-emit,
  npx eslint src and git diff --check passed. Temporary Chrome scripts/screenshots
  remain under /tmp/fixmate-home-modernize. No backend, database, authentication,
  Stripe, environment, dependency or unrelated feature changes were made. Existing
  concurrent asset/homepage edits were preserved. No deployment was requested.
- A further 10 real-browser checks passed for the normal panel/reveal animation
  names/durations, connecting-line scale from 0 to 1, native Space/Enter activation,
  one roving tab stop, reduced-motion initial reload (no observer/hiding or panel
  animation) and no exceptions/console errors: 67 browser checks across both runs.
