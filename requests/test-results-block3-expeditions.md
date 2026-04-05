# Block 3.1 Verification - Expeditions Security & RBAC Test Plan

## 1. Expedition (`expedition.http`)
| # | Method | Endpoint | Role Testing | Expected HTTP Status | Actual Result |
|---|---|---|---|---|---|
| 1.1 | POST | /api/auth/login | SYSTEM_ADMIN | 200 OK | |
| 1.2 | POST | /api/auth/login | TRAVEL_MANAGER | 200 OK | |
| 1.3 | POST | /api/auth/login | RESOURCE_MANAGEMENT | 200 OK | |
| 1.4 | POST | /api/auth/login | WORKER | 200 OK | |
| 1.5 | POST | /api/auth/login | VISITOR | 200 OK | |
| 1.6 | GET | /api/expeditions | SYSTEM_ADMIN | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiOTEwMGY2NjMtYjdiYS00NGRmLTg3MDktNmRkMTBkZjBmZDg2IiwiaWF0IjoxNzc1NDA5Nzc2LCJleHAiOjE3NzU0MTA5NzZ9.BWz2SaIi0JtKWxnfcIuA6IRvu1z0RQOlyi38WnpjuuM
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 17:22:56 GMT
Connection: close

{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "pages": 0
  }
} |
| 1.7 | GET | /api/expeditions/1 | SYSTEM_ADMIN | 200 OK | HTTP/1.1 404 Not Found
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNmM2ZmQyODctODQwMS00ZDRiLTk4NGEtNTZkMDI4NGEzMmQzIiwiaWF0IjoxNzc1NDA5Nzg3LCJleHAiOjE3NzU0MTA5ODd9.gzXt9h7_fBn7AWw_QWDQu-20Xwz7cILKawuTUpSO5gA
Content-Type: application/json; charset=utf-8
Content-Length: 71
ETag: W/"47-VNC4ZxzcW4Ugpuest/9XnWq9Jls"
Date: Sun, 05 Apr 2026 17:23:07 GMT
Connection: close

{
  "message": "Expedition not found",
  "error": "Not Found",
  "statusCode": 404
}
|
| 1.8 | GET | /api/expeditions | TRAVEL_MANAGER | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJkMWVjN2U2OS02ZTNmLTRhYTItOWNmMS00MzgyNDU0ODM5MDQiLCJpYXQiOjE3NzU0MDk3OTYsImV4cCI6MTc3NTQxMDk5Nn0.wiynnJDJpbuDGxUUHxuganjm-IWnfP0N6aJsNJXNPdc
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 17:23:16 GMT
Connection: close

{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "pages": 0
  }
}
 |
| 1.9 | POST | /api/expeditions | TRAVEL_MANAGER | 201 Created | HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI0Y2YwZGFmMS0wYzYyLTQyYzktYjA4Ni00Yjk5YTRkY2E2NTgiLCJpYXQiOjE3NzU0MDk4MDIsImV4cCI6MTc3NTQxMTAwMn0.diFaQuLEhZuUcnpU2sBkd7lq5wu_EbVSX8gyw-82oi8
Content-Type: application/json; charset=utf-8
Content-Length: 522
ETag: W/"20a-eYscMgxUQOZeZ8NSwBdbNg5wETw"
Date: Sun, 05 Apr 2026 17:23:22 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "campId": 1,
    "name": "expedition-rbac-test",
    "objective": "RBAC validation",
    "destinationDescription": "Zone A",
    "destinationLatitude": "0.0000",
    "destinationLongitude": "0.0000",
    "plannedDepartureDate": "2026-04-10T08:00:00Z",
    "actualDepartureDate": null,
    "plannedReturnDate": "2026-04-12T08:00:00Z",
    "actualReturnDate": null,
    "extraDaysAvailable": 1,
    "extraDaysUsed": 0,
    "status": "PLANNED",
    "createdAt": "2026-04-05T17:23:22.805Z",
    "updatedAt": "2026-04-05T17:23:22.805Z"
  },
  "message": "Expedition created successfully"
}
|
| 1.10 | PUT | /api/expeditions/1 | TRAVEL_MANAGER | 200 OK |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJjM2ZiZmI0NC05OWU2LTRhZjUtOWVhNS0wZTQwZWM4Y2FjY2UiLCJpYXQiOjE3NzU0MDk4MTMsImV4cCI6MTc3NTQxMTAxM30.SEDy7rnocuedM1x9whqVmAXrRAEC9fmtp9BLYa717Kg
Content-Type: application/json; charset=utf-8
Content-Length: 121
ETag: W/"79-Q80ij2B3AnlrrynrgN8GDO/Qay0"
Date: Sun, 05 Apr 2026 17:23:33 GMT
Connection: close

