# Block 5 Verification - Proactive Automation Test Results

## 1. System User & Role History (`system-users.http`)
| # | Label | Expected | Actual Result |
|---|---|---|---|
| 30 | [USER-AUTO-01] Role Change Trigger | 200 OK & Notification Created | ` ` |
| 31 | [USER-AUTO-01-CHECK-A] Verify History | Record Added (+1) | ` ` |
| 32 | [USER-AUTO-01-CHECK-B] Verify Notif | 'Rol actualizado' Received | ` ` |
| 33 | [USER-AUTO-02] Fail-Fast No-Op | 200 OK & No New Records | ` ` |
| 34 | [USER-AUTO-02-CHECK-A] Verify History Baseline | No Additional Record | ` ` |
| 35 | [USER-AUTO-02-CHECK-B] Verify Notif Baseline | No Additional ROLE_UPDATED | ` ` |
| 36 | [USER-AUTO-RESET] Restore Original Role | 200 OK & Role Restored to WORKER | ` ` |

## 2. Inventory Movements & Alerts (`inventory-movement.http`)
| # | Label | Expected | Actual Result |
|---|---|---|---|
| 2.1 | [INV-AUTO-01] Trigger Low Stock | 201 Created & Alert Triggered | |
| 2.2 | [INV-AUTO-02-A] Admin Inbox | 'Alerta de inventario bajo' Received | |
| 2.3 | [INV-AUTO-02-B] Resource Inbox | 'Alerta de inventario bajo' Received | |

## 3. Expedition Participants (`expedition-participant.http`)
| # | Label | Expected | Actual Result |
|---|---|---|---|
| 3.1 | [EXP-AUTO-01] Assignment Trigger | 201 Created & Worker Notified | |
| 3.2 | [EXP-AUTO-02] Worker Inbox | 'Asignacion de expedicion' Received | |
