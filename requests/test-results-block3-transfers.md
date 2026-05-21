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
| 1.5 | POST | /api/auth/login | WORKER | 200 OK |HTTP/1.1 201 Created
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
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNjE0YWEwNTEtZDM5ZC00Y2VkLWJlMjItZDFlNTJiMmRjZjdmIiwiaWF0IjoxNzc1NDI0NDg3LCJleHAiOjE3NzU0MjU2ODd9.7zLxdGBsJ49eFlg3UDoMdh8_kzGEJuMUsNuOakXj0-c
Content-Type: application/json; charset=utf-8
Content-Length: 222
ETag: W/"de-ohEtbsbjbD94/OK6eFppaYHO2oI"
Date: Sun, 05 Apr 2026 21:28:07 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 3,
    "originCampId": 1,
    "destinationCampId": 2,
    "status": "PENDING",
    "description": "rbac-resource-request",
    "createdDate": "2026-04-05T12:00:00.000Z",
    "responseDate": null,
    "createdBy": 3,
    "respondedBy": null
  }
}

 |
| 1.7 | GET | /api/intercamp-requests | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjcyN2M1ZmM0LThmNTctNDk2Mi1iYzRmLTVjYjRlZDUzOWJmMSIsImlhdCI6MTc3NTQyNDQ5OCwiZXhwIjoxNzc1NDI1Njk4fQ.4FHuTNzCBFlx53HEg0EirNHYY1RWXHdtFml_TVymwq4
Content-Type: application/json; charset=utf-8
Content-Length: 220
ETag: W/"dc-QUUYUq8pidlb+3cpGEu+JKZi8q4"
Date: Sun, 05 Apr 2026 21:28:18 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 4,
    "originCampId": 1,
    "destinationCampId": 3,
    "status": "PENDING",
    "description": "rbac-travel-request",
    "createdDate": "2026-04-05T12:10:00.000Z",
    "responseDate": null,
    "createdBy": 4,
    "respondedBy": null
  }
}

 |
| 1.8 | GET | /api/intercamp-requests | TRAVEL_MANAGER | 200 OK |HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-B1Q3SBt1ZeaNvigPSVYs7wqtkGY"
Date: Sun, 05 Apr 2026 21:28:31 GMT
Connection: close

{
  "message": "Token inválido",
  "error": "Unauthorized",
  "statusCode": 401
}

 |
| 1.9 | GET | /api/intercamp-requests | WORKER | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNjU2N2IzNjYtMTQxYy00MDAwLWIzYjQtYzVlMDM5OWUxZDg3IiwiaWF0IjoxNzc1NDI0NTIzLCJleHAiOjE3NzU0MjU3MjN9.6P-SZmivTFvlWhY8hwxX2_O_n6FCDwT8Yjl1zYHOtQ8
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 21:28:43 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}

|
| 1.10 | GET | /api/intercamp-requests | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImNhbXBJZCI6MSwicm9sIjoiVklTSVRPUiIsImp0aSI6IjQ1MTcyNjgxLTBlNTUtNGU3Mi1iNWRmLTAyN2M2ODg5M2YwMyIsImlhdCI6MTc3NTQyNDUzNywiZXhwIjoxNzc1NDI1NzM3fQ.YR2EN15bFuTnn6nQbT6DyXfD6oxmglmMangNwzDeCGU
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 21:28:57 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}

 |
