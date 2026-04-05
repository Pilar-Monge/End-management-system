# Block 3.2 Verification - Transfers Security & RBAC Test Plan

## 1. Intercamp Request
| # | Method | Endpoint | Role Testing | Expected HTTP Status | Actual Result |
|---|---|---|---|---|---|
| 1.1 | POST | /api/auth/login | SYSTEM_ADMIN | 200 OK |HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 354
ETag: W/"162-nQPQsCYIvsLrM7HgZ6k7juOfuVM"
Date: Sun, 05 Apr 2026 19:57:49 GMT
Connection: close

{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNzE5ODNiYjQtZTY0OC00MDlhLWJmNmQtMjQyMGUwM2U2YmZkIiwiaWF0IjoxNzc1NDE5MDY5LCJleHAiOjE3NzU0MjAyNjl9.b2SRgDZigV9HFSFRYI7Nz0IKt-8THuXCY9VVtdDErV4",
    "user": {
      "id": 1,
      "username": "admin_camp1",
      "rol": "SYSTEM_ADMIN",
      "campId": 1
    }
  }
} |
| 1.2 | POST | /api/auth/login | TRAVEL_MANAGER | 200 OK |    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJjNmE5OWU3MC00Yzg3LTQ4OWItODNlYS0yZDRlY2QzMjc2YjIiLCJpYXQiOjE3NzU0MTkxMDUsImV4cCI6MTc3NTQyMDMwNX0.cTC-zbr5QHag7f0u1etkedO5nS6iA6vGyGTUHk9wp4w",
    "user": {
      "id": 4,
      "username": "travel_camp1",
      "rol": "TRAVEL_MANAGER",
      "campId": 1
    }
  }
} |
| 1.3 | POST | /api/auth/login | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 374
ETag: W/"176-pr+2b5dcyC3i28zH9RgaUOiAJs0"
Date: Sun, 05 Apr 2026 19:58:45 GMT
Connection: close

{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImJiZDg3ZWRlLTQ4ZTAtNDJjZS1iYmExLTA0NjkyNDI5ODcxMCIsImlhdCI6MTc3NTQxOTEyNSwiZXhwIjoxNzc1NDIwMzI1fQ.vnCfdSJh1yCDfFb0IbOXbi7BOtRdtiXlI_C593FVHJA",
    "user": {
      "id": 3,
      "username": "resource_camp1",
      "rol": "RESOURCE_MANAGEMENT",
      "campId": 1
    }
  }
}
 |
| 1.4 | POST | /api/auth/login | WORKER | 200 OK |HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 341
ETag: W/"155-AkvEInYaALXCVobfdYvby3XQgOc"
Date: Sun, 05 Apr 2026 19:59:29 GMT
Connection: close

{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZGY0OWRlM2ItM2E2NC00N2U0LWJmMTAtYzJkZjAxNTM3ZTk2IiwiaWF0IjoxNzc1NDE5MTY5LCJleHAiOjE3NzU0MjAzNjl9.IJ3VnG3Wo1cyaQFZ8Z8MeQU9oUzf0Dbs4C-WVPwTStE",
    "user": {
      "id": 2,
      "username": "worker_camp1",
      "rol": "WORKER",
      "campId": 1
    }
  }
}
 |
| 1.5 | POST | /api/auth/login | VISITOR | 200 OK |HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 341
ETag: W/"155-vLjT210fGhHCJr2Y1KZGE9xXuak"
Date: Sun, 05 Apr 2026 19:59:51 GMT
Connection: close

{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZTAzNmZmMDgtYjkxYS00ZGY1LWEwNWUtNWNkMjUxMzJlZDI4IiwiaWF0IjoxNzc1NDE5MTkxLCJleHAiOjE3NzU0MjAzOTF9.PCpK38QnHOeNt-idw0BrZQGfpLRXP4uKURpQUOhml1s",
    "user": {
      "id": 2,
      "username": "worker_camp1",
      "rol": "WORKER",
      "campId": 1
    }
  }
}
 |
| 1.6 | GET | /api/intercamp-requests | SYSTEM_ADMIN | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNmU2ODE3M2MtYWZhOS00ZGEwLTk5YWUtNjYxZTk5YmJiZGZlIiwiaWF0IjoxNzc1NDE5MjQxLCJleHAiOjE3NzU0MjA0NDF9.g70pgY_U5jTxSYAdcmSc_5KPBuPbw8ShFzAdyUOpyLU
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:00:41 GMT
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
| 1.7 | GET | /api/intercamp-requests | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImIxOGVlOWU5LWZmYzYtNDg4NC04YzAzLWYwZWNmM2JmNGQ3YiIsImlhdCI6MTc3NTQxOTI1NCwiZXhwIjoxNzc1NDIwNDU0fQ.KaJRQwckh1-TvenrPiMPm8yeRl44SxptPwomy6GOciI
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:00:54 GMT
Connection: close
HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI5MjJjZGQxMi0zNmUzLTQ2M2QtYTgyNS1iN2ZhYzg1YWNiN2QiLCJpYXQiOjE3NzU0MTkyNjYsImV4cCI6MTc3NTQyMDQ2Nn0.9eqMn6XYbRWI8XF2dQHjKbAOiqN9AWvofMpjpyVK5kA
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:01:06 GMT
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
| 1.8 | GET | /api/intercamp-requests | TRAVEL_MANAGER | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI5MjJjZGQxMi0zNmUzLTQ2M2QtYTgyNS1iN2ZhYzg1YWNiN2QiLCJpYXQiOjE3NzU0MTkyNjYsImV4cCI6MTc3NTQyMDQ2Nn0.9eqMn6XYbRWI8XF2dQHjKbAOiqN9AWvofMpjpyVK5kA
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:01:06 GMT
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
| 1.9 | GET | /api/intercamp-requests | WORKER | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMDA3NTlmMjctZWIxOC00OWEyLWJlMTgtOGMwODM2ZjI3YzYzIiwiaWF0IjoxNzc1NDE5MjgwLCJleHAiOjE3NzU0MjA0ODB9.ylnGTQUC8HUljHC_JQln3W3-33OgmvLfbFU6f9jrWMI
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:01:20 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
|
| 1.10 | GET | /api/intercamp-requests | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNmFjZTQ5MmYtZGYwMi00YjliLWE5MDUtOTJjMzBhYWRmYzIyIiwiaWF0IjoxNzc1NDE5Mjk1LCJleHAiOjE3NzU0MjA0OTV9.8yCu7wLSKFFbNaZKDgHjI6umGdavZAuzxfwvHt_AnuA
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:01:35 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 1.11 | POST | /api/intercamp-requests | RESOURCE_MANAGEMENT | 201 Created / 200 OK |HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjgzYWU5NjEyLTg3MDMtNDI1Mi1iN2RkLTRhY2FiMDYzY2I2NSIsImlhdCI6MTc3NTQxOTMwNiwiZXhwIjoxNzc1NDIwNTA2fQ.c0nqt6wPrA68pjkltm3zo406gXi6OWUuBqEYo6M1Xf4
Content-Type: application/json; charset=utf-8
Content-Length: 273
ETag: W/"111-4QbIhqNL2TXNToYeWVw4hH4cWn4"
Date: Sun, 05 Apr 2026 20:01:47 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "originCampId": 1,
    "destinationCampId": 2,
    "status": "PENDING",
    "description": "rbac-resource-request",
    "createdDate": "2026-04-05T12:00:00.000Z",
    "responseDate": null,
    "createdBy": 3,
    "respondedBy": null
  },
  "message": "Intercamp request created successfully"
}
 |