{
  "message": "invalid input value for enum expedition_status_enum: \"IN_PROGRESS\"",
  "error": "Bad Request",
  "statusCode": 400
}
 |
| 1.11 | POST | /api/expeditions | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMTUwNjllNzctZmE1NC00Y2E1LWE3MzMtOWIwMjJiOTEyMWZhIiwiaWF0IjoxNzc1NDA5ODE5LCJleHAiOjE3NzU0MTEwMTl9.yOMTTdw1k2y5i7H8Q6bGpreJ1aUBcn0RZcJNKj5MQb8
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 17:23:39 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 1.12 | PUT | /api/expeditions/1 | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMjZjNWRmNGMtODY3OS00MDA0LTlhYzMtNmZhZTZlNGYxNjY0IiwiaWF0IjoxNzc1NDA5ODI2LCJleHAiOjE3NzU0MTEwMjZ9.bINhlTU0yWNcPQcavLV3hPIueLdt-39W-OTRLXR8BiU
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 17:23:46 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 1.13 | GET | /api/expeditions | WORKER | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZDI2ZDRlNjAtYWI1OS00OWE3LTliYTctMjY0YzdmMGEwNDkwIiwiaWF0IjoxNzc1NDA5ODMzLCJleHAiOjE3NzU0MTEwMzN9.37xHQVMRRBwvxbw7MbbFT7Ngck_59kJ5yDBIsQ6Mxr4
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 17:23:53 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
|
| 1.14 | POST | /api/expeditions | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiODgwOTY0YzMtZjE3NC00YjA1LWFlNGEtZDdmM2Q4Yjk3ZTJiIiwiaWF0IjoxNzc1NDA5ODM5LCJleHAiOjE3NzU0MTEwMzl9.I0Jhq0w6A6Khi4ilaPv5G22YEMC7GL5iHcqbYwTPk3k
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 17:23:59 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 1.15 | PUT | /api/expeditions/1 | WORKER | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMGFhZmVjYTMtZmVmMC00YWM1LWEwN2MtM2E3ZWViYmRkNWNhIiwiaWF0IjoxNzc1NDA5ODQ2LCJleHAiOjE3NzU0MTEwNDZ9.TTlBYpjJwhrRWUrWUSNaqTVjlfrfwbaAXLE9Cp1bGZA
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 17:24:06 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
|
| 1.16 | GET | /api/expeditions | VISITOR | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImNhbXBJZCI6MSwicm9sIjoiVklTSVRPUiIsImp0aSI6IjA3NjYwY2RlLTIxZjUtNDUzNi1hNjliLTAxZDc1MzcyNjExZiIsImlhdCI6MTc3NTQwOTg1MywiZXhwIjoxNzc1NDExMDUzfQ.OPcbeQvRKVtXPuWS1D0kqOrxOvmhH_zn2sMBCaj0n_w
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 17:24:13 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
|
| 1.17 | DELETE | /api/expeditions/1 | TRAVEL_MANAGER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI2OWQ2MjJjOC1hNjM5LTQwMDItYjBiNS04MmZkYjFiYzVjYTEiLCJpYXQiOjE3NzU0MDk4NTgsImV4cCI6MTc3NTQxMTA1OH0.UY82v8vEG3AcDiuJWDRnzsSuVJ4M40kWD8ABQr63nbI
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 17:24:18 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |

## 2. Expedition Participant (`expedition-participant.http`)
| # | Method | Endpoint | Role Testing | Expected HTTP Status | Purpose |
|---|---|---|---|---|---|
| 2.1 | POST | /api/auth/login | SYSTEM_ADMIN | 200 OK | Login and capture token |
| 2.2 | POST | /api/auth/login | TRAVEL_MANAGER | 200 OK | Login and capture token |
| 2.3 | POST | /api/auth/login | RESOURCE_MANAGEMENT | 200 OK | Login and capture token |
| 2.4 | POST | /api/auth/login | WORKER | 200 OK | Login and capture token |
| 2.5 | GET | /api/expedition-participants | SYSTEM_ADMIN | 200 OK | Admin read access allowed |
| 2.6 | GET | /api/expedition-participants/1 | SYSTEM_ADMIN | 200 OK | Admin read by id allowed |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiYjk3Y2EzODgtODIwNi00NzFlLTg2YmQtMDcxYzc4MmQ0MzVjIiwiaWF0IjoxNzc1Mzc1NDIzLCJleHAiOjE3NzUzNzY2MjN9.VJo_bl8vN7YXXw9qSPwGkJ7mZS0ECV1rX7ftS-pddZc
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 07:50:23 GMT
Connection: close

{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "pages": 0
  }
}
| 2.7 | GET | /api/expedition-participants | TRAVEL_MANAGER | 200 OK | Travel manager read access allowed |HTTP/1.1 404 Not Found
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiOTJkMTM5ZGItOWM2Ni00MmFmLTk2M2MtZTk0YjQ0NjQ2NjFjIiwiaWF0IjoxNzc1Mzc1NDM3LCJleHAiOjE3NzUzNzY2Mzd9.aHL5w4bDCw983WyBWsv0AljzpNu6Wv1nA-y-nnVAbiw
Content-Type: application/json; charset=utf-8
Content-Length: 83
ETag: W/"53-4eS4LFe79MUpmfm+J4ZJ/lVSbig"
Date: Sun, 05 Apr 2026 07:50:37 GMT
Connection: close

{
  "message": "Expedition participant not found",
  "error": "Not Found",
  "statusCode": 404
}
| 2.8 | POST | /api/expedition-participants | TRAVEL_MANAGER | 201 Created / 200 OK | Travel manager create allowed | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJjOTUwMzc1YS1mNzEwLTQ0OTYtOTkxMy1hYzIyZWM2ODEwNTAiLCJpYXQiOjE3NzUzNzU0NDgsImV4cCI6MTc3NTM3NjY0OH0.59ViuiJo9LCrabskuMusWoNexLw7Lmdpm49D29E8GAE
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 07:50:48 GMT
Connection: close

{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "pages": 0
  }
}
| 2.9 | PUT | /api/expedition-participants/1 | TRAVEL_MANAGER | 200 OK | Travel manager update allowed |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI5YmE1OWI3ZS04ZWZiLTQwYjItODA5YS1hMDcxMWRkOGVhNjkiLCJpYXQiOjE3NzUzNzU0NTcsImV4cCI6MTc3NTM3NjY1N30.H_pMK_7AMPHeFRKm5_ikmhb7kbfxYWQC5HwR_AvG98U
Content-Type: application/json; charset=utf-8
Content-Length: 120
ETag: W/"78-og9JPRERrKH+QYs21O5weh+HqMg"
Date: Sun, 05 Apr 2026 07:50:57 GMT
Connection: close

{
  "message": "invalid input value for enum participant_status_enum: \"CONFIRMED\"",
  "error": "Bad Request",
  "statusCode": 400
}
| 2.10 | POST | /api/expedition-participants | SYSTEM_ADMIN | 403 Forbidden | Edge case: admin cannot create |HTTP/1.1 404 Not Found
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiIyOThjYzhjNy00NDAyLTQxYTgtODk4MC02NmE0MTgwMDg4YjIiLCJpYXQiOjE3NzUzNzU0NjgsImV4cCI6MTc3NTM3NjY2OH0.ySsQc-__LK2rYMAEtWpOE5e8vlOcVzjsZYcFf9IIdJA
Content-Type: application/json; charset=utf-8
Content-Length: 83
ETag: W/"53-4eS4LFe79MUpmfm+J4ZJ/lVSbig"
Date: Sun, 05 Apr 2026 07:51:08 GMT
Connection: close

