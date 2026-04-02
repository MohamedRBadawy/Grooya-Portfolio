# Custom Domain Architecture

## Launch Scope
- `Pro` only
- CNAME-only
- subdomains only, for example `portfolio.example.com`
- no apex/root domains in v1

## Edge Strategy
- Cloudflare sits in front of the app.
- Cloudflare-managed SSL/custom hostnames terminate certificates.
- Django remains the origin and resolves the incoming hostname to a portfolio.

## Domain Lifecycle
1. User submits the hostname.
2. Backend creates a `Domain` record in `pending_dns`.
3. UI shows the CNAME target and verification instructions.
4. Backend verifies DNS.
5. Status moves to `active` and the domain is bound to a published portfolio.

## Operational States
- `pending_dns`
- `verifying`
- `active`
- `misconfigured`
- `disabled`

## Required Backend Checks
- hostname uniqueness
- ownership and entitlement checks
- DNS resolution
- portfolio assignment validity
- SSL state sync