| 1.12 | POST | /api/intercamp-requests | TRAVEL_MANAGER | 201 Created / 200 OK |HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI0YmFjOTZkOC1jZDE4LTRlZTktOWNhNy1lYWQwNDY2MTU0MzIiLCJpYXQiOjE3NzU0MTkzMjYsImV4cCI6MTc3NTQyMDUyNn0.Fs7CdQR63m6NmOqL81-hpZDQvUkHSSTzBl2dO7yc-Pk
Content-Type: application/json; charset=utf-8
Content-Length: 271
ETag: W/"10f-MFAD2ZiYtg2dVj0PT5cD1/oDINY"
Date: Sun, 05 Apr 2026 20:02:06 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 2,
    "originCampId": 1,
    "destinationCampId": 3,
    "status": "PENDING",
    "description": "rbac-travel-request",
    "createdDate": "2026-04-05T12:10:00.000Z",
    "responseDate": null,
    "createdBy": 4,
    "respondedBy": null
  },
  "message": "Intercamp request created successfully"
}
 |
| 1.13 | POST | /api/intercamp-requests | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiYmEyNDUxNDMtNmZiMi00NjI5LWFiMmItZGUxMmMxYWMxNDdkIiwiaWF0IjoxNzc1NDE5MzM3LCJleHAiOjE3NzU0MjA1Mzd9.7IsZKJJrvFcIekHy28KO6eUropetc8fpStEYONwMmQ0
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:02:17 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 1.14 | POST | /api/intercamp-requests | WORKER | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiOTU5N2I3MDctMzc5Yi00OTkzLTk5MzItYWEyNWRmNjM1NjJlIiwiaWF0IjoxNzc1NDE5MzQ3LCJleHAiOjE3NzU0MjA1NDd9.cUBSO6FJLV3ZyfRCxwpl94CA_J5uAznCJOy4d-uRwm4
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:02:27 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
|
| 1.15 | POST | /api/intercamp-requests | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNmVkNjk0N2ItODdhYi00NWZjLWI5NDQtMDlmZDkwNDgxZjY0IiwiaWF0IjoxNzc1NDE5MzU2LCJleHAiOjE3NzU0MjA1NTZ9.uy9WfFpTpQzakYjFQQ_C-ZW8hRFQxR8cGRcruZhxVGs
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:02:36 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 1.16 | PUT | /api/intercamp-requests/1 | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImJlM2RjZjg0LWZmY2MtNGYyYi04ZGVkLTZlMGNiYmUxYWIzNyIsImlhdCI6MTc3NTQxOTM2MywiZXhwIjoxNzc1NDIwNTYzfQ.wk8yBCTHjb8CcWfXAjzK__YfIYu6qdXnKxbsh3slDkk
Content-Type: application/json; charset=utf-8
Content-Length: 274
ETag: W/"112-78iLvRsBGrLs/tHlpWjSJLPgDl8"
Date: Sun, 05 Apr 2026 20:02:43 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "originCampId": 1,
    "destinationCampId": 2,
    "status": "APPROVED",
    "description": "rbac-resource-request",
    "createdDate": "2026-04-05T12:00:00.000Z",
    "responseDate": null,
    "createdBy": 3,
    "respondedBy": null
  },
  "message": "Intercamp request updated successfully"
}
 |
| 1.17 | PUT | /api/intercamp-requests/1 | TRAVEL_MANAGER | 200 OK | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI0NDJlOGNiOS0xYzg2LTQ4NmUtOWIwYi0wZjA4MjY5NjRkMDkiLCJpYXQiOjE3NzU0MTkzNzEsImV4cCI6MTc3NTQyMDU3MX0.0ngr8Ni5RpAfpGqMOF1-5KAeABjqjcVcQ5m9wrdTL2c
Content-Type: application/json; charset=utf-8
Content-Length: 274
ETag: W/"112-J6QIHQWD7UqeyfyCaR3A0/gujMA"
Date: Sun, 05 Apr 2026 20:02:51 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "originCampId": 1,
    "destinationCampId": 2,
    "status": "REJECTED",
    "description": "rbac-resource-request",
    "createdDate": "2026-04-05T12:00:00.000Z",
    "responseDate": null,
    "createdBy": 3,
    "respondedBy": null
  },
  "message": "Intercamp request updated successfully"
}
|
| 1.18 | PUT | /api/intercamp-requests/1 | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiYTYwZjI1NGUtOTAwZi00MDAwLWJlMGItODdjM2Q5MDA5NjBhIiwiaWF0IjoxNzc1NDE5Mzc5LCJleHAiOjE3NzU0MjA1Nzl9.hjd_so85VajZ2ccBSTfStsrerVAsWCHjHP1lI8PJBx0
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:02:59 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 1.19 | PUT | /api/intercamp-requests/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiOThjNzIzZjMtNmEwNS00OTEyLWIyNjQtODNhYWVlOTIyNWUyIiwiaWF0IjoxNzc1NDE5MzkwLCJleHAiOjE3NzU0MjA1OTB9.YiqvNY_ZESTC4E8-tW-Jjp2U-kTjeEhuV7d64bgu_bs
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:03:10 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 1.20 | PUT | /api/intercamp-requests/1 | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiOWExZTU3YjUtYmJjZC00Mjc3LWFiMzgtNjFhYjlmOTk4YTExIiwiaWF0IjoxNzc1NDE5NDA3LCJleHAiOjE3NzU0MjA2MDd9.dbpysF0DjlIhQgTsHvOJJES5RYsqN0XKxo43JPg52Cw
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:03:27 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 1.21 | DELETE | /api/intercamp-requests/1 | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiODM3ZGI5YmEtOTMxYy00YzNkLWIwZWEtZjAwN2JiYTRmOGUxIiwiaWF0IjoxNzc1NDE5NDE4LCJleHAiOjE3NzU0MjA2MTh9.fg1FyWiNROtzV92Qw9GUqb5EefyY8iH53UkgnozB_6M
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:03:38 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 1.22 | DELETE | /api/intercamp-requests/1 | RESOURCE_MANAGEMENT | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjJhMTY0MmI1LTdmMDYtNDE0Ni05NzE1LTc2OWQ5MzMyYTM2MyIsImlhdCI6MTc3NTQxOTQyOSwiZXhwIjoxNzc1NDIwNjI5fQ.-FsQCZeLqmomuYOZxb2OmLJkam8MlAI8PYtl9-GQd_g
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:03:49 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 1.23 | DELETE | /api/intercamp-requests/1 | TRAVEL_MANAGER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJmOTBjZDNmMC1kODUwLTRmZmQtOWMwMi1iOTU4ZjNmN2NmNzAiLCJpYXQiOjE3NzU0MTk0MzgsImV4cCI6MTc3NTQyMDYzOH0.nmHrom146EwuR9NpX0Dzt0mQojpGgvnwQZZ9aFlfUqQ
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:03:58 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 1.24 | DELETE | /api/intercamp-requests/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNzgyMjNjMjUtMzYyZi00Y2ZjLTlmYmQtZmY0ZTUwOWRlMmJkIiwiaWF0IjoxNzc1NDE5NDQ1LCJleHAiOjE3NzU0MjA2NDV9.7aCCHf07RNRkCpZQabf0nac3Z25JifJil_iuqFU_HdE
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:04:05 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 1.25 | DELETE | /api/intercamp-requests/1 | VISITOR | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiYWY0MjlmOTYtZGU0ZC00OTJmLTllNWUtYWU2NzliMTExMmE2IiwiaWF0IjoxNzc1NDE5NDY1LCJleHAiOjE3NzU0MjA2NjV9.eMvB7ibifTJPeuCYU2W2J2HZYzebK4Q40PrO41i1s4w
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:04:25 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
|