| 1.11 | POST | /api/intercamp-requests | RESOURCE_MANAGEMENT | 201 Created / 200 OK |HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjMwMzhhZjlmLTkzZmEtNDIzMC1hOTYyLWQyYTg3ZmYzNTQxNSIsImlhdCI6MTc3NTQyMjc0OCwiZXhwIjoxNzc1NDIzOTQ4fQ.p8s66rrdPwefIYlvmSLFotX0BLC2zgRmvdIT3Cm9asA
Content-Type: application/json; charset=utf-8
Content-Length: 273
ETag: W/"111-UWJFRZLaGcqybgdrjn3mtm0rZPI"
Date: Sun, 05 Apr 2026 20:59:08 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 3,
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
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiIwMDQ5NjE0NC1mZGE5LTRhMmMtODEwZS05ZDVhOGNjODVhYmYiLCJpYXQiOjE3NzU0MjI3ODEsImV4cCI6MTc3NTQyMzk4MX0.UC65yfNuNYcNwnGEZEoNgY7ew97-5W1_c0SxIJ0BoSo
Content-Type: application/json; charset=utf-8
Content-Length: 271
ETag: W/"10f-hE9O0iK9aYNHhFaDalgdSNhHUpo"
Date: Sun, 05 Apr 2026 20:59:41 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 4,
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
| 1.15 | POST | /api/intercamp-requests | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
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
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjBjZTM1ZjUxLWRjZDUtNDM0Ny1iNjYzLWQ2ODllMmExY2Y4YyIsImlhdCI6MTc3NTQyNDU1NiwiZXhwIjoxNzc1NDI1NzU2fQ.G9ld5-BNAS89DdSOr58oF1VnMjXqygGlYXAenBfskuY
Content-Type: application/json; charset=utf-8
Content-Length: 274
ETag: W/"112-4/s1/37cqw7LNwUUMaxwDCWlkVA"
Date: Sun, 05 Apr 2026 21:29:16 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 3,
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
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJjMzM3NmZlMy05MzJjLTRjZGYtYjMwYS0zZjg5ZGUzMThkMmIiLCJpYXQiOjE3NzU0MjQ2NjksImV4cCI6MTc3NTQyNTg2OX0.AfIg9656I7eL80nDYgRXIpebkazwUsJn8cf7RJJuPqg
Content-Type: application/json; charset=utf-8
Content-Length: 272
ETag: W/"110-yfrur7+1uf4+bc/VOLkbGSyq4Bk"
Date: Sun, 05 Apr 2026 21:31:09 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 4,
    "originCampId": 1,
    "destinationCampId": 3,
    "status": "REJECTED",
    "description": "rbac-travel-request",
    "createdDate": "2026-04-05T12:10:00.000Z",
    "responseDate": null,
    "createdBy": 4,
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
| 1.20 | PUT | /api/intercamp-requests/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
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
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiN2M2MDg4MGQtMDA2OC00ZGFiLWE3NTktMGM4OTdiNTgzYzZiIiwiaWF0IjoxNzc1NDI0Njg2LCJleHAiOjE3NzU0MjU4ODZ9.LZr0amFZrTYeDdHUAPgMUsVOcP7AkoXIwu-Si8LULqE
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 21:31:26 GMT
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
| 1.25 | DELETE | /api/intercamp-requests/1 | WORKER | 403 Forbidden | HTTP/1.1 403 Forbidden
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
| 2.5 | POST | /api/auth/login | WORKER | 200 OK | |
| 2.6 | GET | /api/transfers | SYSTEM_ADMIN | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiZDkwYmUzMTUtM2YzOC00NTkxLWI4OWMtMmIyZjliMDk0ZThiIiwiaWF0IjoxNzc1NDI0NzUxLCJleHAiOjE3NzU0MjU5NTF9.ekWd99BScOkpyfmPMFInXbFtChaPYNH9DiyybWKQUUA
Content-Type: application/json; charset=utf-8
Content-Length: 427
ETag: W/"1ab-myGnFHYvwP4n5vMZMxQ1Q+DSBv4"
Date: Sun, 05 Apr 2026 21:32:31 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 5,
    "requestId": 3,
    "plannedDepartureDate": "2026-04-06T08:00:00.000Z",
    "actualDepartureDate": null,
    "plannedArrivalDate": "2026-04-07T08:00:00.000Z",
    "actualArrivalDate": null,
    "status": "PENDING_DEPARTURE",
    "departureApprovedBy": null,
    "arrivalApprovedBy": null,
    "rationsForTrip": "1000.00",
    "receptionNotes": "resource-created-transfer",
    "createdAt": "2026-04-05T21:08:18.211Z",
    "updatedAt": "2026-04-05T21:08:18.211Z"
  }
}

 |
| 2.7 | GET | /api/transfers | RESOURCE_MANAGEMENT | 200 OK | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjEzYWM2MzcyLTEyNzYtNGI2NS04NDU5LTU5Mjc4YmIyOTFhYyIsImlhdCI6MTc3NTQyNDc2MywiZXhwIjoxNzc1NDI1OTYzfQ.RGgXRO6V5stg6YIovEVKQq4TrLyfF8kxkRRNpmGVUZw
Content-Type: application/json; charset=utf-8
Content-Length: 424
ETag: W/"1a8-fZojxTMbVQujoG7K3Dxb7s0Gcco"
Date: Sun, 05 Apr 2026 21:32:43 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 6,
    "requestId": 4,
    "plannedDepartureDate": "2026-04-08T08:00:00.000Z",
    "actualDepartureDate": null,
    "plannedArrivalDate": "2026-04-09T08:00:00.000Z",
    "actualArrivalDate": null,
    "status": "PENDING_DEPARTURE",
    "departureApprovedBy": null,
    "arrivalApprovedBy": null,
    "rationsForTrip": "900.00",
    "receptionNotes": "travel-created-transfer",
    "createdAt": "2026-04-05T21:08:33.653Z",
    "updatedAt": "2026-04-05T21:08:33.653Z"
  }
}

