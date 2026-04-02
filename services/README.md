# Services

Service modules hold reusable domain logic and configuration.

## Current Direction
- Centralize shared rules such as plans, feature flags, templates, and portfolio presets.
- Keep UI components thin by calling named helpers instead of inlining domain transforms.
- Prefer typed inputs and outputs for every exported function.