## 2. Transfer
| # | Method | Endpoint | Role Testing | Expected HTTP Status | Actual Result |
|---|---|---|---|---|---|
| 2.1 | POST | /api/auth/login | SYSTEM_ADMIN | 200 OK | |
| 2.2 | POST | /api/auth/login | TRAVEL_MANAGER | 200 OK | |
| 2.3 | POST | /api/auth/login | RESOURCE_MANAGEMENT | 200 OK | |
| 2.4 | POST | /api/auth/login | WORKER | 200 OK | |
| 2.5 | POST | /api/auth/login | VISITOR | 200 OK | |
| 2.6 | GET | /api/transfers | SYSTEM_ADMIN | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNzNlYjc5YmItZjYwMi00MjU4LWJlNmItNjMyNGI1NzUwNTk3IiwiaWF0IjoxNzc1NDE5NjE5LCJleHAiOjE3NzU0MjA4MTl9.kQ5Vs_1OB8_xbPEQ27zvSinKIuIp7GGc_tn6klOuIWg
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:06:59 GMT
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
| 2.7 | GET | /api/transfers | RESOURCE_MANAGEMENT | 200 OK | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImJiMmQ1ZjE5LWZkNjMtNDRiZS1iYjNiLTAyYzhmOTg4N2YzYiIsImlhdCI6MTc3NTQxOTYyOSwiZXhwIjoxNzc1NDIwODI5fQ.I3ZnjRtl43WWHHOFJKsWcV3_ZtrJXymKBQUUfjtkTNE
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:07:09 GMT
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
| 2.8 | GET | /api/transfers | TRAVEL_MANAGER | 200 OK | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJmYjFiM2RmYy0zMTRlLTRhOGYtYTcwYS05ZjcxMTQ2ODUyNGMiLCJpYXQiOjE3NzU0MTk2MzUsImV4cCI6MTc3NTQyMDgzNX0.6pSrLE2yukQbYRHMNzakx8oSZvCAxCyuAVVXs6a7k4c
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:07:15 GMT
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
| 2.9 | GET | /api/transfers | WORKER | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiN2RlYzIwZGYtZDkzZC00YzZkLWFiYjUtMzNkOWFhMjZkZDAyIiwiaWF0IjoxNzc1NDE5NjQyLCJleHAiOjE3NzU0MjA4NDJ9.yZsgNaxLeuhYIyDwSCoGniYc3Wc0z9eyzMpY_BXbIZQ
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:07:22 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
|
| 2.10 | GET | /api/transfers | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNWE4NGYyZjQtNTIxMC00MzMxLWIwNDctOGJiYmE2M2UzZjE4IiwiaWF0IjoxNzc1NDE5NjQ5LCJleHAiOjE3NzU0MjA4NDl9.16J4tr6sxg4vmXkXH7z_37Vi5BSxond7Cps3U0b4E4E
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:07:29 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 2.11 | POST | /api/transfers | RESOURCE_MANAGEMENT | 201 Created / 200 OK |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImNmMWY4YTc3LTFiNDMtNGE0YS1iMDc0LTBiMGNjYWVmMWM2NyIsImlhdCI6MTc3NTQxOTY1NSwiZXhwIjoxNzc1NDIwODU1fQ.Eq44p2NEmprTxzrOv-49C24uUu1Y5kjRvicyP29fSVI
Content-Type: application/json; charset=utf-8
Content-Length: 143
ETag: W/"8f-dZpJjLWuXxBVsh0u55UCIzkIrwo"
Date: Sun, 05 Apr 2026 20:07:35 GMT
Connection: close

{
  "message": "new row for relation \"transfer\" violates check constraint \"chk_transfer_status_values\"",
  "error": "Bad Request",
  "statusCode": 400
}
 |
| 2.12 | POST | /api/transfers | TRAVEL_MANAGER | 201 Created / 200 OK |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJhYTM1MmU1NS01MmM0LTQ3NzItYTA4Zi1iM2NkZDNlZGRkMzciLCJpYXQiOjE3NzU0MTk2NjQsImV4cCI6MTc3NTQyMDg2NH0.oOso0XrbZQm8mRdE-ZK44BFC6xImsqVyOrtL863IwkA
Content-Type: application/json; charset=utf-8
Content-Length: 143
ETag: W/"8f-dZpJjLWuXxBVsh0u55UCIzkIrwo"
Date: Sun, 05 Apr 2026 20:07:44 GMT
Connection: close

{
  "message": "new row for relation \"transfer\" violates check constraint \"chk_transfer_status_values\"",
  "error": "Bad Request",
  "statusCode": 400
}
 |
| 2.13 | POST | /api/transfers | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiYjNmYjNiOTktYjZjZi00NmQ2LWIxZTktMTY0YjY3MGEwMTc1IiwiaWF0IjoxNzc1NDE5NjczLCJleHAiOjE3NzU0MjA4NzN9.65scUR-_OTvq3FL7DmBM0_31GhVUOhPubxumChzKJac
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:07:53 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 2.14 | POST | /api/transfers | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMWI1OWZjOTItNDQ1Yi00MmNkLWIyZjQtZTdhYWY1Y2E2MmYwIiwiaWF0IjoxNzc1NDE5NjgwLCJleHAiOjE3NzU0MjA4ODB9.R7HIylmhzLc1pm6IU1rwAwimfWR2CaYrAXWp9HPA9AI
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:08:00 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 2.15 | POST | /api/transfers | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMjhiYjYzM2ItYWI3Zi00OTJjLTlmNjItY2ZkYzllMTIyZDdmIiwiaWF0IjoxNzc1NDE5Njg3LCJleHAiOjE3NzU0MjA4ODd9.QWV8hckTI8MeyDHBsQpZ586O5GZcTJgQ_OdGg7guXWE
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:08:07 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 2.16 | PUT | /api/transfers/1 | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjRlZjQ5ZmM3LWUyNGYtNDIyNy05ZmU1LWZlOGI1ZmY3ZWFmOCIsImlhdCI6MTc3NTQxOTY5MywiZXhwIjoxNzc1NDIwODkzfQ.r5khgzo_6VerapVXum_FyH-m1LrsK_lFx0gbophqlY0
Content-Type: application/json; charset=utf-8
Content-Length: 71
ETag: W/"47-C63h4X3JwF6fA/8Po7naB2rYraA"
Date: Sun, 05 Apr 2026 20:08:13 GMT
Connection: close

{
  "message": "Transfer not found",
  "error": "Bad Request",
  "statusCode": 400
}
 |