{
  "message": "Expedition participant not found",
  "error": "Not Found",
  "statusCode": 404
}
| 2.11 | PUT | /api/expedition-participants/1 | SYSTEM_ADMIN | 403 Forbidden | Edge case: admin cannot update |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMGViNjA4MWMtZDNlOS00NjQ0LWE5NjEtZGZkMzVlN2FkMDM1IiwiaWF0IjoxNzc1Mzc1NDc4LCJleHAiOjE3NzUzNzY2Nzh9.IbNHow1w_OvqXhNThIEE4equlw1uf7GuhMXbB4r3w_A
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 07:51:18 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
| 2.12 | GET | /api/expedition-participants | WORKER | 403 Forbidden | Edge case: worker blocked on read |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNzAzODA3NmQtZDgwYS00YTk4LWFhYjItYmMzNTM3YzVjNjAzIiwiaWF0IjoxNzc1Mzc1NDg4LCJleHAiOjE3NzUzNzY2ODh9.8df0WqnOaWVc-xukzHcnOYHpPf7tOJCla5_9v1DBndQ
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 07:51:28 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
| 2.13 | POST | /api/expedition-participants | WORKER | 403 Forbidden | Edge case: worker blocked on create |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiN2FhM2MzZDctMTM1Yi00ZTQzLTg1MjItMjI2NmUyMmIxNzhkIiwiaWF0IjoxNzc1Mzc1NDk3LCJleHAiOjE3NzUzNzY2OTd9.lI7q5-p5SvYoewfwAsPu-RPNBeri8QAYYvs0k1mdyyY
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 07:51:37 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
| 2.14 | PUT | /api/expedition-participants/1 | WORKER | 403 Forbidden | Edge case: worker blocked on update |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiOWUwMjUxYmItZDYxMS00NmI0LWI0YmQtNmM5Y2U5NGVjNzIwIiwiaWF0IjoxNzc1Mzc1NTA4LCJleHAiOjE3NzUzNzY3MDh9.Tbv1-j1AELpPpfyrh5R6BCewQj_u-eLJm2m9MrRePTM
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 07:51:48 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
| 2.15 | DELETE | /api/expedition-participants/1 | TRAVEL_MANAGER | 403 Forbidden | Audit hard-lock delete blocked | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiOWUwMjUxYmItZDYxMS00NmI0LWI0YmQtNmM5Y2U5NGVjNzIwIiwiaWF0IjoxNzc1Mzc1NTA4LCJleHAiOjE3NzUzNzY3MDh9.Tbv1-j1AELpPpfyrh5R6BCewQj_u-eLJm2m9MrRePTM
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 07:51:48 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}

## 3. Expedition Resource Consumed (`expedition-resource-consumed.http`)
| # | Method | Endpoint | Role Testing | Expected HTTP Status | Purpose |
|---|---|---|---|---|---|
| 3.1 | POST | /api/auth/login | SYSTEM_ADMIN | 200 OK | Login and capture token |
| 3.2 | POST | /api/auth/login | TRAVEL_MANAGER | 200 OK | Login and capture token |
| 3.3 | POST | /api/auth/login | RESOURCE_MANAGEMENT | 200 OK | Login and capture token |
| 3.4 | POST | /api/auth/login | WORKER | 200 OK | Login and capture token |
| 3.5 | GET | /api/expedition-resources-consumed | SYSTEM_ADMIN | 200 OK | Admin read allowed |
| 3.6 | GET | /api/expedition-resources-consumed | RESOURCE_MANAGEMENT | 200 OK | Resource management read allowed | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiN2I2NTA3YTMtYWZjZC00ZTY1LTljZTktMWI4NzU1ODUxNzAwIiwiaWF0IjoxNzc1Mzc1NTgxLCJleHAiOjE3NzUzNzY3ODF9.GP7mffddwEhnkHxhY9UXboRGAZjv0VvjkEie3jHfBx8
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 07:53:01 GMT
Connection: close

{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "pages": 0
  }
}
| 3.7 | GET | /api/expedition-resources-consumed | TRAVEL_MANAGER | 200 OK | Travel manager read allowed |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjI3ZDJiZTlmLTlhYmUtNGMzYi1iZjRiLWI2MWE4NDIzYmQyNyIsImlhdCI6MTc3NTM3NTU5MywiZXhwIjoxNzc1Mzc2NzkzfQ.wIfsFlhmbuZs7U5qS1BZUm7AnbYDsTZ6g8638qADtwE
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 07:53:13 GMT
Connection: close

{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "pages": 0
  }
}
| 3.8 | POST | /api/expedition-resources-consumed | SYSTEM_ADMIN | 201 Created / 200 OK | Admin create allowed | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJjNzUwZmNhZi04MDA5LTRhZTQtOTc3Ni1iZjc0ZDVkMGMxNzgiLCJpYXQiOjE3NzUzNzU2MDMsImV4cCI6MTc3NTM3NjgwM30.sOwkPfuOxwzuRmILPQhz4MrkKkfjIYN6s_Pf5WXDbbg
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 07:53:23 GMT
Connection: close