|
| 2.8 | GET | /api/transfers | TRAVEL_MANAGER | 200 OK | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI0NDMzMDViMC1mMzgwLTRhZGYtOTYzMC1kYzA3NmJmYThjY2EiLCJpYXQiOjE3NzU0MjQ3NzUsImV4cCI6MTc3NTQyNTk3NX0.QLBB5wnwW-oyMgi7IAX30SKqTxr5k32iAzqRsUsjjUU
Content-Type: application/json; charset=utf-8
Content-Length: 427
ETag: W/"1ab-myGnFHYvwP4n5vMZMxQ1Q+DSBv4"
Date: Sun, 05 Apr 2026 21:32:55 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 5,
    "requestId": 3,
    "plannedDepartureDate": "2026-04-06T08:00:00.000Z",
    "actualDepartureDate": null,
    "plannedArrivalDate": "2026-04-07T08:00:00.000Z",
    "actualArrivalDate": null,
    "status": "PENDING_DEPARTURE",
    "departureApprovedBy": null,
    "arrivalApprovedBy": null,
    "rationsForTrip": "1000.00",
    "receptionNotes": "resource-created-transfer",
    "createdAt": "2026-04-05T21:08:18.211Z",
    "updatedAt": "2026-04-05T21:08:18.211Z"
  }
}

|
| 2.9 | GET | /api/transfers | WORKER | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNTgzYmFiZjItYjk5OS00YTY5LTliMTMtODgzOTdmMThkMTgzIiwiaWF0IjoxNzc1NDI0NzkxLCJleHAiOjE3NzU0MjU5OTF9.cfCS6Dm_yZ8TUVncjenWiWMyn6GO6uMkclRtJZOOv-g
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 21:33:11 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}

|
| 2.10 | GET | /api/transfers | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImNhbXBJZCI6MSwicm9sIjoiVklTSVRPUiIsImp0aSI6IjBhODliMzI2LWVhMmItNDExYS1hYjQyLTA0MTFmMzYzNGI3NSIsImlhdCI6MTc3NTQyNDgwMiwiZXhwIjoxNzc1NDI2MDAyfQ.hzDZJPzG6mhY1umtPd17d3aJna1xdTGy3rn49ZbxAfY
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 21:33:22 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}

 |
| 2.11 | POST | /api/transfers | RESOURCE_MANAGEMENT | 201 Created / 200 OK |HTTP/1.1 201 CreatedX-Powered-By: ExpressAuthorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjQ4ZWZlZDRkLTU4YjUtNGUwNC1hNmUzLTkzOWU3YmI4ZDZjMiIsImlhdCI6MTc3NTQyMzI5OCwiZXhwIjoxNzc1NDI0NDk4fQ.f0l2W-pvdB7RPJwpks8VtleyIG5vPleAT5sbo__P4x0Content-Type: application/json; charset=utf-8Content-Length: 461ETag: W/"1cd-T8TNg5Swm0Qbr39Qqx8wf16ozb0"Date: Sun, 05 Apr 2026 21:08:18 GMTConnection: close{  "success": true,  "data": {    "id": 5,    "requestId": 3,    "plannedDepartureDate": "2026-04-06T08:00:00Z",    "actualDepartureDate": null,    "plannedArrivalDate": "2026-04-07T08:00:00Z",    "actualArrivalDate": null,    "status": "PENDING_DEPARTURE",    "departureApprovedBy": null,    "arrivalApprovedBy": null,    "rationsForTrip": "1000.00",    "receptionNotes": "resource-created-transfer",    "createdAt": "2026-04-05T21:08:18.211Z",    "updatedAt": "2026-04-05T21:08:18.211Z"  },  "message": "Transfer created successfully"}
 |