| 2.17 | PUT | /api/transfers/1 | TRAVEL_MANAGER | 200 OK |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI5OGRlYjI5MC1lYmRjLTRlNGItYWU4NC1mMGFiZDk0ODQ1NTIiLCJpYXQiOjE3NzU0MTk3MDEsImV4cCI6MTc3NTQyMDkwMX0.W82bIlP4O--f7ZnB6UBQpFuccJG8MJYj5y99cWgftuA
Content-Type: application/json; charset=utf-8
Content-Length: 71
ETag: W/"47-C63h4X3JwF6fA/8Po7naB2rYraA"
Date: Sun, 05 Apr 2026 20:08:21 GMT
Connection: close

{
  "message": "Transfer not found",
  "error": "Bad Request",
  "statusCode": 400
}
 |
| 2.18 | PUT | /api/transfers/1 | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiN2EzNzc4Y2YtMTY2OS00MGMxLWIxMzAtZTNjNzA1Mjc1MjE0IiwiaWF0IjoxNzc1NDE5NzA3LCJleHAiOjE3NzU0MjA5MDd9.URxfd-WuxJu8m4dloZ0lvQWqWPONAQQYxPSQ0Yj0PAM
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:08:27 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 2.19 | PUT | /api/transfers/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZGZkYjY4MDYtZjhlZS00YzAyLWJhZjEtZjAxOTE0OWEzYTYwIiwiaWF0IjoxNzc1NDE5NzEzLCJleHAiOjE3NzU0MjA5MTN9.MdXi83VHVXnwuDnWXgxuSla7JTydL2DHNVjlxWrmjVU
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:08:33 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 2.20 | PUT | /api/transfers/1 | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNWFmOWJmN2ItMjllYy00OWZlLThkMjYtMWRkMTQ2ZjhiZTVkIiwiaWF0IjoxNzc1NDE5NzE5LCJleHAiOjE3NzU0MjA5MTl9.6k1REh2uugmGV39TlirXQuOmZeb1OHvj3oVzH4wEHBU
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:08:39 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 2.21 | DELETE | /api/transfers/1 | SYSTEM_ADMIN | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMTJjZGQyMDAtYjc3Ni00NjIyLWI4OWYtNTNmYjlkYWE5NzE1IiwiaWF0IjoxNzc1NDE5NzI2LCJleHAiOjE3NzU0MjA5MjZ9.yaNR8cgt5k7VAtb2vxMf-Ajwp2eKCkKDEMpoBbUmwSU
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:08:46 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
|
| 2.22 | DELETE | /api/transfers/1 | RESOURCE_MANAGEMENT | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6Ijg4MGQ4ZGI4LTU3NmMtNGQ3Ni1hODVlLWRiYTIwZGRmMTgyOSIsImlhdCI6MTc3NTQxOTczMiwiZXhwIjoxNzc1NDIwOTMyfQ.ToedPj-My7mDicMdVUNS9XR8yecrU3960MJLDyvJ-hc
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:08:52 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 2.23 | DELETE | /api/transfers/1 | TRAVEL_MANAGER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJlMDhhYjg3MS0xZDY0LTQ0YWUtOWQ0Mi04OWIxZjliNTUzODciLCJpYXQiOjE3NzU0MTk3MzksImV4cCI6MTc3NTQyMDkzOX0.bt1XCIHRFYTOvu3Yx1W8gu0RA6eYTH5zJUL6lgGm0eE
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:08:59 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 2.24 | DELETE | /api/transfers/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZTVjZGY5NTctYzQ4Ny00YTgzLTlmMWMtZWIxNDg0YTEwYmU4IiwiaWF0IjoxNzc1NDE5NzQ3LCJleHAiOjE3NzU0MjA5NDd9.dJ3FGWnLTx_ZzO_GB38b5z7bnvPBGH1fxmaL8VaTJHQ
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:09:07 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 2.25 | DELETE | /api/transfers/1 | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZjJiZWY5ZWEtZWUwZS00OTE1LTkwZTUtMmYxNDEzZGIyNTQyIiwiaWF0IjoxNzc1NDE5NzU0LCJleHAiOjE3NzU0MjA5NTR9.X9pObD1NWVMbEuxqIbgUJ8jq4mv3cp1fpG1Z2MA4kNI
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:09:14 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |

## 3. Delivered Transfer Resource
| # | Method | Endpoint | Role Testing | Expected HTTP Status | Actual Result |
|---|---|---|---|---|---|
| 3.1 | POST | /api/auth/login | SYSTEM_ADMIN | 200 OK | |
| 3.2 | POST | /api/auth/login | TRAVEL_MANAGER | 200 OK | |
| 3.3 | POST | /api/auth/login | RESOURCE_MANAGEMENT | 200 OK | |
| 3.4 | POST | /api/auth/login | WORKER | 200 OK | |
| 3.5 | POST | /api/auth/login | VISITOR | 200 OK | |
| 3.6 | GET | /api/delivered-transfer-resources | SYSTEM_ADMIN | 200 OK | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiYjUxZGUwZTYtYWIyMS00MThmLWI3NWEtNDgyN2IyODE2ZGY3IiwiaWF0IjoxNzc1NDE5ODA1LCJleHAiOjE3NzU0MjEwMDV9.XCK0GdMca6bWL2DiZCJ81EAcBHryoqmnTUZCzLjcqDk
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:10:05 GMT
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
| 3.7 | GET | /api/delivered-transfer-resources | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjhmZmY5NWY1LWQxOTMtNGUyYS1hMjA1LTJiNDIxY2U4MTQ0MSIsImlhdCI6MTc3NTQxOTgxMiwiZXhwIjoxNzc1NDIxMDEyfQ._1a5nK8pf7_A7afN0btAvTfZC3jcoJiONylVmKHrzsQ
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:10:12 GMT
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
| 3.8 | GET | /api/delivered-transfer-resources | TRAVEL_MANAGER | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJmYjE1NThjZS03NmI5LTRiNzUtOGQwYS03YmEyMjQxNDNlZmQiLCJpYXQiOjE3NzU0MTk4MTgsImV4cCI6MTc3NTQyMTAxOH0.SFTjEG5lxtPHw4WXBIPdOBdSzgyF1CX4N3-jZMRO9SE
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:10:18 GMT
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
| 3.9 | GET | /api/delivered-transfer-resources | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiYmNiNTczMTYtYjRhOS00MWVmLThlMDMtZTNmNzdkYmEyZGQ4IiwiaWF0IjoxNzc1NDE5ODI1LCJleHAiOjE3NzU0MjEwMjV9.n21BjyFduk2Z0kRuOiW5XTP0PPkeOrLlYVpdwM0JlS4
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:10:25 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 3.10 | GET | /api/delivered-transfer-resources | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMjFjMWYwOTAtNDNkMy00NjA2LTgxYjctNjI0OWZkNDRlNWFlIiwiaWF0IjoxNzc1NDE5ODMyLCJleHAiOjE3NzU0MjEwMzJ9.9OpMlyTiwRXrGzWLnbCrOa98lmuXQsud0UxvTneFKRA
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:10:32 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 3.11 | POST | /api/delivered-transfer-resources | RESOURCE_MANAGEMENT | 201 Created / 200 OK | HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjFhYTI2NGM1LTU2MjYtNDRlZC1hYzllLTMxYzVlOWYzMDAxMSIsImlhdCI6MTc3NTQxOTg0NCwiZXhwIjoxNzc1NDIxMDQ0fQ.XjfTfMG8BfnXumYF4yJfYQUz_cCFMYRWKDxKsEAdb0k
Content-Type: application/json; charset=utf-8
Content-Length: 71
ETag: W/"47-C63h4X3JwF6fA/8Po7naB2rYraA"
Date: Sun, 05 Apr 2026 20:10:44 GMT
Connection: close