{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "pages": 0
  }
}
| 3.9 | POST | /api/expedition-resources-consumed | RESOURCE_MANAGEMENT | 201 Created / 200 OK | Resource management create allowed | HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiYWZjNWY3YzktNjhiZC00MzUzLWI2MDEtNTllNjQ1NzVkMTFiIiwiaWF0IjoxNzc1Mzc1NjExLCJleHAiOjE3NzUzNzY4MTF9.Mh4pOnOMFF1_JZsnf650cP_2N7khHSANtMDtBOZQDtY
Content-Type: application/json; charset=utf-8
Content-Length: 219
ETag: W/"db-i3aO8cos0zCuPJY7k8LcrfXVD3Y"
Date: Sun, 05 Apr 2026 07:53:31 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "expeditionId": 1,
    "resourceTypeId": 1,
    "amount": "500",
    "recordedBy": 1,
    "recordDate": "2026-04-04T08:00:00.000Z",
    "movementId": null
  },
  "message": "Expedition consumed resource recorded successfully"
}
| 3.10 | POST | /api/expedition-resources-consumed | TRAVEL_MANAGER | 201 Created / 200 OK | Travel manager create allowed | HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImQ0NGFkYjUyLTRlYzItNDU3ZS05MjY4LTQwZjBkNDczMTk5MSIsImlhdCI6MTc3NTM3NTYyMiwiZXhwIjoxNzc1Mzc2ODIyfQ.wHlfHlY-2uMw0SgMJxKUS290StEyB_J9P2Oc1Meg4xk
Content-Type: application/json; charset=utf-8
Content-Length: 117
ETag: W/"75-OvAm1yzOwRCgk76uEDiAeJBH5Pw"
Date: Sun, 05 Apr 2026 07:53:42 GMT
Connection: close

{
  "message": "This consumed resource record already exists for this expedition",
  "error": "Bad Request",
  "statusCode": 400
}
| 3.11 | PUT | /api/expedition-resources-consumed/1 | SYSTEM_ADMIN | 200 OK | Admin update allowed |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJlNGYzNWVlMy02ZjdmLTRjY2YtYjVjZi1hY2UwZGQyZDRmYjYiLCJpYXQiOjE3NzUzNzU2MzMsImV4cCI6MTc3NTM3NjgzM30.n279TZ9XDnqNign4JOl_5cnIibo86vAMX6tkCi1LJvw
Content-Type: application/json; charset=utf-8
Content-Length: 132
ETag: W/"84-pJRREehhbOyBj0hLE2ZHn3bxNK4"
Date: Sun, 05 Apr 2026 07:53:53 GMT
Connection: close

