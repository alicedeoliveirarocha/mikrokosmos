# 🌌 MIKROKOSMOS — Themed Restaurant Management SaaS

**English** · [Português (Brasil)](./README.pt-BR.md)

> A full-stack management system for themed restaurants and K-pop cafés — born as an award-winning university project, engineered into a real-time, multilingual SaaS.

🔗 **Live demo:** https://mikrokosmos-i9bp.vercel.app

---

## ✨ What it does

MIKROKOSMOS lets a themed restaurant run its entire operation — menu, orders, kitchen, delivery and analytics — while giving customers an immersive experience that switches between **K-pop** and **Cinema** universes (each with its own visual identity, playlists and themed dishes).

**Four user roles, four experiences:**

| Role | What they see |
|---|---|
| 🍽️ **Customer** | Themed menu, cart, checkout, live order tracking on a real map |
| 👨‍🍳 **Kitchen** | Real-time order queue with status management |
| 🛵 **Delivery** | Pickup/delivery workflow with route selection and live map |
| 🛡️ **Admin** | Full dashboard: BCG matrix, sales analytics, stock, staff, and a self-service menu editor |

## 🌍 Internationalization at the core

This is not a translated app — it is an app **architected for i18n**:

- **6 languages**: Portuguese, English, Spanish, Korean, Japanese and Chinese
- **Currency follows language**: prices are stored in BRL and converted at display time (R$ → $, €, ₩, ¥) via `Intl.NumberFormat` — across every screen that shows money, including chart axes and tooltips
- **The database never stores translated or formatted text.** Order statuses, payment methods and roles are canonical slugs (`'preparando'`, `'cartao'`); translation happens only at render time. A Japanese customer and a Brazilian kitchen see the *same* order, each in their own language
- **Menu translations live inside the data**: each dish carries its descriptions in all 6 languages as a `jsonb` object — editable from the admin panel, no code involved

## 🛠️ Self-service menu management (the SaaS moment)

The restaurant operator manages the menu **without touching code**:

- Full dish editor available in two places: an admin **"Dishes" tab** and an **edit button on every product page** (admin only)
- Edit price, photo, ingredients, allergens, nutrition — and the **translations of every description, per language, in a tabbed form**
- Toggle a dish off and it disappears from every connected customer's menu **in real time**
- Create new dishes that are born multilingual

## ⚡ Real-time everything

Built on **Supabase Realtime** (PostgreSQL logical replication):

- Kitchen marks an order ready → delivery panel and the customer's tracking screen update instantly, no refresh
- Admin edits a dish → every open menu updates live
- The delivery person picks one of up to 3 route alternatives → the customer's map redraws with the chosen route only

## 🗺️ Real delivery tracking

- **Leaflet** map with dark CARTO tiles matching the cyberpunk aesthetic
- **Geocoding pipeline built for Brazil**: ViaCEP resolves the street, then Nominatim structured search pins it (direct CEP lookup returns wrong neighborhoods in Brazil — discovered and worked around)
- **Real routing via OSRM** with alternative routes; route choice is restricted to delivery/admin roles
- **Dynamic ETA** counting down based on actual route duration × delivery progress, formatted per language

## 🔐 Security (audited RLS)

All access rules are enforced **in the database** via Row Level Security — the front-end is never the security boundary. A self-audit found and fixed real vulnerabilities:

- ❌ Privilege escalation (users could self-promote to admin) → ✅ blocked by a `guard_role_change` trigger; only admins change roles
- ❌ Public e-mail exposure → ✅ profiles scoped to owner + staff
- ❌ Orders could be created on behalf of others → ✅ INSERT anchored to the authenticated user
- Guests keep a localStorage cart; logged-in users get a database cart with **merge-on-login**

## 🧰 Stack

**React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · react-i18next · Recharts · Leaflet · Supabase (PostgreSQL, Auth, RLS, Realtime) · Vercel**

## 🏆 Origin story

MIKROKOSMOS started as a Front-End Development course project at Unasp-SP, where it took **2nd place in the class competition with a perfect score** — with special praise for its internationalization. It has since been re-engineered from a browser-only prototype (localStorage) into a database-backed, real-time, self-service system.

## 🗺️ Roadmap to market

Deliberate phasing — demo today, product tomorrow:

- [ ] **Multi-tenancy** (`tenant_id` + RLS isolation) to serve many restaurants on one deployment
- [ ] **Real payments** (Stripe / Mercado Pago) replacing the simulated checkout
- [ ] **Original themed content** replacing trademarked references (K-pop groups / movie franchises are demo-only; commercialization requires licensed or original IP)
- [ ] Live courier GPS position streamed via Realtime

## 👩‍💻 Authors

**Alice de Oliveira Rocha** — architecture & development · **Giovanna** — collaborator

---

*"On Wednesdays we wear pink — and ship features."* 💜