{
  "message": "Transfer not found",
  "error": "Bad Request",
  "statusCode": 400
}
|
| 3.12 | POST | /api/delivered-transfer-resources | TRAVEL_MANAGER | 201 Created / 200 OK | HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiIwMjM4YjdiMi1lOTU1LTQ2NWYtYmYxZS05NGFhZGUxOGVjMmQiLCJpYXQiOjE3NzU0MTk4NTIsImV4cCI6MTc3NTQyMTA1Mn0.IalY_JcC15KeSVQdTCBFaajSxSwLbciF7eR14jHPJOg
Content-Type: application/json; charset=utf-8
Content-Length: 71
ETag: W/"47-C63h4X3JwF6fA/8Po7naB2rYraA"
Date: Sun, 05 Apr 2026 20:10:52 GMT
Connection: close

{
  "message": "Transfer not found",
  "error": "Bad Request",
  "statusCode": 400
}
|
| 3.13 | POST | /api/delivered-transfer-resources | SYSTEM_ADMIN | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMjY0MmFjNzUtZjJiMy00MWZiLWI1MTMtMTRhMGEyYmEyZjRiIiwiaWF0IjoxNzc1NDE5ODYxLCJleHAiOjE3NzU0MjEwNjF9.UuRo-di4KUqmAGyW-udLQdBsgwBZjO6oCGJq58Z5_yU
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:11:01 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
|
| 3.14 | POST | /api/delivered-transfer-resources | WORKER | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZjgzNWJmZTktMzdiNS00MzY1LWEyMTItZTgzMmU1YmVmNWJmIiwiaWF0IjoxNzc1NDE5ODczLCJleHAiOjE3NzU0MjEwNzN9.WYGG66MEm_qfL5XPtQZUMymNDdk5dj27IBrBgg9BxuM
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:11:13 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
|
| 3.15 | POST | /api/delivered-transfer-resources | VISITOR | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNGE2MjA0OWEtNjlhOS00MmRlLThlZjgtZDQzOTMzYTVmZWIzIiwiaWF0IjoxNzc1NDE5ODgwLCJleHAiOjE3NzU0MjEwODB9.MXigTQmYKAWrw4sW9B9XsIAS7rPCN-f86KrewBtE89o
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:11:20 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
|
| 3.16 | PUT | /api/delivered-transfer-resources/1 | RESOURCE_MANAGEMENT | 200 OK | HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjY1ZDc1ODExLWNiNTQtNDRmYi1hNDdlLWYyZDNlN2I0N2NkMSIsImlhdCI6MTc3NTQxOTg4NywiZXhwIjoxNzc1NDIxMDg3fQ.UxEfNd6r12alvGpE3dnRVY7T1tfAGaKtOekQB7uAjp8
Content-Type: application/json; charset=utf-8
Content-Length: 90
ETag: W/"5a-bHDcJ2jjk3tPMn/5tBTTE9vxFkw"
Date: Sun, 05 Apr 2026 20:11:27 GMT
Connection: close

{
  "message": "Delivered transfer resource not found",
  "error": "Bad Request",
  "statusCode": 400
}
|
| 3.17 | PUT | /api/delivered-transfer-resources/1 | TRAVEL_MANAGER | 200 OK |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiIxNWFiNzY5My1kMTNkLTRkZDEtYTEwYS04YmE5ZWE3YWVmZTYiLCJpYXQiOjE3NzU0MTk4OTMsImV4cCI6MTc3NTQyMTA5M30.60fM65ZZu1MwQDSxFX8sTTBpZqWyfjIsGnBtr7RiDnU
Content-Type: application/json; charset=utf-8
Content-Length: 90
ETag: W/"5a-bHDcJ2jjk3tPMn/5tBTTE9vxFkw"
Date: Sun, 05 Apr 2026 20:11:33 GMT
Connection: close

{
  "message": "Delivered transfer resource not found",
  "error": "Bad Request",
  "statusCode": 400
}
 |
| 3.18 | PUT | /api/delivered-transfer-resources/1 | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMjVlYmE3MDEtN2Y0MS00YjRhLWE5NDAtOTQ4YjM4OGZhYTkwIiwiaWF0IjoxNzc1NDE5OTAxLCJleHAiOjE3NzU0MjExMDF9.ILGR5TgMM_clRICY38Mm9nbN1mbqPWWo9NcyWJJIvoc
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:11:41 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 3.19 | PUT | /api/delivered-transfer-resources/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMjRhZGEyZDMtMzk0My00MWMxLWI2NWQtYWQ5N2M4OTRiZDY0IiwiaWF0IjoxNzc1NDE5OTA4LCJleHAiOjE3NzU0MjExMDh9.Wso2H5vBjDjIMyZW661S41p3jbz93ScjgJ3_91hZ5A0
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:11:48 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 3.20 | PUT | /api/delivered-transfer-resources/1 | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMTZmOWEwNmMtZmY1My00ZTgwLTg2MjAtNTljMDk3ZTI2NWE2IiwiaWF0IjoxNzc1NDE5OTE0LCJleHAiOjE3NzU0MjExMTR9.PnRqZx79GfYIyW-S78kjz5TpZp1tfafDDkt-z4blu3E
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:11:54 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 3.21 | DELETE | /api/delivered-transfer-resources/1 | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiYWRjZjBlNzEtNDhiNi00YTEzLTk3MzQtMTJkZDU0ZjMzMzhlIiwiaWF0IjoxNzc1NDE5OTIxLCJleHAiOjE3NzU0MjExMjF9.V5PGho_9yLNDH-fy27pK8DX73FTkEMJ9LN9_1aQLE7o
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:12:01 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 3.22 | DELETE | /api/delivered-transfer-resources/1 | RESOURCE_MANAGEMENT | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjQzNDYzMWQ1LTI0MWUtNGYxMy04YmY2LTZmZTBkMTM5Y2JjNyIsImlhdCI6MTc3NTQxOTkyOSwiZXhwIjoxNzc1NDIxMTI5fQ.G-nyPdf39qs6LuuqvyBElRL5Ijuls2qzINsJHCxBFCc
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:12:09 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 3.23 | DELETE | /api/delivered-transfer-resources/1 | TRAVEL_MANAGER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJjY2MxZWZkMy0zMDUzLTRmMmYtYWM5NC00OWI3NmNiYTQ5MjUiLCJpYXQiOjE3NzU0MTk5MzcsImV4cCI6MTc3NTQyMTEzN30.2rdaILv00zInwJHAdMpcT7TwJ6luYGffmfnY1daOmVs
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:12:17 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 3.24 | DELETE | /api/delivered-transfer-resources/1 | WORKER | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMWM3NjdiMTQtYTJkNS00N2JhLWIwMWItNTIzMmRiYTNmNzZmIiwiaWF0IjoxNzc1NDE5OTQ1LCJleHAiOjE3NzU0MjExNDV9.yHHqhoYLRHETYv6HC5mi2FSvYen46nXeIJnWssoNDos
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:12:25 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
|
| 3.25 | DELETE | /api/delivered-transfer-resources/1 | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiOTNjNDY5YTctOTUzYi00YTJjLTgzYTUtNGQ4ZGMwY2E2M2E4IiwiaWF0IjoxNzc1NDE5OTUxLCJleHAiOjE3NzU0MjExNTF9.5XoKINlpLp8pw4TTMXdLbJybSzllbWxr0uP-rpIhAdw
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:12:31 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |

## 4. Transfer History
| # | Method | Endpoint | Role Testing | Expected HTTP Status | Actual Result |
|---|---|---|---|---|---|
| 4.1 | POST | /api/auth/login | SYSTEM_ADMIN | 200 OK | |
| 4.2 | POST | /api/auth/login | TRAVEL_MANAGER | 200 OK | |
| 4.3 | POST | /api/auth/login | RESOURCE_MANAGEMENT | 200 OK | |
| 4.4 | POST | /api/auth/login | WORKER | 200 OK | |
| 4.5 | POST | /api/auth/login | VISITOR | 200 OK | |
| 4.6 | GET | /api/transfer-history | SYSTEM_ADMIN | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMDM1MzdhY2YtZjMxYy00ZWYyLTliZWQtOGI1MWM3ZjMyMGFkIiwiaWF0IjoxNzc1NDIwMDE1LCJleHAiOjE3NzU0MjEyMTV9.NDy8HiMyPEtW7JDiFwqJi5EOl9-QwBoaSmzNa7AflWI
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:13:35 GMT
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
| 4.7 | GET | /api/transfer-history | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6Ijc5YTdmY2VjLTQ3OWQtNDJiMy04MzMwLWZkZmFjMGFhYjg3MyIsImlhdCI6MTc3NTQyMDAyMiwiZXhwIjoxNzc1NDIxMjIyfQ.jDvoOCAWdn5eezWNLqpd_qya_0HJ7WSKaPAxPuwS0ls
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:13:42 GMT
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
| 4.8 | GET | /api/transfer-history | TRAVEL_MANAGER | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI5OTY4ZWEzYS0zNGFiLTQ1MWMtODdkYy0wZmY4ZmRmNzRjZjUiLCJpYXQiOjE3NzU0MjAwMjgsImV4cCI6MTc3NTQyMTIyOH0.Hf3GTXaQqPS-rgT8oke-rJ52CbL_yTiwOwvXH0HQ_nY
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:13:48 GMT
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
| 4.9 | GET | /api/transfer-history | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiM2EwNzI0MDAtZGZhYS00NjI4LWE5MTktMjcwNjNjMzU3YzVjIiwiaWF0IjoxNzc1NDIwMDM3LCJleHAiOjE3NzU0MjEyMzd9._J7cT7rhtkyHM7kwycKGxTdDwDU77SY184kcRYlzzN0
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:13:57 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 4.10 | GET | /api/transfer-history | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZDQ0Yzk5N2ItZDVlOS00ODVkLThjNWEtYmRiNzZiOWNjYTYyIiwiaWF0IjoxNzc1NDIwMDQzLCJleHAiOjE3NzU0MjEyNDN9.ROF1Y9-TWuPLm-dcPuzHsXZ9PaTq3zO2TPY8kCzdMus
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:14:03 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 4.11 | POST | /api/transfer-history | RESOURCE_MANAGEMENT | 201 Created / 200 OK |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjA2ZDJmMzhlLTBjZWMtNDk3OS1hM2ZjLTlmZDQxNmU5NDFhZCIsImlhdCI6MTc3NTQyMDA0OCwiZXhwIjoxNzc1NDIxMjQ4fQ.R03v-P9-013XMl14DAdlaBsMtg4EFwmkIGGUGg8srI4
Content-Type: application/json; charset=utf-8
Content-Length: 71
ETag: W/"47-C63h4X3JwF6fA/8Po7naB2rYraA"
Date: Sun, 05 Apr 2026 20:14:08 GMT
Connection: close

{
  "message": "Transfer not found",
  "error": "Bad Request",
  "statusCode": 400
}
 |
| 4.12 | POST | /api/transfer-history | TRAVEL_MANAGER | 201 Created / 200 OK |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJiOTdkMzRiNi0yY2ZlLTQxN2YtOGY0OC03ZGFhZjMxNTI3NmYiLCJpYXQiOjE3NzU0MjAwNTUsImV4cCI6MTc3NTQyMTI1NX0.8QLT7WJrko-liIQauGoys1WYhXYJcKLl0CXIKUWZK1k
Content-Type: application/json; charset=utf-8
Content-Length: 71
ETag: W/"47-C63h4X3JwF6fA/8Po7naB2rYraA"
Date: Sun, 05 Apr 2026 20:14:15 GMT
Connection: close

{
  "message": "Transfer not found",
  "error": "Bad Request",
  "statusCode": 400
}
 |
| 4.13 | POST | /api/transfer-history | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiYjg4NzMyYzMtMTcyOS00NmQ4LWE2ZWYtMzhlODEyMWE2MzY4IiwiaWF0IjoxNzc1NDIwMDYxLCJleHAiOjE3NzU0MjEyNjF9.h-_U41KR0uuiOVtjNZByGLKAYTAJn_MlmttVZ0egBd4
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:14:21 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 4.14 | POST | /api/transfer-history | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZWM2ZTk2ODMtNjQ5Ni00YWNhLTlhMGUtYjdlOGE0ZjFlOTY1IiwiaWF0IjoxNzc1NDIwMDY4LCJleHAiOjE3NzU0MjEyNjh9.uEGevUrsQe0M3KKEPkk7rgKUj0dYvbDzBws8saavb4Y
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:14:28 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 4.15 | POST | /api/transfer-history | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMGQxZWJjNGMtOGYzYi00ZTA2LTg4M2QtOWE4ZTIyNjM1MDBmIiwiaWF0IjoxNzc1NDIwMDc1LCJleHAiOjE3NzU0MjEyNzV9._fToj2lSzRzdFbOtYRGfGnSaejyTLIFi0N0kFE0QE9A
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:14:35 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 4.16 | PUT | /api/transfer-history/1 | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjI5NjBhMjY1LTdhZDYtNGI2My1hMThmLTBlMDM0M2E2MGE2NCIsImlhdCI6MTc3NTQyMDA4MywiZXhwIjoxNzc1NDIxMjgzfQ.Ql6BEuG9Pb06EaSKJIwYYfib2ZTX_RkN-sVk_osEu30
Content-Type: application/json; charset=utf-8
Content-Length: 85
ETag: W/"55-gj5YL8abhzmkKD01VPZFXL6kVfo"
Date: Sun, 05 Apr 2026 20:14:43 GMT
Connection: close

{
  "message": "Transfer history entry not found",
  "error": "Bad Request",
  "statusCode": 400
}
 |
