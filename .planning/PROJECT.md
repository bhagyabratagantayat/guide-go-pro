# Guide Go

## What This Is

Guide Go is an Uber-like platform for booking local guides. It connects users with verified local guides through real-time geo-matching, interactive maps, and a seamless booking flow with role-based features.

## Core Value

A friction-free, real-time booking experience that instantly connects tourists with nearby, verified local guides.

## Requirements

### Validated

- ✓ Basic client-server interaction setup (Node/Express + React/Vite) — existing
- ✓ Core dependency inclusion (Leaflet, TailwindCSS, Mongoose, Socket.io) — existing
- ✓ Basic folder architectures (MVC on backend, standard components/pages on frontend) — existing
- ✓ Connect MongoDB Atlas and setup `.env` (Port 5000, JWT Secret, Cloudinary) — v1.0
- ✓ Implement Role-based auth system (Admin, User, Guide) — v1.0
- ✓ Implement Guide Registration with Aadhar/PAN and Admin approval flow — v1.0
- ✓ Implement locations collection with GeoJSON and `/locations` search API — v1.0
- ✓ Implement "Go Live" WebSockets feature for guides (location broadcast every 5s) — v1.0
- ✓ Implement Smart Matching (nearest, language, rating, etc.) — v1.0
- ✓ Implement Booking Flow (User searches → backend generates 4-digit OTP) — v1.0
- ✓ Implement Booking Broadcast (Socket.io prompt to nearby guides) — v1.0
- ✓ Implement OTP verification and Trip tracking (pricing, start/end times) — v1.0
- ✓ Implement Live Tracking (map display for users) — v1.0
- ✓ Implement Admin Dashboard (metrics, user/guide management, places management, settings) — v1.0
- ✓ Build professional mobile-first UI with Tailwind (glassmorphism cards, dynamic responsiveness) — v1.0
- ✓ Security implementations (JWT validation middleware, protect routes) — v1.0
- ✓ Test E2E flows (user booking, guide accept, admin approval) — v1.0
- ✓ Integrate Razorpay Transaction logic for completed rides — v1.0

### Active

- [ ] (Pending v1.1 planning)

### Out of Scope

- Offline mode — initial product hinges fully on WebSocket synchronization and Geo tracking.

## Context

- **Technical environment**: Built on the MERN stack integrating Razorpay. Hosted natively across node boundaries targeting Vercel/Render scopes.
- **Setup State**: v1.0 MVP has successfully shipped. The roadmap effectively scaled the raw Node scaffolding into strict real-time socket implementations tracking user boundaries seamlessly.

## Constraints

- **Tech stack**: Node/Express (backend), React/Tailwind (frontend), MongoDB Atlas (DB), Socket.io (Realtime). — Required by user for free scalable startup architecture.
- **Hosting**: Render (backend), Vercel (frontend), Cloudinary (media).
- **Security**: Strict Razorpay webhook validation boundaries combined with native JWT verification arrays.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| WebSockets for realtime | Needed for the 5-second interval tracking and instant broadcast accept/reject flows. | ✓ Good |
| Razorpay direct backend injection | Allowed bypass of early transaction blockers by natively compiling HMAC SHA256 logics via backend node execution layers. | ✓ Good |
| Vite import.meta configurations | Enabled instantaneous switching between test beds and Vercel domains. | ✓ Good |

---
*Last updated: 2026-04-02 after v1.0 milestone*
