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

### Active

- [ ] Connect MongoDB Atlas and setup `.env` (Port 5000, JWT Secret, Cloudinary)
- [ ] Implement Role-based auth system (Admin, User, Guide)
- [ ] Implement Guide Registration with Aadhar/PAN and Admin approval flow
- [ ] Implement locations collection with GeoJSON and `/locations` search API
- [ ] Implement "Go Live" WebSockets feature for guides (location broadcast every 5s)
- [ ] Implement Smart Matching (nearest, language, rating, etc.)
- [ ] Implement Booking Flow (User searches → backend generates 4-digit OTP)
- [ ] Implement Booking Broadcast (Socket.io prompt to nearby guides)
- [ ] Implement OTP verification and Trip tracking (pricing, start/end times)
- [ ] Implement Live Tracking (map display for users)
- [ ] Implement Admin Dashboard (metrics, user/guide management, places management, settings)
- [ ] Build professional mobile-first UI with Tailwind (glassmorphism cards, dynamic responsiveness)
- [ ] Security implementations (JWT validation middleware, protect routes)
- [ ] Test E2E flows (user booking, guide accept, admin approval)

### Out of Scope

- [Direct payments via external gateways like Stripe] — Initial PRD focuses on the booking, OTP, and tracking flow, not literal transaction processing.

## Context

- **Technical environment**: Built on the MERN stack with external hosting constraints (Render/Vercel/Cloudinary/Atlas).
- **Setup State**: Codebase currently has a skeleton backend/frontend setup from a previous mapping. This project aims to bring the full real-time matching system to production-ready status.

## Constraints

- **Tech stack**: Node/Express (backend), React/Tailwind (frontend), MongoDB Atlas (DB), Socket.io (Realtime). — Required by user for free scalable startup architecture.
- **Hosting**: Render (backend), Vercel (frontend), Cloudinary (media) — Required to keep free tier active.
- **Security**: JWT validation and robust role middlewares are required. Guide profiles must be administrator-verified before they can Go Live.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| WebSockets for realtime | Needed for the 5-second interval tracking and instant broadcast accept/reject flows. | — Pending |

---
*Last updated: 2026-04-02 after initialization*