{
  "message": "Only RESOURCE_MANAGEMENT or SYSTEM_ADMIN can record consumed expedition resources",
  "error": "Forbidden",
  "statusCode": 403
}
| 3.12 | PUT | /api/expedition-resources-consumed/1 | RESOURCE_MANAGEMENT | 200 OK | Resource management update allowed |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiODM3ZmI5ZTctNGQ5NS00NzdkLWI1ZDktZjYzZDcyNjM3NWMzIiwiaWF0IjoxNzc1Mzc1NjQ0LCJleHAiOjE3NzUzNzY4NDR9._P3cr4o3H1Cb2RWJowvdDhY8CqG88x5ljOuEMomuzqs
Content-Type: application/json; charset=utf-8
Content-Length: 196
ETag: W/"c4-YKaHqNS+Ih8OK881pr+oBfvrPgw"
Date: Sun, 05 Apr 2026 07:54:04 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "expeditionId": 1,
    "resourceTypeId": 1,
    "amount": "410",
    "recordedBy": 1,
    "recordDate": "2026-04-04T08:00:00.000Z",
    "movementId": null
  },
  "message": "Record updated successfully"
}
| 3.13 | PUT | /api/expedition-resources-consumed/1 | TRAVEL_MANAGER | 200 OK | Travel manager update allowed |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImM4ODYwYjI5LTdkOTItNGQ3Mi1hYmY4LTBmYWRiMGMyMzYwNiIsImlhdCI6MTc3NTM3NTY1NSwiZXhwIjoxNzc1Mzc2ODU1fQ.-oNrgTYNd9su6P0h5L-rqMdjuY8Bzw4QxGiaraBBsJQ
Content-Type: application/json; charset=utf-8
Content-Length: 196
ETag: W/"c4-btALiTlc8fG7uLb+fbdPWzgNGVQ"
Date: Sun, 05 Apr 2026 07:54:15 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "expeditionId": 1,
    "resourceTypeId": 1,
    "amount": "405",
    "recordedBy": 1,
    "recordDate": "2026-04-04T08:00:00.000Z",
    "movementId": null
  },
  "message": "Record updated successfully"
}
| 3.14 | GET | /api/expedition-resources-consumed | WORKER | 403 Forbidden | Edge case: worker blocked on read |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI5MGRjNTQxZi0wMDk4LTQxYTAtYjQxOS1hNDY3NmNlZTMzZmYiLCJpYXQiOjE3NzUzNzU2NjUsImV4cCI6MTc3NTM3Njg2NX0.9X75PX-b8KxcD-9HDLjOGPnMb8mPwLkGLeIEjYVDlQw
Content-Type: application/json; charset=utf-8
Content-Length: 196
ETag: W/"c4-9C68TnP1A41w70wNBQSWuyEeSR8"
Date: Sun, 05 Apr 2026 07:54:25 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "expeditionId": 1,
    "resourceTypeId": 1,
    "amount": "400",
    "recordedBy": 1,
    "recordDate": "2026-04-04T08:00:00.000Z",
    "movementId": null
  },
  "message": "Record updated successfully"
}
| 3.15 | POST | /api/expedition-resources-consumed | WORKER | 403 Forbidden | Edge case: worker blocked on create |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNzJhNmYxMzItNzU1ZC00Zjc0LThhNmEtNTEzNWVjZWE4ZDFlIiwiaWF0IjoxNzc1Mzc1Njc0LCJleHAiOjE3NzUzNzY4NzR9.Pt1iIMesfJgEx21KhiEfy_LCKxThtAgUpiHgXlaxFfU
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 07:54:34 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
| 3.16 | PUT | /api/expedition-resources-consumed/1 | WORKER | 403 Forbidden | Edge case: worker blocked on update |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiODJlMjJmOTUtMjE5Mi00Y2Q5LTlhZWQtZDkxMWM4ZDlmOGUxIiwiaWF0IjoxNzc1Mzc1NjgyLCJleHAiOjE3NzUzNzY4ODJ9.emoFXtV2g1fkkjOfTnlmPoEgWRRqqYHoQmWxve6399Y
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 07:54:42 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
| 3.17 | DELETE | /api/expedition-resources-consumed/1 | SYSTEM_ADMIN | 403 Forbidden | Audit hard-lock delete blocked | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMmJkNTkxYWQtODQ3YS00YzRkLTk0NWUtYjNlZTJjYzA5MmRhIiwiaWF0IjoxNzc1Mzc1NjkyLCJleHAiOjE3NzUzNzY4OTJ9.o4zh_GREEzKCFDPBYcpK-cc0tpDOyOoKiU_-OG0U1hE
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 07:54:52 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}

## 4. Expedition Resource Obtained (`expedition-resource-obtained.http`)
| # | Method | Endpoint | Role Testing | Expected HTTP Status | Purpose |
|---|---|---|---|---|---|
| 4.1 | POST | /api/auth/login | SYSTEM_ADMIN | 200 OK | Login and capture token |
| 4.2 | POST | /api/auth/login | TRAVEL_MANAGER | 200 OK | Login and capture token |
| 4.3 | POST | /api/auth/login | RESOURCE_MANAGEMENT | 200 OK | Login and capture token |
| 4.4 | POST | /api/auth/login | WORKER | 200 OK | Login and capture token |
| 4.5 | GET | /api/expedition-resources-obtained | SYSTEM_ADMIN | 200 OK | Admin read allowed |
| 4.6 | GET | /api/expedition-resources-obtained | RESOURCE_MANAGEMENT | 200 OK | Resource management read allowed |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiZTVmNThiNjQtZmE2Mi00NWRkLWI1ZWYtZTBmZmUwZWExZTdhIiwiaWF0IjoxNzc1Mzc1NzI0LCJleHAiOjE3NzUzNzY5MjR9.Hg1hyx_bs5iUUogs44kjrbThJbXMWPptGLI1TZ9o7bA
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 07:55:24 GMT
Connection: close