| 2.12 | POST | /api/transfers | TRAVEL_MANAGER | 201 Created / 200 OK |HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiIyMWRjZGI4My1kMTFlLTQyZjQtOTM2Zi1jNjkyZmM4NTMyYzIiLCJpYXQiOjE3NzU0MjMzMTMsImV4cCI6MTc3NTQyNDUxM30.CcwCJAavLgApY3cBRrNybK41U_FPXIiW7rBxGbI4-Bw
Content-Type: application/json; charset=utf-8
Content-Length: 458
ETag: W/"1ca-ecl4jdH51SKDWa1lKUWktVXcNnw"
Date: Sun, 05 Apr 2026 21:08:33 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 6,
    "requestId": 4,
    "plannedDepartureDate": "2026-04-08T08:00:00Z",
    "actualDepartureDate": null,
    "plannedArrivalDate": "2026-04-09T08:00:00Z",
    "actualArrivalDate": null,
    "status": "PENDING_DEPARTURE",
    "departureApprovedBy": null,
    "arrivalApprovedBy": null,
    "rationsForTrip": "900.00",
    "receptionNotes": "travel-created-transfer",
    "createdAt": "2026-04-05T21:08:33.653Z",
    "updatedAt": "2026-04-05T21:08:33.653Z"
  },
  "message": "Transfer created successfully"
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
| 2.15 | POST | /api/transfers | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
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
| 2.16 | PUT | /api/transfers/1 | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImM5YWRlM2QwLTQxZmEtNDViZC05MmVkLWY4ZDQwNDBjZDRkNCIsImlhdCI6MTc3NTQyNDgxNywiZXhwIjoxNzc1NDI2MDE3fQ.7wsZdQa_31zBmRy4i-_I5td85BZ3rYjVJcv6-qZa3zs
Content-Type: application/json; charset=utf-8
Content-Length: 461
ETag: W/"1cd-4BB+qCC7zTvhtosnAzAJs45/ED8"
Date: Sun, 05 Apr 2026 21:33:37 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 5,
    "requestId": 3,
    "plannedDepartureDate": "2026-04-06T08:00:00.000Z",
    "actualDepartureDate": null,
    "plannedArrivalDate": "2026-04-07T08:00:00.000Z",
    "actualArrivalDate": null,
    "status": "COMPLETED",
    "departureApprovedBy": null,
    "arrivalApprovedBy": null,
    "rationsForTrip": "1000.00",
    "receptionNotes": "resource-created-transfer",
    "createdAt": "2026-04-05T21:08:18.211Z",
    "updatedAt": "2026-04-05T21:33:36.833Z"
  },
  "message": "Transfer updated successfully"
}

 |
| 2.17 | PUT | /api/transfers/1 | TRAVEL_MANAGER | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI0OTFkN2UxMS01ZWQxLTRlYmYtYmI5ZS00NjgzOGE5YmE5YjkiLCJpYXQiOjE3NzU0MjQ4MzEsImV4cCI6MTc3NTQyNjAzMX0.yPvTwJV8lUYm11r6NzXUueIiupMHBDFWbFsMYxobH1E
Content-Type: application/json; charset=utf-8
Content-Length: 457
ETag: W/"1c9-mS7NQSTrxAVT7/brSWNeenUOGOg"
Date: Sun, 05 Apr 2026 21:33:51 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 6,
    "requestId": 4,
    "plannedDepartureDate": "2026-04-08T08:00:00.000Z",
    "actualDepartureDate": null,
    "plannedArrivalDate": "2026-04-09T08:00:00.000Z",
    "actualArrivalDate": null,
    "status": "CANCELED",
    "departureApprovedBy": null,
    "arrivalApprovedBy": null,
    "rationsForTrip": "900.00",
    "receptionNotes": "travel-created-transfer",
    "createdAt": "2026-04-05T21:08:33.653Z",
    "updatedAt": "2026-04-05T21:33:51.556Z"
  },
  "message": "Transfer updated successfully"
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
| 2.20 | PUT | /api/transfers/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
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
| 2.21 | DELETE | /api/transfers/1 | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMDg4ZWE1MzUtYzNhOC00OGU1LTkxMWYtYTg3NDRmNGExMDU1IiwiaWF0IjoxNzc1NDI0ODQ3LCJleHAiOjE3NzU0MjYwNDd9.Jt1BC2oUKSh_paQfnMd9K2aDVCdAVYljQ3WufoHR0Bg
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 21:34:07 GMT
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
| 2.25 | DELETE | /api/transfers/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
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
| 3.5 | POST | /api/auth/login | WORKER | 200 OK | |
| 3.6 | GET | /api/delivered-transfer-resources | SYSTEM_ADMIN | 200 OK | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiM2VhYzNiZjktYWQ0MS00ZjFjLWE0MTUtZjA2NGU4ZTIyNmZiIiwiaWF0IjoxNzc1NDI0OTMyLCJleHAiOjE3NzU0MjYxMzJ9.AjCrjyv6kigEChruBPikulomUS4l0zuDR7iXGOYo4Tk
Content-Type: application/json; charset=utf-8
Content-Length: 188
ETag: W/"bc-yDTYP8ySjAQWQYtOzOBBivR4tGM"
Date: Sun, 05 Apr 2026 21:35:32 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "transferId": 5,
    "resourceTypeId": 1,
    "sentAmount": "1000.00",
    "receivedAmount": "980.00",
    "recordedBy": 3,
    "recordDate": "2026-04-05T13:00:00.000Z",
    "movementId": null
  }
}

