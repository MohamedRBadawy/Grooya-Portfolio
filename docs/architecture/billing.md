# Billing Architecture

## Purpose
Billing will move from fake client-side plan switching to server-owned Stripe workflows.

## Launch Rules
- Stripe is the first provider.
- Only recurring subscriptions at launch.
- No AI credit packs or lifetime access.
- Free, Starter, and Pro are the only launch plans.

## Responsibilities
- Frontend:
  - show plan catalog
  - start checkout
  - open customer portal
  - render entitlement state
- Backend:
  - create checkout sessions
  - receive webhooks
  - persist subscription state
  - calculate entitlements
  - apply coupons

## Guardrails
- Do not mutate plan state in the browser.
- Do not trust pricing values embedded in the UI for final billing truth.
- Use Stripe webhooks to finalize subscription state.
