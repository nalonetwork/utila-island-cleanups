# Utila Island Cleanups

Official website for **Utila Island Cleanups** (a registered 501(c)(3) non-profit organization).  
🌱 Creating awareness one cleanup at a time.

**Live Site:** [www.utilaislandcleanups.org](https://www.utilaislandcleanups.org)

## Mission

We are committed to protecting the beaches, reefs, and communities of Utila, Honduras through weekly cleanups, marine conservation education, and responsible waste management.

## Features

- **Trilingual Content:** Instant language switching across **English**, **Spanish**, and **French**.
- **Real-Time Impact Tracking:** Live counters and a categorized Waste Breakdown table connected to Supabase, with support for manual cleanup count overrides.
- **Admin Portal (`/admin`):** Authenticated dashboard to log cleanups, update waste breakdown weights, override total cleanup counts, and manage homepage Instagram posts.
- **Partners & Sponsors (`/partners`):** Showcases Main Partners and Supporting Partners with external website links.
- **About Us (`/about`):** Highlights the organization's mission, core values, Founding Members, and Advisory Board of Directors.
- **Get Involved & Gallery (`/get-involved`, `/gallery`):** Weekly cleanup schedules, volunteer/donation pathways, trash journey map, and community photo galleries.

## Tech Stack

- **Framework:** [Astro](https://astro.build/) (static site generation with shared layout components)
- **Backend & Auth:** [Supabase](https://supabase.com/) (`utila` schema for `cleanups`, `waste_breakdown`, `site_settings`, and `instagram_posts`)
- **Styling & Icons:** Custom responsive CSS (`public/style.css`) and Ionicons

## Local Development

```bash
npm install
npm run dev