| 4.17 | PUT | /api/transfer-history/1 | TRAVEL_MANAGER | 200 OK |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI0MzQxMDAyMi03MDBmLTQwMmMtOTYxNC05N2Q3ODdhMTk0OTgiLCJpYXQiOjE3NzU0MjAwOTIsImV4cCI6MTc3NTQyMTI5Mn0.GSVMOD7lPaQhYcwi19PAVP9WUSYKTgk2VmlpYQdjeOg
Content-Type: application/json; charset=utf-8
Content-Length: 85
ETag: W/"55-gj5YL8abhzmkKD01VPZFXL6kVfo"
Date: Sun, 05 Apr 2026 20:14:52 GMT
Connection: close

{
  "message": "Transfer history entry not found",
  "error": "Bad Request",
  "statusCode": 400
}
 |
| 4.18 | PUT | /api/transfer-history/1 | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNzBlZTBhYmMtNjFhYS00ZGIwLWIzYzItMzdjYjM2OWY1YTU4IiwiaWF0IjoxNzc1NDIwMDk4LCJleHAiOjE3NzU0MjEyOTh9.dm-Mj4dSvxZxlVcglY4HKE8V9ffanImhnf4zCMWdV9s
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:14:58 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 4.19 | PUT | /api/transfer-history/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiYmRjMGUzYmQtZmM5Mi00YWFlLTg5MDYtOWY2MTY4MGY0ODY5IiwiaWF0IjoxNzc1NDIwMTEwLCJleHAiOjE3NzU0MjEzMTB9.BjmgJ6JBfkFu8CcrE60k3v6ajZFv_J5ZxMT_sXn7Vyk
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:15:10 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 4.20 | PUT | /api/transfer-history/1 | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZWVhODA0N2UtZjcwNi00YzAzLWFlYTgtOTdhN2Y1MjFlMmRiIiwiaWF0IjoxNzc1NDIwMTE1LCJleHAiOjE3NzU0MjEzMTV9.U1_VwVT3U-LEcCZzNRAcUuWDFy5glEhZ4u8UBef8d-A
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:15:15 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 4.21 | DELETE | /api/transfer-history/1 | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNzU4YTA1NzktMGU0My00NWI4LTgwYTctNmFmNmFkZDJhYjI2IiwiaWF0IjoxNzc1NDIwMTIyLCJleHAiOjE3NzU0MjEzMjJ9.1EXy7NtTiwQ5Y8cA7WGR5eoK1UKXV73Em5I4ivK7f-U
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:15:22 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 4.22 | DELETE | /api/transfer-history/1 | RESOURCE_MANAGEMENT | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjkyNGZiZjJkLTA5MzktNDNmMC1hZGNhLWJhZWYyYTEwN2U0MiIsImlhdCI6MTc3NTQyMDEyOSwiZXhwIjoxNzc1NDIxMzI5fQ.5g4tqPZfuSkrBrJQ9SMWMr_hIAP-oaeUxUc8S1HU-ck
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:15:29 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 4.23 | DELETE | /api/transfer-history/1 | TRAVEL_MANAGER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI2ZWQzOTdmNS0yMDM3LTRkNjQtOGE3Ny1hYzQ2ZTEwNDhjYjAiLCJpYXQiOjE3NzU0MjAxMzYsImV4cCI6MTc3NTQyMTMzNn0.Ihdm0dXFVxUaf2JSWdXz1ae-vQYyaVjedxoy7d9isjc
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:15:36 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 4.24 | DELETE | /api/transfer-history/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNzljYzA1ZjYtODgwOC00ZjFiLThmMGYtNzk3ODZhODVhMmY5IiwiaWF0IjoxNzc1NDIwMTQzLCJleHAiOjE3NzU0MjEzNDN9.G6jwGCpBFFFmzZovrppvc9zpls0CXrCxMl1NdjUKrUk
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:15:43 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 4.25 | DELETE | /api/transfer-history/1 | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiOWM2NWZiNDgtNzQzZC00NWJlLWJmODYtZGQxOTg0MmZjODk3IiwiaWF0IjoxNzc1NDIwMTUxLCJleHAiOjE3NzU0MjEzNTF9.6AeRKLCznH89NhQyjIE3ElejdVvbbfCMlqPnZDtqzNU
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:15:51 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |

## 5. Transfer Person
| # | Method | Endpoint | Role Testing | Expected HTTP Status | Actual Result |
|---|---|---|---|---|---|
| 5.1 | POST | /api/auth/login | SYSTEM_ADMIN | 200 OK | |
| 5.2 | POST | /api/auth/login | TRAVEL_MANAGER | 200 OK | |
| 5.3 | POST | /api/auth/login | RESOURCE_MANAGEMENT | 200 OK | |
| 5.4 | POST | /api/auth/login | WORKER | 200 OK | |
| 5.5 | POST | /api/auth/login | VISITOR | 200 OK | |
| 5.6 | GET | /api/transfer-persons | SYSTEM_ADMIN | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNDY2OGRkMmEtYWZhMi00M2FjLWExOGMtYmZjY2U5YjVjOTlhIiwiaWF0IjoxNzc1NDIwMTc4LCJleHAiOjE3NzU0MjEzNzh9.gk5yii1_K7UZvlXgdDdMDDCvBgHATA9J2m6W4XlvxeE
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:16:18 GMT
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
| 5.7 | GET | /api/transfer-persons | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjBjMmI0MWQzLWU3NWUtNGUyNC1iYjExLWRkMmIyN2ZiYmI5YSIsImlhdCI6MTc3NTQyMDE4NywiZXhwIjoxNzc1NDIxMzg3fQ.t_50QLTjR3qNQLN0aQz6ZCQrMaYMYrd3cm6ATlJklQA
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:16:27 GMT
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
| 5.8 | GET | /api/transfer-persons | TRAVEL_MANAGER | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiIwZTFlNjU5Zi01MzA2LTQyMmQtYjU0OC0wZWY2YTFmMTdhNWUiLCJpYXQiOjE3NzU0MjAxOTMsImV4cCI6MTc3NTQyMTM5M30.7fLZijGbso7PZ6hfT4fu4eyllpgNv9sTZUUoPI5Aaxs
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sun, 05 Apr 2026 20:16:33 GMT
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
| 5.9 | GET | /api/transfer-persons | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNWQ0ZDkxZjMtNmU5Yy00YTg3LWI5NzItNDdlZTc3ODA5MDg4IiwiaWF0IjoxNzc1NDIwMTk4LCJleHAiOjE3NzU0MjEzOTh9.e9cNJipJfYyVkk0KxL4qLyRXoHZ85ratdfoGhrF2OQ4
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:16:38 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 5.10 | GET | /api/transfer-persons | VISITOR | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNGM5YTNmN2UtNTgwYS00YmEyLWFiMzMtN2EwOGYzZWRlMDhhIiwiaWF0IjoxNzc1NDIwMjA0LCJleHAiOjE3NzU0MjE0MDR9.okMusPRTdNs5I1PnmdbB8BX2XEXyNsBb3CSFoh_GpH0
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:16:44 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
|
| 5.11 | POST | /api/transfer-persons | RESOURCE_MANAGEMENT | 201 Created / 200 OK |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjRmZjhmZGQwLWM3YzUtNDU4MC04YjUzLWY2NGM4YzAzZDhiYiIsImlhdCI6MTc3NTQyMDIxMCwiZXhwIjoxNzc1NDIxNDEwfQ.5DP5IVw8Ygq-3AUx3LhplJeRbvnIWLbm9qezfEbErgc
Content-Type: application/json; charset=utf-8
Content-Length: 71
ETag: W/"47-C63h4X3JwF6fA/8Po7naB2rYraA"
Date: Sun, 05 Apr 2026 20:16:50 GMT
Connection: close