{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "pages": 0
  }
}
| 4.7 | GET | /api/expedition-resources-obtained | TRAVEL_MANAGER | 200 OK | Travel manager read allowed |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImIwZWY1ZmIzLTQ2M2YtNDU2Yi05ZjBhLTY0MTQ4MDAzNDk3MCIsImlhdCI6MTc3NTM3NTczNiwiZXhwIjoxNzc1Mzc2OTM2fQ.uTVyZ3D5FzjnWuHZ3SqikSHY_dv4iB53clJrPGFyLKs
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 07:55:36 GMT
Connection: close

{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "pages": 0
  }
}
| 4.8 | POST | /api/expedition-resources-obtained | SYSTEM_ADMIN | 201 Created / 200 OK | Admin create allowed | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJjOTk0ZTU3Ni1mOTlkLTQwZmYtYjBmZi00ZmI1ZWVlMGQxZjIiLCJpYXQiOjE3NzUzNzU3NDUsImV4cCI6MTc3NTM3Njk0NX0.hqXyMGiCuYWr4iBZKn80VSFsYvxrzyouSwdOVH77yNo
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 07:55:45 GMT
Connection: close

{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "pages": 0
  }
}
| 4.9 | POST | /api/expedition-resources-obtained | RESOURCE_MANAGEMENT | 201 Created / 200 OK | Resource management create allowed |HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMzhkM2NjZWItOTgyYy00NWIwLTk4ZGYtMzc4NWY4NGQwYWZmIiwiaWF0IjoxNzc1Mzc1NzU0LCJleHAiOjE3NzUzNzY5NTR9.kZkI7cl43S9IRYxxrav7eT8HtE2OLsZmr_-8WrB_JiE
Content-Type: application/json; charset=utf-8
Content-Length: 219
ETag: W/"db-YEoI9lF1xEXDeAFE2CMaLu2mUmg"
Date: Sun, 05 Apr 2026 07:55:54 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "expeditionId": 1,
    "resourceTypeId": 1,
    "amount": "200",
    "recordedBy": 1,
    "recordDate": "2026-04-04T08:30:00.000Z",
    "movementId": null
  },
  "message": "Expedition obtained resource recorded successfully"
}
| 4.10 | POST | /api/expedition-resources-obtained | TRAVEL_MANAGER | 201 Created / 200 OK | Travel manager create allowed |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImFhMDE4MDE1LTI0OGUtNGNjMC1hODEzLWIyNGRlNWYzZjFlNSIsImlhdCI6MTc3NTM3NTc2NSwiZXhwIjoxNzc1Mzc2OTY1fQ.ZPbD1wcaCwkuJOGUbo91qxY-u0PDgg2ceiZloAMbsx4
Content-Type: application/json; charset=utf-8
Content-Length: 117
ETag: W/"75-NNO3DWfuYy1yceBiqwGp1IhOLbE"
Date: Sun, 05 Apr 2026 07:56:05 GMT
Connection: close

{
  "message": "This obtained resource record already exists for this expedition",
  "error": "Bad Request",
  "statusCode": 400
}
| 4.11 | PUT | /api/expedition-resources-obtained/1 | SYSTEM_ADMIN | 200 OK | Admin update allowed |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiIyMzI1MTg2OC04NzlkLTRiNjgtOGIzNi02MDUzMzI2YThkZTMiLCJpYXQiOjE3NzUzNzU3NzcsImV4cCI6MTc3NTM3Njk3N30.xdx-zEK5xT8U9kFnGQ-nuadEAPD9L0u1VynJNbbr0FA
Content-Type: application/json; charset=utf-8
Content-Length: 132
ETag: W/"84-Ge+vK2JgT2qgy2baUGA9HdBD1Gg"
Date: Sun, 05 Apr 2026 07:56:17 GMT
Connection: close