|
| 3.7 | GET | /api/delivered-transfer-resources | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImU1YWFkZTJhLTI5M2QtNDY2OS05MzZkLWQzNjA4OWYwMDFhZCIsImlhdCI6MTc3NTQyNDk0MywiZXhwIjoxNzc1NDI2MTQzfQ.MgKxsb2GL5ToGtBRgEcCSafwK9ceoZFwz_QzfN5u1Es
Content-Type: application/json; charset=utf-8
Content-Length: 187
ETag: W/"bb-+I/LrYi6KnMsHtLDDSE0TfRHxu8"
Date: Sun, 05 Apr 2026 21:35:43 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 2,
    "transferId": 6,
    "resourceTypeId": 1,
    "sentAmount": "900.00",
    "receivedAmount": "890.00",
    "recordedBy": 4,
    "recordDate": "2026-04-05T13:10:00.000Z",
    "movementId": null
  }
}

 |
| 3.8 | GET | /api/delivered-transfer-resources | TRAVEL_MANAGER | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI1ZmQxY2Y3MS1mMTY3LTQyM2QtOGVmOS0yZjI4ZjExZTQyZDEiLCJpYXQiOjE3NzU0MjQ5NTgsImV4cCI6MTc3NTQyNjE1OH0.gl6FMgA-ILVIF8nJ83SXABtgaN2wer1_NR4mtexIMkk
Content-Type: application/json; charset=utf-8
Content-Length: 188
ETag: W/"bc-yDTYP8ySjAQWQYtOzOBBivR4tGM"
Date: Sun, 05 Apr 2026 21:35:58 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "transferId": 5,
    "resourceTypeId": 1,
    "sentAmount": "1000.00",
    "receivedAmount": "980.00",
    "recordedBy": 3,
    "recordDate": "2026-04-05T13:00:00.000Z",
    "movementId": null
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
| 3.10 | GET | /api/delivered-transfer-resources | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
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
| 3.11 | POST | /api/delivered-transfer-resources | RESOURCE_MANAGEMENT | 201 Created / 200 OK | HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6Ijg0ZDBkNmJmLTI1YjMtNDljMS04OGZiLWI0YzUzNzk2YWY3MiIsImlhdCI6MTc3NTQyMzYwMSwiZXhwIjoxNzc1NDI0ODAxfQ.Cb_PEc5iu02FF-UIDtuAfKkigklAU_SZPx_N7KtngBA
Content-Type: application/json; charset=utf-8
Content-Length: 243
ETag: W/"f3-rOhBMvn49G9f+CBKpVzI6D7AAHU"
Date: Sun, 05 Apr 2026 21:13:22 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "transferId": 5,
    "resourceTypeId": 1,
    "sentAmount": "1000",
    "receivedAmount": "980",
    "recordedBy": 3,
    "recordDate": "2026-04-05T13:00:00.000Z",
    "movementId": null
  },
  "message": "Delivered transfer resource created successfully"
}

