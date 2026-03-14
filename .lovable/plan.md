

## Plan: Add Order Status Tracking to Admin Panel

### Overview
Add a status field to track the T-shirt lifecycle for each member. Admin can set status individually (e.g., for "Distributed") or in bulk (e.g., for "Sent to Print", "Printing", "Collected").

### Statuses
Four clear statuses with color-coded badges:
- **Pending** (gray) -- size submitted, not yet sent to print
- **Printing** (yellow) -- sent to printer / in progress
- **Ready** (blue) -- collected from printer, ready to distribute
- **Distributed** (green) -- handed to the member

### Changes

**1. `src/lib/members.ts`**
- Add `OrderStatus` type: `'pending' | 'printing' | 'ready' | 'distributed'`
- Add `order_status` field to `Member` interface (default: `'pending'`)
- Ensure existing members get `'pending'` as default
- Include `order_status` in CSV export

**2. `src/components/AdminPanel.tsx`**
- **Bulk status update section** at the top: a row of status buttons. When admin clicks one, a confirmation dialog applies that status to ALL submitted members at once. Useful for "Printing" and "Ready" stages.
- **Individual status toggle** on each member row: a clickable status badge that cycles to the next status (or a small dropdown). This is useful for marking individual members as "Distributed" when they pick up their shirt.
- Show current status as a colored badge next to each member's name.
- Add a filter row to filter members by status.

**3. Visual Design**
- Status badges use distinct colors: gray (Pending), amber (Printing), blue (Ready), green (Distributed)
- Bulk action buttons at the top with a count indicator showing how many members will be affected
- Confirmation toast after bulk updates