{
  "message": "Transfer not found",
  "error": "Bad Request",
  "statusCode": 400
}
 |
| 5.12 | POST | /api/transfer-persons | TRAVEL_MANAGER | 201 Created / 200 OK | HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI5ZjllYjkyYS05YzJjLTQ0ZjMtYjRlNi1mZjY4Y2FmMGUzNDgiLCJpYXQiOjE3NzU0MjAyMTcsImV4cCI6MTc3NTQyMTQxN30.j-LdHwC5ZxltIi6TjpJCzn_v_19tYHY05zTo_6q8PBw
Content-Type: application/json; charset=utf-8
Content-Length: 71
ETag: W/"47-C63h4X3JwF6fA/8Po7naB2rYraA"
Date: Sun, 05 Apr 2026 20:16:57 GMT
Connection: close

{
  "message": "Transfer not found",
  "error": "Bad Request",
  "statusCode": 400
}
|
| 5.13 | POST | /api/transfer-persons | SYSTEM_ADMIN | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNmRhMDAzYTUtYjVhZC00NDM4LWJjNmYtYzYwZjA2ODE0OWQwIiwiaWF0IjoxNzc1NDIwMjI3LCJleHAiOjE3NzU0MjE0Mjd9.icaljTjOjT9gcQrm_TKRD0eJ07wZN0_AoIpx-s0vDn8
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:17:07 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
|
| 5.14 | POST | /api/transfer-persons | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiYTNhZDc1NjQtYWQ0Yi00NDQyLWJhY2YtZGQzMjRjNjBhNTBiIiwiaWF0IjoxNzc1NDIwMjMzLCJleHAiOjE3NzU0MjE0MzN9.YfkApz-KVhWk1gnnxb233Q_Teg7z7VVq7b1WcKenLM4
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:17:13 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 5.15 | POST | /api/transfer-persons | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNDBiNjAzMTMtZjMzOC00MWM3LTk1NWEtZmQxNTI1MzZhM2FmIiwiaWF0IjoxNzc1NDIwMjQ2LCJleHAiOjE3NzU0MjE0NDZ9.9l3_kxq2ZRWKR2t-dyHDdWNefzvk6FAzAxK_BWq3D-E
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:17:26 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 5.16 | PUT | /api/transfer-persons/1 | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjY5OGRjYTljLWUyZjQtNDY4Ni1iY2M4LWRjMDhlOWRiZGJhOSIsImlhdCI6MTc3NTQyMDI1NCwiZXhwIjoxNzc1NDIxNDU0fQ.iNWv9zMaHnhUk4A5lQ7x6UkMyyuARu0FOACJlRHMo-k
Content-Type: application/json; charset=utf-8
Content-Length: 78
ETag: W/"4e-+W5BvdfgJWpBS135qmDPDCh3Azc"
Date: Sun, 05 Apr 2026 20:17:34 GMT
Connection: close

{
  "message": "Transfer person not found",
  "error": "Bad Request",
  "statusCode": 400
}
 |
| 5.17 | PUT | /api/transfer-persons/1 | TRAVEL_MANAGER | 200 OK |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiIxOGVhMmZmNi1mYzUzLTQzM2MtYmQ3Yi0wZTFiYjc2ODc5OTMiLCJpYXQiOjE3NzU0MjAyNTksImV4cCI6MTc3NTQyMTQ1OX0.I8jPzbY-VBPjJx-msGw-D4WuWtIK8cisbYcTm5mqlWI
Content-Type: application/json; charset=utf-8
Content-Length: 78
ETag: W/"4e-+W5BvdfgJWpBS135qmDPDCh3Azc"
Date: Sun, 05 Apr 2026 20:17:39 GMT
Connection: close

{
  "message": "Transfer person not found",
  "error": "Bad Request",
  "statusCode": 400
}
 |
| 5.18 | PUT | /api/transfer-persons/1 | SYSTEM_ADMIN | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiZTk3ODU1NWUtOTZmNS00NmJjLWE2N2QtZjdkODM5YWZiZWFiIiwiaWF0IjoxNzc1NDIwMjY2LCJleHAiOjE3NzU0MjE0NjZ9.mbZORnLAOS64qDwBFCphuGb-RCohyfJcqZmfkWPsWpg
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:17:46 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
|
| 5.19 | PUT | /api/transfer-persons/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZTAwYTc1NGQtOTk3OS00MWNjLTgxYzYtMDM3NGMwNWM5MDBmIiwiaWF0IjoxNzc1NDIwMjc0LCJleHAiOjE3NzU0MjE0NzR9.29QV0gZtkbuousGHrbgxLeZC_msW0K0mwvLK5nXoInc
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:17:54 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 5.20 | PUT | /api/transfer-persons/1 | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMDNiMDE4NzYtNGI3Mi00NmRiLThkYjEtNjEzOTJkNGI5MGMyIiwiaWF0IjoxNzc1NDIwMjgwLCJleHAiOjE3NzU0MjE0ODB9.DhaLvrQMx3L1-PzdzffBShOm5YgpxcZHcylv_eSB0Mo
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:18:00 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 5.21 | DELETE | /api/transfer-persons/1 | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-B1Q3SBt1ZeaNvigPSVYs7wqtkGY"
Date: Sun, 05 Apr 2026 20:18:07 GMT
Connection: close

{
  "message": "Token inválido",
  "error": "Unauthorized",
  "statusCode": 401
}
 |
| 5.22 | DELETE | /api/transfer-persons/1 | RESOURCE_MANAGEMENT | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImM3YjFkNmVhLTgxM2UtNDM5Ny1hNjkwLWM3YzYyMjllMTBjMCIsImlhdCI6MTc3NTQyMDI5NSwiZXhwIjoxNzc1NDIxNDk1fQ.X5o1L-LuDOuhtV7a57gec9irEiq8_1kjFnv_XSk3M5E
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:18:15 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 5.23 | DELETE | /api/transfer-persons/1 | TRAVEL_MANAGER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI5ZjYzYjljYi03ZjE3LTRmYzEtYjEyMC00Y2VjMTQ5MTZhYzAiLCJpYXQiOjE3NzU0MjAzMDIsImV4cCI6MTc3NTQyMTUwMn0.Mih1W9neFNJKU2KHi5sySYaVcEh83Nti3MTMpg0Usk4
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:18:22 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 5.24 | DELETE | /api/transfer-persons/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNDdlNGI3NjgtMGEyNC00NTAyLThkYzMtYjI5NzQ1NTlhOWNmIiwiaWF0IjoxNzc1NDIwMzA3LCJleHAiOjE3NzU0MjE1MDd9.vohijpmrtxFxG__VwFzhwoAz0QVV75IkesJEG1KXt6Y
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:18:27 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
| 5.25 | DELETE | /api/transfer-persons/1 | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiOWJmMzU0NWQtMzA4My00MjllLTk0YWUtYjNlMzQ5ZmRhODExIiwiaWF0IjoxNzc1NDIwMzE0LCJleHAiOjE3NzU0MjE1MTR9.Sw_Pcaf1lUmIq9moCDDp0K9RsQF6bUUKyOMWpvxABj4
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 20:18:34 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
 |
