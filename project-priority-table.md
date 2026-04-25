# Project Priority Table

## Purpose

This document fixes the current implementation priority order so context is not lost while development continues.

## Priority Table

| Priority | Feature Group | Current Status | Why It Comes First | Done Means |
|---|---|---|---|---|
| P1 | Authentication and authorization | Partially implemented | Most other features depend on account and permission structure | Real sign up, login, session persistence, role separation |
| P1 | Data storage architecture | Not fixed | `localStorage` is not enough for real operations | Storage for members, posts, columns, orders is decided and wired |
| P1 | Admin publishing to public site connection | Partially implemented | Admin actions must appear on the public site to be meaningful | Admin-created columns and managed content appear on public pages |
| P2 | Community serverization | Partially implemented | This area already has the most UI and interaction work done | Posts, comments, permissions, edit/delete, search are server-backed |
| P2 | Admin operational tooling | Partially implemented | Some actions are named but not truly functional yet | Member, post, column, and tour management actions work for real |
| P3 | Tour reservation flow | Not implemented | Important for service operations, but safer after P1 and P2 | Reservation save, waitlist handling, admin review |
| P3 | Book ordering and payment | Partially implemented | Revenue feature, but should follow auth and data decisions | Order save, order history, payment integration |
| P4 | Supporting features | Mixed | Improves completeness, but not service-critical right now | Social login, FAQ, terms pages, statistics, supporting UX |

## Decisions Needed From User

| Topic | Decisions Needed |
|---|---|
| Authentication | Use internal auth or an external auth provider |
| Data | Choose database and backend approach |
| Roles | Keep `guest/member/reader/scholar/admin` or simplify |
| Column workflow | Immediate publish or draft/review/scheduled publish |
| Community | Edit/delete rules, image storage, search scope |
| Admin operations | Operator role split and audit-log scope |
| Tours | Approval-based or instant reservation, waitlist rules |
| Orders and payment | Payment provider, cart persistence, inventory tracking |
| Policy pages | When FAQ, terms, and privacy pages should become public |

## Recommended Order

1. Authentication and data structure
2. Admin-to-public content connection
3. Community serverization
4. Admin operational tooling
5. Tour reservation
6. Book ordering and payment
7. Supporting features

## P1 Status

P1 is not fully completed yet.

### P1 Completed Or Partially Completed

- Authentication and authorization: partially completed
- Admin-to-public content connection: partially completed

### P1 Still Remaining

- Data storage architecture: not completed
- Real authentication backend: not completed
- Production-ready persistence for members, posts, columns, and orders: not completed

### Why P2 Should Not Start Yet

Even though some P1 items have progressed, the project still depends on unresolved P1 decisions around backend and persistent storage.
Because of that, moving to P2 now would break the agreed priority rule.

## File Naming Rule

- English file names are the default rule.
- Planning and documentation files should follow the same rule.