{
  "message": "Only RESOURCE_MANAGEMENT or SYSTEM_ADMIN can record obtained expedition resources",
  "error": "Forbidden",
  "statusCode": 403
}
| 4.12 | PUT | /api/expedition-resources-obtained/1 | RESOURCE_MANAGEMENT | 200 OK | Resource management update allowed |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNTNlMTM4NjAtNGE1MS00OTFjLTg1MTYtOTc0ZmMzMjdmNDJiIiwiaWF0IjoxNzc1Mzc1NzkxLCJleHAiOjE3NzUzNzY5OTF9.-8-M1ROThts2ilNUzV0dB8iUGsTslxFMohHZljQagFo
Content-Type: application/json; charset=utf-8
Content-Length: 196
ETag: W/"c4-59JwiMGyzY6MkaAp2DWz4qXPXGE"
Date: Sun, 05 Apr 2026 07:56:31 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "expeditionId": 1,
    "resourceTypeId": 1,
    "amount": "250",
    "recordedBy": 1,
    "recordDate": "2026-04-04T08:30:00.000Z",
    "movementId": null
  },
  "message": "Record updated successfully"
}
| 4.13 | PUT | /api/expedition-resources-obtained/1 | TRAVEL_MANAGER | 200 OK | Travel manager update allowed |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjdjMjhjNWZlLTMxMTAtNGVmNi1iM2ZlLTIyZTI3ZDM0YWQyOSIsImlhdCI6MTc3NTM3NTc5OSwiZXhwIjoxNzc1Mzc2OTk5fQ.oRBLAozHYe-aLgIOFWKyye0pU3buy0A_jdzPhYvjJcE
Content-Type: application/json; charset=utf-8
Content-Length: 196
ETag: W/"c4-Unrxb5JFlkCG24OlWmJuFx+LVYY"
Date: Sun, 05 Apr 2026 07:56:39 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "expeditionId": 1,
    "resourceTypeId": 1,
    "amount": "260",
    "recordedBy": 1,
    "recordDate": "2026-04-04T08:30:00.000Z",
    "movementId": null
  },
  "message": "Record updated successfully"
}
| 4.14 | GET | /api/expedition-resources-obtained | WORKER | 403 Forbidden | Edge case: worker blocked on read |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI0YWFlMGM4Yy0xZTA1LTRhMjEtOWJjYy0xYzllNTYzYjMwOWYiLCJpYXQiOjE3NzUzNzU4MTAsImV4cCI6MTc3NTM3NzAxMH0.DdshVRIipLaYyI8GkSq4AMXXw7_3y_fFS9VCSENt5jk
Content-Type: application/json; charset=utf-8
Content-Length: 196
ETag: W/"c4-S440ahe41D8ISTt+jZMErbVmVJo"
Date: Sun, 05 Apr 2026 07:56:50 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "expeditionId": 1,
    "resourceTypeId": 1,
    "amount": "270",
    "recordedBy": 1,
    "recordDate": "2026-04-04T08:30:00.000Z",
    "movementId": null
  },
  "message": "Record updated successfully"
}
| 4.15 | POST | /api/expedition-resources-obtained | WORKER | 403 Forbidden | Edge case: worker blocked on create |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMmJmZTIwM2EtYTY3Ny00Zjc1LWEyMTktNDM2NmRkNGZhNTI0IiwiaWF0IjoxNzc1Mzc1ODIxLCJleHAiOjE3NzUzNzcwMjF9.BpIlyEwwh4btr4bY62iRtCHcUHP7Ov1t72lCXLRqkUc
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 07:57:01 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
| 4.16 | PUT | /api/expedition-resources-obtained/1 | WORKER | 403 Forbidden | Edge case: worker blocked on update |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMmJiMWE4YTItZTg2OS00MjNiLWJmOGEtNGU4ZmZkOWMxMGIzIiwiaWF0IjoxNzc1Mzc1ODMyLCJleHAiOjE3NzUzNzcwMzJ9.IanGgU97M2z6QSqdw7JYTXuW2DRIw1fZhsXHLMne4gg
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 07:57:12 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
| 4.17 | DELETE | /api/expedition-resources-obtained/1 | TRAVEL_MANAGER | 403 Forbidden | Audit hard-lock delete blocked |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNTBkNDAwNzUtN2U0YS00OGFhLThhNWUtNTVjNDc2OTYyNWNkIiwiaWF0IjoxNzc1Mzc1ODQyLCJleHAiOjE3NzUzNzcwNDJ9.DOQsdshpeDsW2tBkujHvRLcUOXm8H1zd45tW3RDpN4I
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 07:57:22 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