|
| 3.12 | POST | /api/delivered-transfer-resources | TRAVEL_MANAGER | 201 Created / 200 OK | HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiIxNzc1YWIzNy01ZTVkLTRmYTktYTk2MC1iOTYxY2RhMzlmNjAiLCJpYXQiOjE3NzU0MjM2MjIsImV4cCI6MTc3NTQyNDgyMn0.J0TrZNhLSN02d9aoihlFohJnoMcC75rPfUijGv0Tyn4
Content-Type: application/json; charset=utf-8
Content-Length: 242
ETag: W/"f2-ojN7MEcWnqZ4fgwqgEYLyAOtqn0"
Date: Sun, 05 Apr 2026 21:13:42 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 2,
    "transferId": 6,
    "resourceTypeId": 1,
    "sentAmount": "900",
    "receivedAmount": "890",
    "recordedBy": 4,
    "recordDate": "2026-04-05T13:10:00.000Z",
    "movementId": null
  },
  "message": "Delivered transfer resource created successfully"
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
| 3.15 | POST | /api/delivered-transfer-resources | WORKER | 403 Forbidden | HTTP/1.1 403 Forbidden
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
| 3.16 | PUT | /api/delivered-transfer-resources/1 | RESOURCE_MANAGEMENT | 200 OK | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjA4ODFkMjIwLTYxMjUtNDEzMi1iMzZhLWZiZjA5OTY2MzZjYiIsImlhdCI6MTc3NTQyNDk3OSwiZXhwIjoxNzc1NDI2MTc5fQ.p_OIn2LIvBg60srH2kWEeELYpvBIs1n5_XOMx3uvDiU
Content-Type: application/json; charset=utf-8
Content-Length: 246
ETag: W/"f6-+2qANOr98Rc+6cJ3R9lIoJYZoKU"
Date: Sun, 05 Apr 2026 21:36:19 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "transferId": 5,
    "resourceTypeId": 1,
    "sentAmount": "1000.00",
    "receivedAmount": "995",
    "recordedBy": 3,
    "recordDate": "2026-04-05T13:00:00.000Z",
    "movementId": null
  },
  "message": "Delivered transfer resource updated successfully"
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
| 3.20 | PUT | /api/delivered-transfer-resources/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
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
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiYWY0MmJlYmEtOWU0ZS00MTdhLWFjZjItMzc0NDdkYTQ1YzEyIiwiaWF0IjoxNzc1NDI1MDAxLCJleHAiOjE3NzU0MjYyMDF9.qNMhuA7uVD79cnclJOrERzKAVzyaDFuEFiuGDzHOTO8
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 21:36:41 GMT
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
| 3.25 | DELETE | /api/delivered-transfer-resources/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
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
| 4.5 | POST | /api/auth/login | WORKER | 200 OK | |
| 4.6 | GET | /api/transfer-history | SYSTEM_ADMIN | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiY2JlMDQ4MTUtNmY3MS00OTYyLWJlMDAtODViNWExMmExODNjIiwiaWF0IjoxNzc1NDI1MDU1LCJleHAiOjE3NzU0MjYyNTV9.c1-_tqXyRePWIHT2n0obQI2bUxUdBTKFi44BQxA0ys0
Content-Type: application/json; charset=utf-8
Content-Length: 181
ETag: W/"b5-uUpkXRAUBhPtN/VBTNkC5VNlubg"
Date: Sun, 05 Apr 2026 21:37:35 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "transferId": 5,
    "previousStatus": "PENDING_DEPARTURE",
    "newStatus": "COMPLETED",
    "date": "2026-04-05T14:00:00.000Z",
    "userId": 3,
    "comment": "resource update"
  }
}

 |
| 4.7 | GET | /api/transfer-history | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjNjM2FhMWUxLWJiZTAtNDZjMC1iZjMwLTZjODRjZTY5YzRkMyIsImlhdCI6MTc3NTQyNTA2NywiZXhwIjoxNzc1NDI2MjY3fQ.JRLdr8HNWbfLRiHekg59GUi_GzNatcFRFuQz7IyXzNw
Content-Type: application/json; charset=utf-8
Content-Length: 179
ETag: W/"b3-QvRaW36ISMghrVSGGVbt3emqzVw"
Date: Sun, 05 Apr 2026 21:37:47 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 2,
    "transferId": 6,
    "previousStatus": "PENDING_DEPARTURE",
    "newStatus": "COMPLETED",
    "date": "2026-04-05T14:10:00.000Z",
    "userId": 4,
    "comment": "travel update"
  }
}

 |
| 4.8 | GET | /api/transfer-history | TRAVEL_MANAGER | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI0MzMwZTBmZC00NjBiLTQ1OGYtOTY2Ny1lZjkyZGRlMTM0OWMiLCJpYXQiOjE3NzU0MjUwNzcsImV4cCI6MTc3NTQyNjI3N30.Oko6ecfHPlb1Nt9vrD4Y-0sBM567HyQz6jzPxsdV1Ys
Content-Type: application/json; charset=utf-8
Content-Length: 181
ETag: W/"b5-uUpkXRAUBhPtN/VBTNkC5VNlubg"
Date: Sun, 05 Apr 2026 21:37:57 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "transferId": 5,
    "previousStatus": "PENDING_DEPARTURE",
    "newStatus": "COMPLETED",
    "date": "2026-04-05T14:00:00.000Z",
    "userId": 3,
    "comment": "resource update"
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
| 4.10 | GET | /api/transfer-history | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
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
| 4.11 | POST | /api/transfer-history | RESOURCE_MANAGEMENT | 201 Created / 200 OK |HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjlkMzE3NDk5LWMxNGQtNDAyZi1hZWRiLTYxNTUzOWJiZDdkNyIsImlhdCI6MTc3NTQyMzY5NCwiZXhwIjoxNzc1NDI0ODk0fQ.lOP2DsYJuv5qtf_7wTZmLR4z3zgTHjmAojpsenjqhQo
Content-Type: application/json; charset=utf-8
Content-Length: 237
ETag: W/"ed-1h/14DpJ6qrz8L4XRxMm2ktiEBQ"
Date: Sun, 05 Apr 2026 21:14:54 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "transferId": 5,
    "previousStatus": "PENDING_DEPARTURE",
    "newStatus": "COMPLETED",
    "date": "2026-04-05T14:00:00.000Z",
    "userId": 3,
    "comment": "resource update"
  },
  "message": "Transfer history entry created successfully"
}

 |
