# Roadmap

**7 phases** | **30 requirements mapped** | All v1 requirements covered ✓

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Database & Core Auth | Connect MongoDB and establish robust JWT role-based authentication. | AUTH-01, AUTH-02, AUTH-03, AUTH-04, SYS-02 | 3 |
| 2 | Admin Dashboard & Locations | Create Admin shell, metrics, and global location search API. | ADM-01, ADM-02, ADM-05, ADM-06, LOC-01, LOC-02 | 3 |
| 3 | Guide Onboarding | Implement Guide signup with documents and Admin verification flows. | GDE-01, GDE-02, GDE-03, ADM-03 | 2 |
| 4 | Real-time & Go Live | Setup Socket.io and allow Guides to toggle online status with 5s updates. | GDE-04, GDE-05 | 2 |
| 5 | Booking & Matching | Enable users to search, request bookings, and broadcast to nearby guides. | BOOK-01, BOOK-02, BOOK-03, BOOK-04, BOOK-05, BOOK-06 | 3 |
| 6 | Trip Lifecycle & OTP | Implement the OTP handshake and time-based trip pricing engine. | TRIP-01, TRIP-02, TRIP-03, TRIP-04, ADM-04 | 3 |
| 7 | Polish & Final QA | Polish Tailwind UI, verify edge-case regressions, deploy. | SYS-01, SYS-03 | 2 |

---

## Phase Details

### Phase 1: Database & Core Auth
**Goal**: Connect MongoDB and establish robust JWT role-based authentication.
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, SYS-02
**Success criteria:**
1. User, Guide, and Admin can successfully log in and receive a JWT.
2. Unverified guides cannot bypass the login block.
3. Access to an Admin-only protected route returns 401/403 for Users.
**Status**: ⏳ Pending

### Phase 2: Admin Dashboard & Locations
**Goal**: Create Admin shell, metrics, and global location search API.
**Requirements**: ADM-01, ADM-02, ADM-05, ADM-06, LOC-01, LOC-02
**Success criteria:**
1. Admin can successfully add a GeoJSON location to the database.
2. `GET /locations?search=` returns valid matches.
3. Admin dashboard accurately prints mocked statistical data.
**Status**: ⏳ Pending

### Phase 3: Guide Onboarding
**Goal**: Implement Guide signup with documents and Admin verification flows.
**Requirements**: GDE-01, GDE-02, GDE-03, ADM-03
**Success criteria:**
1. Guide can upload profile picture, Aadhar, and PAN (simulated/Cloudinary).
2. Admin sees the pending application and can toggle `isVerified` to true.
**Status**: ⏳ Pending

### Phase 4: Real-time & Go Live
**Goal**: Setup Socket.io and allow Guides to toggle online status with 5s updates.
**Requirements**: GDE-04, GDE-05
**Success criteria:**
1. Verified guide sees "Go Live" button; clicking it establishes active Socket.io connection.
2. Server reliably logs 5-second location pings from live Guides.
**Status**: ⏳ Pending

### Phase 5: Booking & Matching
**Goal**: Enable users to search, request bookings, and broadcast to nearby guides.
**Requirements**: BOOK-01, BOOK-02, BOOK-03, BOOK-04, BOOK-05, BOOK-06
**Success criteria:**
1. DB correctly matches a mock user to the nearest geo-query Guide.
2. Nearby Guides receive Socket.io broadcast of the booking request.
3. When Guide 1 accepts, Guide 2's session locks out the request.
**Status**: ⏳ Pending

### Phase 6: Trip Lifecycle & OTP
**Goal**: Implement the OTP handshake and time-based trip pricing engine.
**Requirements**: TRIP-01, TRIP-02, TRIP-03, TRIP-04, ADM-04
**Success criteria:**
1. User sees 4-digit OTP; Guide enters it successfully to change status to active trip.
2. Real-time location is relayed via websockets continuously until trip ends.
3. Price correctly computes based on time elapsed * `pricePerHour`.
**Status**: ⏳ Pending

### Phase 7: Polish & Final QA
**Goal**: Polish Tailwind UI, verify edge-case regressions, deploy.
**Requirements**: SYS-01, SYS-03
**Success criteria:**
1. Glassmorphism UI is successfully applied to User booking screens.
2. Complete end-to-end walk for User -> Guide matching without unhandled promises.
**Status**: ⏳ Pending