| 4.12 | POST | /api/transfer-history | TRAVEL_MANAGER | 201 Created / 200 OK |HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI3YmIxZWY0Yi0xNWU2LTRiOGEtYWY5Zi04MDQ4MTY1ZmNmYjkiLCJpYXQiOjE3NzU0MjM3MjAsImV4cCI6MTc3NTQyNDkyMH0.QREdwQVbgyWXOT6IY4zlWDJhzO-2qycIMvCRhi6M0U8
Content-Type: application/json; charset=utf-8
Content-Length: 235
ETag: W/"eb-nrQFcCus+oeaSYEsGwtSaVDAMYM"
Date: Sun, 05 Apr 2026 21:15:20 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 2,
    "transferId": 6,
    "previousStatus": "PENDING_DEPARTURE",
    "newStatus": "COMPLETED",
    "date": "2026-04-05T14:10:00.000Z",
    "userId": 4,
    "comment": "travel update"
  },
  "message": "Transfer history entry created successfully"
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
| 4.15 | POST | /api/transfer-history | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
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
| 4.16 | PUT | /api/transfer-history/1 | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImVlODM4MjNhLTAwMzMtNDMzNC1hYThkLTgwNTFiMTBhNTBmNSIsImlhdCI6MTc3NTQyNTA5MywiZXhwIjoxNzc1NDI2MjkzfQ.r1WKPJNCiHTnFMoACZ-u8B6IhQvWyf49HKqKH9pYqOc
Content-Type: application/json; charset=utf-8
Content-Length: 248
ETag: W/"f8-JonGW9EcrFNTEHqf4hrSbj753oI"
Date: Sun, 05 Apr 2026 21:38:13 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "transferId": 5,
    "previousStatus": "PENDING_DEPARTURE",
    "newStatus": "COMPLETED",
    "date": "2026-04-05T14:00:00.000Z",
    "userId": 3,
    "comment": "resource corrected comment"
  },
  "message": "Transfer history entry updated successfully"
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
| 4.20 | PUT | /api/transfer-history/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
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
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiY2QzMTI2YjgtYzk0ZS00ODI0LTlkNmItMmE5NWVkZTgwMzNmIiwiaWF0IjoxNzc1NDI1MTE1LCJleHAiOjE3NzU0MjYzMTV9.WZI_AbuVlWz048bTbZX7IuX9I_K3EsGYXSgp2l0CAII
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 21:38:35 GMT
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
| 4.25 | DELETE | /api/transfer-history/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
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
| 5.5 | POST | /api/auth/login | WORKER | 200 OK | |
| 5.6 | GET | /api/transfer-persons | SYSTEM_ADMIN | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMGJlZDM2MTQtODdjMy00MTA1LThlZDYtNGVmNTVlODYzMTkyIiwiaWF0IjoxNzc1NDI1MTY5LCJleHAiOjE3NzU0MjYzNjl9.sPYriJBRgRT-_wVg8OolsT9IrjTajdWGZYBD77lKbYw
Content-Type: application/json; charset=utf-8
Content-Length: 121
ETag: W/"79-EABmF14SJ/BgMH35+3gODPpQFC8"
Date: Sun, 05 Apr 2026 21:39:29 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "transferId": 5,
    "personId": 1,
    "status": "CONFIRMED",
    "departureDate": null,
    "arrivalDate": null
  }
}

 |
| 5.7 | GET | /api/transfer-persons | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjMyNzhjODYwLWNiMDEtNDFjOC1hMDBlLTQ0NmU2ZjA0ZWFiZiIsImlhdCI6MTc3NTQyNTE4MiwiZXhwIjoxNzc1NDI2MzgyfQ.67IKieVj7Q9vHM8kiaDJUUnHNX62iebn5BVpPg8BZuI
Content-Type: application/json; charset=utf-8
Content-Length: 121
ETag: W/"79-1oJN8IGQyCTscrnMwsUMRLh2ADA"
Date: Sun, 05 Apr 2026 21:39:42 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 2,
    "transferId": 6,
    "personId": 2,
    "status": "CONFIRMED",
    "departureDate": null,
    "arrivalDate": null
  }
}

 |
| 5.8 | GET | /api/transfer-persons | TRAVEL_MANAGER | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJiY2UwNmZlMi02ZmM0LTQ1ZGEtYTE4Yy1hNjVmNDkwNDFhOGEiLCJpYXQiOjE3NzU0MjUxOTQsImV4cCI6MTc3NTQyNjM5NH0.ewOLclnA8f-B243EAwOE20DWf9L_U0kfD_2ngzYb5Ps
Content-Type: application/json; charset=utf-8
Content-Length: 121
ETag: W/"79-EABmF14SJ/BgMH35+3gODPpQFC8"
Date: Sun, 05 Apr 2026 21:39:54 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "transferId": 5,
    "personId": 1,
    "status": "CONFIRMED",
    "departureDate": null,
    "arrivalDate": null
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
| 5.10 | GET | /api/transfer-persons | WORKER | 403 Forbidden | HTTP/1.1 403 Forbidden
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
| 5.11 | POST | /api/transfer-persons | RESOURCE_MANAGEMENT | 201 Created / 200 OK |HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImEzMjk0Y2M1LTM5NzgtNGRlMC1iNDk2LWM3NzhkYTg0NTdhNyIsImlhdCI6MTc3NTQyMzc4OCwiZXhwIjoxNzc1NDI0OTg4fQ.Kv_dlcCN3eipZ3Oqt1drtplsDy1yENe_kUCu9mxvwcM
Content-Type: application/json; charset=utf-8
Content-Length: 170
ETag: W/"aa-LQxYGwOW6E0Ewv1/JsZZvtSpY3Y"
Date: Sun, 05 Apr 2026 21:16:28 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "transferId": 5,
    "personId": 1,
    "status": "CONFIRMED",
    "departureDate": null,
    "arrivalDate": null
  },
  "message": "Transfer person created successfully"
}

 |
| 5.12 | POST | /api/transfer-persons | TRAVEL_MANAGER | 201 Created / 200 OK | HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJkNDNlYjRjNS04ODhjLTRlMTQtYTZiNy1hYmY5YjNhYzQ0YzkiLCJpYXQiOjE3NzU0MjM4MDcsImV4cCI6MTc3NTQyNTAwN30.SHDfbpUh-1h8yuJzDrMp-W8XTGbitMVYR_KMnUH_9uY
Content-Type: application/json; charset=utf-8
Content-Length: 170
ETag: W/"aa-ZoqWlgVdxHRuc8SFCpz+hpQX19E"
Date: Sun, 05 Apr 2026 21:16:47 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 2,
    "transferId": 6,
    "personId": 2,
    "status": "CONFIRMED",
    "departureDate": null,
    "arrivalDate": null
  },
  "message": "Transfer person created successfully"
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
| 5.15 | POST | /api/transfer-persons | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
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
| 5.16 | PUT | /api/transfer-persons/1 | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjJjZjAwOTQyLTM2MmYtNDExNS1iZjBlLTM5YzkzOTU1ZWM1MSIsImlhdCI6MTc3NTQyNTIwOCwiZXhwIjoxNzc1NDI2NDA4fQ.XxrvhA4phVwNtPVElqxpeFw8tXm9zmg8VQTBcX6u9lU
Content-Type: application/json; charset=utf-8
Content-Length: 170
ETag: W/"aa-0dm2pgCqRsdIpelHGLRZRQWogbE"
Date: Sun, 05 Apr 2026 21:40:08 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "transferId": 5,
    "personId": 1,
    "status": "DELIVERED",
    "departureDate": null,
    "arrivalDate": null
  },
  "message": "Transfer person updated successfully"
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
| 5.20 | PUT | /api/transfer-persons/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
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
| 5.21 | DELETE | /api/transfer-persons/1 | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiZjY4ZDY2MTYtNDAwMi00MDUxLWI4NzItZGI3ZWM3ZTllYTBkIiwiaWF0IjoxNzc1NDI1MjMwLCJleHAiOjE3NzU0MjY0MzB9.BAZz-yR7fnmNFvKwsiUdotBzooPksf17-daTj_CTTUE
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sun, 05 Apr 2026 21:40:30 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
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
| 5.25 | DELETE | /api/transfer-persons/1 | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
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
