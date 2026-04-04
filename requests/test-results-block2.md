# Block 2 Verification - Test Results

## 1. Resource Types (`resource-type.http`)
| # | Method | Endpoint | Role Executing | Expected Result | Actual Result |
|---|---|---|---|---|---|
| 1.1 | POST | /api/auth/login | SYSTEM_ADMIN | 200 OK | |
| 1.2 | POST | /api/auth/login | RESOURCE_MANAGEMENT | 200 OK | |
| 1.3 | POST | /api/auth/login | WORKER | 200 OK | |
| 1.4 | POST | /api/auth/login | VISITOR | 200 OK | |
| 1.5 | POST | /api/auth/login | TRAVEL_MANAGER | 200 OK | |
| 1.6 | GET | /api/resource-types | SYSTEM_ADMIN | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMzA0MzVmNTQtZjU1NS00ZWI0LThmNmYtMmU0ZWMxNjBkNTkwIiwiaWF0IjoxNzc1MzQ1MTUyLCJleHAiOjE3NzUzNDYzNTJ9.hA48KZSWkSt8XANe53xGK2H24mSnr0nyLdh1zQZkR7g
Content-Type: application/json; charset=utf-8
Content-Length: 926
ETag: W/"39e-pjFWi/mgWZ4z7ZFvrukI4dlvf5g"
Date: Sat, 04 Apr 2026 23:25:52 GMT
Connection: close

{
  "success": true,
  "data": [
    {
      "id": 7,
      "name": "Bulletproof Vest",
      "unitOfMeasure": "units",
      "category": "DEFENSE",
      "description": "Body armor"
    },
    {
      "id": 6,
      "name": "Tactical Helmet",
      "unitOfMeasure": "units",
      "category": "DEFENSE",
      "description": "Protective headgear"
    },
    {
      "id": 5,
      "name": "Ammunition",
      "unitOfMeasure": "rounds",
      "category": "AMMUNITION",
      "description": "Bullets for defense weapons"
    },
    {
      "id": 4,
      "name": "Hygiene Kit",
      "unitOfMeasure": "units",
      "category": "HYGIENE",
      "description": "Soap, toothpaste, and disinfectant"
    },
    {
      "id": 3,
      "name": "Medical Kit",
      "unitOfMeasure": "units",
      "category": "MEDICAL",
      "description": "First aid and essential medicine"
    },
    {
      "id": 2,
      "name": "Canned Food",
      "unitOfMeasure": "units",
      "category": "FOOD",
      "description": "Non-perishable canned food rations"
    },
    {
      "id": 1,
      "name": "Drinking Water",
      "unitOfMeasure": "liters",
      "category": "WATER",
      "description": "Potable water for daily consumption"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 7,
    "pages": 1
  }
} |
| 1.7 | GET | /api/resource-types | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjhhMTk1NmM0LTZiNWMtNDRiOC1hMTEyLTgxOWNiZDE2MjE0NCIsImlhdCI6MTc3NTM0NTE2NCwiZXhwIjoxNzc1MzQ2MzY0fQ.Yl8AIjyFA0Be_yLzsHj8m79Zj7QxRGC7Yak68P7fbl8
Content-Type: application/json; charset=utf-8
Content-Length: 926
ETag: W/"39e-pjFWi/mgWZ4z7ZFvrukI4dlvf5g"
Date: Sat, 04 Apr 2026 23:26:04 GMT
Connection: close

{
  "success": true,
  "data": [
    {
      "id": 7,
      "name": "Bulletproof Vest",
      "unitOfMeasure": "units",
      "category": "DEFENSE",
      "description": "Body armor"
    },
    {
      "id": 6,
      "name": "Tactical Helmet",
      "unitOfMeasure": "units",
      "category": "DEFENSE",
      "description": "Protective headgear"
    },
    {
      "id": 5,
      "name": "Ammunition",
      "unitOfMeasure": "rounds",
      "category": "AMMUNITION",
      "description": "Bullets for defense weapons"
    },
    {
      "id": 4,
      "name": "Hygiene Kit",
      "unitOfMeasure": "units",
      "category": "HYGIENE",
      "description": "Soap, toothpaste, and disinfectant"
    },
    {
      "id": 3,
      "name": "Medical Kit",
      "unitOfMeasure": "units",
      "category": "MEDICAL",
      "description": "First aid and essential medicine"
    },
    {
      "id": 2,
      "name": "Canned Food",
      "unitOfMeasure": "units",
      "category": "FOOD",
      "description": "Non-perishable canned food rations"
    },
    {
      "id": 1,
      "name": "Drinking Water",
      "unitOfMeasure": "liters",
      "category": "WATER",
      "description": "Potable water for daily consumption"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 7,
    "pages": 1
  }
} |
| 1.8 | GET | /api/resource-types | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiOTM2YzBlZjktMWNhNS00ZmYwLWE2ODUtZDBhMTI4MWZmNmZlIiwiaWF0IjoxNzc1MzQ1MTcyLCJleHAiOjE3NzUzNDYzNzJ9.NAxDHG_etij2H-_aQ8m7OsjVfJ6MfHFjxOzKo2Zw5EM
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 23:26:12 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 1.9 | GET | /api/resource-types/1 | SYSTEM_ADMIN | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNjg3YjVjMWQtYTJiYy00ZGZhLWE4MmItMzgwOTRjYTE1ODI4IiwiaWF0IjoxNzc1MzQ1MTc5LCJleHAiOjE3NzUzNDYzNzl9.DIa-1JB0A_LXzy_lWg5PSOdrk1dRJx-U8uTbaK2Pogg
Content-Type: application/json; charset=utf-8
Content-Length: 152
ETag: W/"98-yqI0WnjinunUPGABPCIapFgkszQ"
Date: Sat, 04 Apr 2026 23:26:19 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "name": "Drinking Water",
    "unitOfMeasure": "liters",
    "category": "WATER",
    "description": "Potable water for daily consumption"
  }
} |
| 1.10 | GET | /api/resource-types/1 | RESOURCE_MANAGEMENT | 200 OK | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImY4ZWNlODI4LTgxOTYtNGE2NS1iMmNlLWRlODM5NzA4Y2NhNSIsImlhdCI6MTc3NTM0NTE4OCwiZXhwIjoxNzc1MzQ2Mzg4fQ.rO_9XFTZT53682H0UIcjGS2dVC0MpuFh00Je9I9ya7k
Content-Type: application/json; charset=utf-8
Content-Length: 152
ETag: W/"98-yqI0WnjinunUPGABPCIapFgkszQ"
Date: Sat, 04 Apr 2026 23:26:28 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "name": "Drinking Water",
    "unitOfMeasure": "liters",
    "category": "WATER",
    "description": "Potable water for daily consumption"
  }
}|
| 1.11 | POST | /api/resource-types | SYSTEM_ADMIN | 403 ForbiddenException (system catalog) |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMWExNjNkNmYtNzhjNy00ZmMwLWE2ODAtYjY0YzFhZTQwOGQ0IiwiaWF0IjoxNzc1MzQ1MTk2LCJleHAiOjE3NzUzNDYzOTZ9.n6uxADxGXG_Za0Uy-N61maryLWMeLiNWaMacWOxFFfA
Content-Type: application/json; charset=utf-8
Content-Length: 116
ETag: W/"74-Arx70rB7MZMatuGkfuVuJkFuMAo"
Date: Sat, 04 Apr 2026 23:26:36 GMT
Connection: close

{
  "message": "Resource types are system catalogs and cannot be modified via API",
  "error": "Forbidden",
  "statusCode": 403
} |
| 1.12 | PUT | /api/resource-types/1 | SYSTEM_ADMIN | 403 ForbiddenException (system catalog) |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNjMzMDg4NjMtOWUyYS00NjkyLTgwOGEtYTM4MDcyOGRiMWViIiwiaWF0IjoxNzc1MzQ1MjEwLCJleHAiOjE3NzUzNDY0MTB9.VfaCYM1fG40hD7drK6Jn7XnYyrPK4Mc6Z-zqUxZz6xU
Content-Type: application/json; charset=utf-8
Content-Length: 116
ETag: W/"74-Arx70rB7MZMatuGkfuVuJkFuMAo"
Date: Sat, 04 Apr 2026 23:26:50 GMT
Connection: close

{
  "message": "Resource types are system catalogs and cannot be modified via API",
  "error": "Forbidden",
  "statusCode": 403
} |
| 1.13 | DELETE | /api/resource-types/1 | SYSTEM_ADMIN | 403 ForbiddenException (system catalog) |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiZjYwNTE4YTQtNTA3My00ZWVhLWFlZmItNTQ2NmY1MTYxN2U3IiwiaWF0IjoxNzc1MzQ1MjE5LCJleHAiOjE3NzUzNDY0MTl9.AzEYbxuL8CEGYefv6940rKiJLjJD59aYutUxz70ZJ3A
Content-Type: application/json; charset=utf-8
Content-Length: 116
ETag: W/"74-Arx70rB7MZMatuGkfuVuJkFuMAo"
Date: Sat, 04 Apr 2026 23:26:59 GMT
Connection: close

{
  "message": "Resource types are system catalogs and cannot be modified via API",
  "error": "Forbidden",
  "statusCode": 403
} |
| 1.14 | POST | /api/resource-types | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZmI1OTMyZmEtNDlmZi00MGU0LTk5YTEtYjc3YjFlMDZjYTY0IiwiaWF0IjoxNzc1MzQ1MjI3LCJleHAiOjE3NzUzNDY0Mjd9.nF7p4XM1_PqJ-1Rzlc87iJH7q8nClMbykRwmT-W5nDg
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 23:27:07 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 1.15 | GET | /api/resource-types | TRAVEL_MANAGER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJlZTIwYTNmOS05MDY2LTQ4OWMtYjM2Mi00NTZkYjJkNDhmMGQiLCJpYXQiOjE3NzUzNDUyMzYsImV4cCI6MTc3NTM0NjQzNn0.eqvs4qxFWqhX7IIscIrLwOZq8sCFPUmIE3ZhHt3lMhY
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 23:27:16 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |

## 2. Camp Inventory (`camp-inventory.http`)
| # | Method | Endpoint | Role Executing | Expected Result | Actual Result |
|---|---|---|---|---|---|
| 2.1 | POST | /api/auth/login | SYSTEM_ADMIN | 200 OK | |
| 2.2 | POST | /api/auth/login | RESOURCE_MANAGEMENT | 200 OK | |
| 2.3 | POST | /api/auth/login | WORKER | 200 OK | |
| 2.4 | POST | /api/auth/login | VISITOR | 200 OK | |
| 2.5 | POST | /api/auth/login | TRAVEL_MANAGER | 200 OK | |
| 2.6 | GET | /api/camp-inventory | SYSTEM_ADMIN | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiOTIzMmFiYmQtMGM3Mi00NDVmLWExNmItMDNhZjU3YjJmZGE1IiwiaWF0IjoxNzc1MzQ1Mjk0LCJleHAiOjE3NzUzNDY0OTR9.So0XMJTGU-LBmPKTF2ProHt7oBHpACvYRWkITq5iXNs
Content-Type: application/json; charset=utf-8
Content-Length: 1333
ETag: W/"535-76JqpLsW9Lo+KOQWvrmwydmmVbY"
Date: Sat, 04 Apr 2026 23:28:14 GMT
Connection: close

{
  "success": true,
  "data": [
    {
      "campId": 1,
      "resourceTypeId": 2,
      "currentAmount": "100.00",
      "minimumAlertAmount": "30.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 1,
      "resourceTypeId": 3,
      "currentAmount": "20.00",
      "minimumAlertAmount": "5.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 1,
      "resourceTypeId": 4,
      "currentAmount": "30.00",
      "minimumAlertAmount": "10.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 1,
      "resourceTypeId": 5,
      "currentAmount": "500.00",
      "minimumAlertAmount": "100.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 1,
      "resourceTypeId": 6,
      "currentAmount": "15.00",
      "minimumAlertAmount": "5.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 1,
      "resourceTypeId": 7,
      "currentAmount": "10.00",
      "minimumAlertAmount": "5.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 2,
      "resourceTypeId": 1,
      "currentAmount": "200.00",
      "minimumAlertAmount": "50.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 2,
      "resourceTypeId": 2,
      "currentAmount": "100.00",
      "minimumAlertAmount": "30.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 2,
      "resourceTypeId": 3,
      "currentAmount": "20.00",
      "minimumAlertAmount": "5.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 1,
      "resourceTypeId": 1,
      "currentAmount": "200.00",
      "minimumAlertAmount": "50.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 35,
    "pages": 4
  }
} |
| 2.7 | GET | /api/camp-inventory | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImFlZGQzNDlkLWNkODEtNDQyZC04YTBhLTZmYTc5ZTUyOTNkYiIsImlhdCI6MTc3NTM0NTMwNCwiZXhwIjoxNzc1MzQ2NTA0fQ.skd7cl4M1lSOiKszGNTbueAC8GT-dH4-fuAJQCnyzo0
Content-Type: application/json; charset=utf-8
Content-Length: 1333
ETag: W/"535-76JqpLsW9Lo+KOQWvrmwydmmVbY"
Date: Sat, 04 Apr 2026 23:28:24 GMT
Connection: close

{
  "success": true,
  "data": [
    {
      "campId": 1,
      "resourceTypeId": 2,
      "currentAmount": "100.00",
      "minimumAlertAmount": "30.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 1,
      "resourceTypeId": 3,
      "currentAmount": "20.00",
      "minimumAlertAmount": "5.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 1,
      "resourceTypeId": 4,
      "currentAmount": "30.00",
      "minimumAlertAmount": "10.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 1,
      "resourceTypeId": 5,
      "currentAmount": "500.00",
      "minimumAlertAmount": "100.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 1,
      "resourceTypeId": 6,
      "currentAmount": "15.00",
      "minimumAlertAmount": "5.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 1,
      "resourceTypeId": 7,
      "currentAmount": "10.00",
      "minimumAlertAmount": "5.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 2,
      "resourceTypeId": 1,
      "currentAmount": "200.00",
      "minimumAlertAmount": "50.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 2,
      "resourceTypeId": 2,
      "currentAmount": "100.00",
      "minimumAlertAmount": "30.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 2,
      "resourceTypeId": 3,
      "currentAmount": "20.00",
      "minimumAlertAmount": "5.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    },
    {
      "campId": 1,
      "resourceTypeId": 1,
      "currentAmount": "200.00",
      "minimumAlertAmount": "50.00",
      "lastUpdate": "2026-04-04T22:59:42.670Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 35,
    "pages": 4
  }
} |
| 2.8 | GET | /api/camp-inventory | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMzhiOGYwNWYtZjBjOS00OGMxLThjZDgtNGQwN2NlNzlkMmY4IiwiaWF0IjoxNzc1MzQ1MzE0LCJleHAiOjE3NzUzNDY1MTR9.Jnxf0nesOwZwlTdgaCRNyleFFsYFZ1A9V9FF_BL69AA
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 23:28:34 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 2.9 | GET | /api/camp-inventory/1/1 | SYSTEM_ADMIN | 200 OK | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiZDdjYTBhYjAtMDA1Zi00NzE3LTg2ZDctMGRhMmM3OTBhNWZkIiwiaWF0IjoxNzc1MzQ1MzIxLCJleHAiOjE3NzUzNDY1MjF9.U62sPDV7VoTxs7pA6Xo2NSGoaMapOEsZYLT0e-Mrfhw
Content-Type: application/json; charset=utf-8
Content-Length: 149
ETag: W/"95-TjJBX1fU2QpWMyEeS9SS5UYS/PY"
Date: Sat, 04 Apr 2026 23:28:41 GMT
Connection: close

{
  "success": true,
  "data": {
    "campId": 1,
    "resourceTypeId": 1,
    "currentAmount": "200.00",
    "minimumAlertAmount": "50.00",
    "lastUpdate": "2026-04-04T22:59:42.670Z"
  }
}|
| 2.10 | GET | /api/camp-inventory/1/1 | RESOURCE_MANAGEMENT | 200 OK | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjEwZTU3YzAzLWRjOGUtNGExNi04MWUxLTEwYWRmMTIxYjY3MCIsImlhdCI6MTc3NTM0NTMyNywiZXhwIjoxNzc1MzQ2NTI3fQ.cjQkBIIX0G0XXVRuglP-3WSN5AlaoA_yPTLi4r1PB8U
Content-Type: application/json; charset=utf-8
Content-Length: 149
ETag: W/"95-TjJBX1fU2QpWMyEeS9SS5UYS/PY"
Date: Sat, 04 Apr 2026 23:28:47 GMT
Connection: close

{
  "success": true,
  "data": {
    "campId": 1,
    "resourceTypeId": 1,
    "currentAmount": "200.00",
    "minimumAlertAmount": "50.00",
    "lastUpdate": "2026-04-04T22:59:42.670Z"
  }
}|
| 2.11 | PUT | /api/camp-inventory/1/1 | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImVkMjlhYTg0LTA5NzctNGJkNi1hMDZmLTYzNzdlZTQwYmY0YiIsImlhdCI6MTc3NTM0NTMzNCwiZXhwIjoxNzc1MzQ2NTM0fQ.aDVAPLNDsBqKz2cNoNGbNV0CY5bU6kOonoXH2jKnC_Y
Content-Type: application/json; charset=utf-8
Content-Length: 202
ETag: W/"ca-OQimL9HSZfyrptgMQNoeTLDOWTA"
Date: Sat, 04 Apr 2026 23:28:54 GMT
Connection: close

{
  "success": true,
  "data": {
    "campId": 1,
    "resourceTypeId": 1,
    "currentAmount": "200.00",
    "minimumAlertAmount": "40.00",
    "lastUpdate": "2026-04-04T23:28:54.464Z"
  },
  "message": "Camp inventory item updated successfully"
} |
| 2.12 | PUT | /api/camp-inventory/1/1 | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiYjUzMGJiZjQtZGExMS00ODY0LWE4MDEtYjE3MmFmNGU0NmYxIiwiaWF0IjoxNzc1MzQ1MzQyLCJleHAiOjE3NzUzNDY1NDJ9.HWn2nSCV5BooswVUp-_7fKjmQEoFWZ6FdyO6-Ozngag
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 23:29:02 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 2.13 | POST | /api/camp-inventory | SYSTEM_ADMIN | 403 ForbiddenException (system-managed) |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiZDg0OTkxMDEtNjg2OS00MmFlLThlZDEtOGNhNzc3ODc2ZjRlIiwiaWF0IjoxNzc1MzQ1MzUwLCJleHAiOjE3NzUzNDY1NTB9.icSreJlLvS2z6PFsgDAteBJjOUcjzPyx_iWKlUCa-TE
Content-Type: application/json; charset=utf-8
Content-Length: 129
ETag: W/"81-typuZhPgdDHaRqinaatmrNpnr4I"
Date: Sat, 04 Apr 2026 23:29:10 GMT
Connection: close

{
  "message": "Inventory records are system-managed and cannot be created or deleted manually",
  "error": "Forbidden",
  "statusCode": 403
} |
| 2.14 | DELETE | /api/camp-inventory/1/1 | SYSTEM_ADMIN | 403 ForbiddenException (system-managed) |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiOWVlMGU4ZGItMjQ3Mi00ZmFhLTg0NmMtYmE3N2NhZGUwNjQ3IiwiaWF0IjoxNzc1MzQ1MzU5LCJleHAiOjE3NzUzNDY1NTl9.DiHwK1yIBkMfUcHQaNIo6NPrcl9slFVotYsPWoU3RYw
Content-Type: application/json; charset=utf-8
Content-Length: 129
ETag: W/"81-typuZhPgdDHaRqinaatmrNpnr4I"
Date: Sat, 04 Apr 2026 23:29:19 GMT
Connection: close

{
  "message": "Inventory records are system-managed and cannot be created or deleted manually",
  "error": "Forbidden",
  "statusCode": 403
} |
| 2.15 | GET | /api/camp-inventory | TRAVEL_MANAGER | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI0MWUzNWY3ZC0zN2M2LTRkZmEtYmZkYi04MDYyOTczN2RhNWQiLCJpYXQiOjE3NzUzNDUzNjYsImV4cCI6MTc3NTM0NjU2Nn0.0kwOT8Ra5RmQ6ev56PVcoV3aFgtQr67Auru2fZiTe64
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 23:29:26 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|

## 3. Inventory Movements (`inventory-movement.http`)
| # | Method | Endpoint | Role Executing | Expected Result | Actual Result |
|---|---|---|---|---|---|
| 3.1 | POST | /api/auth/login | SYSTEM_ADMIN | 200 OK | |
| 3.2 | POST | /api/auth/login | RESOURCE_MANAGEMENT | 200 OK | |
| 3.3 | POST | /api/auth/login | WORKER | 200 OK | |
| 3.4 | POST | /api/auth/login | VISITOR | 200 OK | |
| 3.5 | POST | /api/auth/login | TRAVEL_MANAGER | 200 OK | |
| 3.6 | GET | /api/inventory-movements | SYSTEM_ADMIN | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiOWM3MGIxMzAtOWU1Ny00YzllLTkwOTUtYzM3N2I4Y2Y2NzI4IiwiaWF0IjoxNzc1MzQ1NDI3LCJleHAiOjE3NzUzNDY2Mjd9.wkYU6xJHczyyOSzKL5SaSZ4Y0WLYh1_Kmtq-5v14dOQ
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sat, 04 Apr 2026 23:30:27 GMT
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
| 3.7 | GET | /api/inventory-movements | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImFmMTcyMWZmLThlNzktNGViOS1hYTM3LTViN2Q0Y2JhMzEyMyIsImlhdCI6MTc3NTM0NTQzNywiZXhwIjoxNzc1MzQ2NjM3fQ.8DQoeKyrH0jmqFofDZ46QdTxat0TzPJfT-mguhn1pNM
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sat, 04 Apr 2026 23:30:37 GMT
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
| 3.8 | GET | /api/inventory-movements | WORKER | 200 OK | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMWJiYjkwM2UtMmZhYi00ZDM0LWE4MDgtMjRmYTlkNWRlNzQ3IiwiaWF0IjoxNzc1MzQ1NDQzLCJleHAiOjE3NzUzNDY2NDN9.hCqjkmzgV2vIejnLSVt70_toxUXChEatr5k7V-OyZmw
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sat, 04 Apr 2026 23:30:43 GMT
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
}|
| 3.9 | GET | /api/inventory-movements | VISITOR | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImNhbXBJZCI6MSwicm9sIjoiVklTSVRPUiIsImp0aSI6ImFhZTJkMDU1LTI1NDktNGY1OC04NGIwLWQ1ZDJlNWY5ZDZkNyIsImlhdCI6MTc3NTM0NTQ1MCwiZXhwIjoxNzc1MzQ2NjUwfQ.PIZGNPUOUljpWOUWH-uYIEVjCtCHdWViefPiIFAEWbU
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 23:30:50 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 3.10 | GET | /api/inventory-movements/1 | WORKER | 200 OK |HTTP/1.1 404 Not Found
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMjEzYzQ4NjQtODMwMC00YWUyLWJhNzYtMzJlMDQ1MGI5YWY0IiwiaWF0IjoxNzc1MzQ1NDU3LCJleHAiOjE3NzUzNDY2NTd9.1TApMrbNGFkN_glfmb-vcWNCRmSOKxqr6hOcZEdUZ0M
Content-Type: application/json; charset=utf-8
Content-Length: 79
ETag: W/"4f-q3yvpTKB2xsR6XTvQjVoyI14T+Q"
Date: Sat, 04 Apr 2026 23:30:57 GMT
Connection: close

{
  "message": "Inventory movement not found",
  "error": "Not Found",
  "statusCode": 404
} |
| 3.11 | POST | /api/inventory-movements | WORKER | 200/201 Created |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiOGE3NmY1YmYtMGU4Zi00YTRkLTg1NTEtMjgwZmM1Y2QyZmZhIiwiaWF0IjoxNzc1MzQ1NDY0LCJleHAiOjE3NzUzNDY2NjR9.BTP6Dg8OCpmZajnfhfkW3sBNX3UY_qpt0gp_0iH2dHk
Content-Type: application/json; charset=utf-8
Content-Length: 108
ETag: W/"6c-19PxmomFR3WgqH5edxMdFtztqac"
Date: Sat, 04 Apr 2026 23:31:04 GMT
Connection: close

{
  "message": "invalid input value for enum movement_type_enum: \"IN\"",
  "error": "Bad Request",
  "statusCode": 400
} |
| 3.12 | POST | /api/inventory-movements | RESOURCE_MANAGEMENT | 200/201 Created | HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImI5NjJjZGI5LTZmMzAtNGYyYi1iNGI3LTcyMjk3ZTk3MGIwZSIsImlhdCI6MTc3NTM0NTQ3NCwiZXhwIjoxNzc1MzQ2Njc0fQ.5xgYyiYvJqY95HGrklNwfQHI7JuWbOo3ypF8N9hcFCw
Content-Type: application/json; charset=utf-8
Content-Length: 108
ETag: W/"6c-19PxmomFR3WgqH5edxMdFtztqac"
Date: Sat, 04 Apr 2026 23:31:14 GMT
Connection: close

{
  "message": "invalid input value for enum movement_type_enum: \"IN\"",
  "error": "Bad Request",
  "statusCode": 400
}|
| 3.13 | POST | /api/inventory-movements | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiY2UyZmNlNDUtODliNS00Y2Y3LWJlYmUtMDEzODQxYjNlMmZmIiwiaWF0IjoxNzc1MzQ1NDgzLCJleHAiOjE3NzUzNDY2ODN9.J_G09Pmlv8RNSuxIAVB6z_SJ4zTYZTH1eB1PNiRui-0
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 23:31:23 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 3.14 | PUT | /api/inventory-movements/1 | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjkyM2IyNWE3LWY4MzctNDdjNy1hYzYyLTE2MzQ2NmFkYjMzZSIsImlhdCI6MTc3NTM0NTQ5MSwiZXhwIjoxNzc1MzQ2NjkxfQ.VounGxPEXe1ZKU_Qu9vOgepbkMu5KWmKfY7eC4QnywY
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-nJTaPQzSV//QzRMBY9gWp4LAEQk"
Date: Sat, 04 Apr 2026 23:31:31 GMT
Connection: close

{
  "message": "Inventory movement not found",
  "error": "Bad Request",
  "statusCode": 400
} |
| 3.15 | PUT | /api/inventory-movements/1 | WORKER | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZGI3OWI0OGMtYmM3Ny00MWI2LWE4OTAtODNiYjk1MGE4MjMwIiwiaWF0IjoxNzc1MzQ1NTA1LCJleHAiOjE3NzUzNDY3MDV9.T6-3renLLykPhVHkffIFtUvoxYOPb5_bxYjAIc-tekc
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 23:31:45 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 3.16 | DELETE | /api/inventory-movements/1 | SYSTEM_ADMIN | 403 ForbiddenException (audit) | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMjVjYjhhNjQtMTczZi00Yzg0LTk5OTktNmMxNDkzNzNmZjIwIiwiaWF0IjoxNzc1MzQ1NTE5LCJleHAiOjE3NzUzNDY3MTl9.Omub_x8lwu4JZzPKKKW-q_2V2ERHu5EqqQvBjgJw0SE
Content-Type: application/json; charset=utf-8
Content-Length: 106
ETag: W/"6a-gg2N8LINqz2oYWIAiWq0jb9YyyM"
Date: Sat, 04 Apr 2026 23:31:59 GMT
Connection: close

{
  "message": "Inventory movements cannot be deleted for audit reasons",
  "error": "Forbidden",
  "statusCode": 403
}|
| 3.17 | GET | /api/inventory-movements | TRAVEL_MANAGER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI2N2U2ODVkNS00NjE3LTRlYjQtODRlNi1lNTM2ZDQ2MGQxZjciLCJpYXQiOjE3NzUzNDU1MjcsImV4cCI6MTc3NTM0NjcyN30.GCGneo-dxp1-gsIWur3ylnGqRegOv8AL6auu7kkh1Tw
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 23:32:07 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |

## 4. Inventory Alerts (`inventory-alert.http`)
| # | Method | Endpoint | Role Executing | Expected Result | Actual Result |
|---|---|---|---|---|---|
| 4.1 | POST | /api/auth/login | SYSTEM_ADMIN | 200 OK | |
| 4.2 | POST | /api/auth/login | RESOURCE_MANAGEMENT | 200 OK | |
| 4.3 | POST | /api/auth/login | WORKER | 200 OK | |
| 4.4 | POST | /api/auth/login | VISITOR | 200 OK | |
| 4.5 | POST | /api/auth/login | TRAVEL_MANAGER | 200 OK | |
| 4.6 | GET | /api/inventory-alerts | SYSTEM_ADMIN | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiYzQxMGExOWYtZmYxNi00YmZmLWIxYzgtYTg0MzNiZGZiN2ZiIiwiaWF0IjoxNzc1MzQ1NTg0LCJleHAiOjE3NzUzNDY3ODR9.hXZsnuIwb-DZX9z2Rt1Thkm48B43HE-UKUsA5Feb42w
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sat, 04 Apr 2026 23:33:04 GMT
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
| 4.7 | GET | /api/inventory-alerts | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjcyYTdkZmMyLWJhY2MtNDZlMy1hMDJmLTY4MzY1Nzc3MGZkOSIsImlhdCI6MTc3NTM0NTU5MSwiZXhwIjoxNzc1MzQ2NzkxfQ.OYaZsuxJ2mV1IwbC11dTaJZcPJZBPOof11sdc1j8c30
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sat, 04 Apr 2026 23:33:11 GMT
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
| 4.8 | GET | /api/inventory-alerts | WORKER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMTZkMDMyN2QtMzA0Yi00NTBiLTljZjktMmEwY2M0NTViNTU5IiwiaWF0IjoxNzc1MzQ1NTk3LCJleHAiOjE3NzUzNDY3OTd9.LUKJPMa9XFQeEljK4v8h4kcvZkZjjZHC3qcSVlS5rQ4
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 23:33:17 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 4.9 | GET | /api/inventory-alerts/1 | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 404 Not Found
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImIzMWM0NmY2LWI2ZTUtNDNmZi1iZTM0LTBhM2U4YTMyNzc0ZCIsImlhdCI6MTc3NTM0NTYwNCwiZXhwIjoxNzc1MzQ2ODA0fQ.NM-0tLYMCtPSDnZkM1JLiCU6wrhxxRXjF5B-zTgoqH8
Content-Type: application/json; charset=utf-8
Content-Length: 76
ETag: W/"4c-dB3v/uSm4kIb7y+Th+rRln7hxFI"
Date: Sat, 04 Apr 2026 23:33:24 GMT
Connection: close

{
  "message": "Inventory alert not found",
  "error": "Not Found",
  "statusCode": 404
} |
| 4.10 | POST | /api/inventory-alerts | SYSTEM_ADMIN | 403 ForbiddenException (system-generated) |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNzQwNzMwYjctM2QzMi00ZDY5LWIyZTQtZDA4YzU2MTdiYWM5IiwiaWF0IjoxNzc1MzQ1NjEyLCJleHAiOjE3NzUzNDY4MTJ9.3L84uziEaf6sYQncxqzhQtrI65cx38_x-BX8s9Rfprk
Content-Type: application/json; charset=utf-8
Content-Length: 130
ETag: W/"82-8nxuAZrYXPGMEM94oQ99uvoXrm8"
Date: Sat, 04 Apr 2026 23:33:32 GMT
Connection: close

{
  "message": "Inventory alerts are system-generated and cannot be created or deleted manually",
  "error": "Forbidden",
  "statusCode": 403
} |
| 4.11 | PUT | /api/inventory-alerts/1 | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6Ijg5NTI1YTQxLTJhMWItNGFhZS05NWQ5LTkyZWVlZWYyZTc5ZiIsImlhdCI6MTc3NTM0NTYyMiwiZXhwIjoxNzc1MzQ2ODIyfQ.DN9yVf_aVcfDQoGTlAO4e9cuceyex3T9mM9oTKXqO_0
Content-Type: application/json; charset=utf-8
Content-Length: 78
ETag: W/"4e-xgJBE3XwWhfKOC9ecc0j9v88czg"
Date: Sat, 04 Apr 2026 23:33:42 GMT
Connection: close

{
  "message": "Inventory alert not found",
  "error": "Bad Request",
  "statusCode": 400
} |
| 4.12 | PUT | /api/inventory-alerts/1 | SYSTEM_ADMIN | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiZjc4YTcxMDItNzNkMy00OTQ4LWEzMzYtNGEyNTQwNjkxZjJjIiwiaWF0IjoxNzc1MzQ1NjI5LCJleHAiOjE3NzUzNDY4Mjl9.-5HLqF58bj_sxDVuxqUymflRcXHW1lTwTuX4NiX92bg
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 23:33:49 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 4.13 | DELETE | /api/inventory-alerts/1 | SYSTEM_ADMIN | 403 ForbiddenException (system-generated) | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiYWM1Y2FmOWUtZWFmMS00ODlkLThlZjktODgxYzVlNmFiZGMxIiwiaWF0IjoxNzc1MzQ1NjM2LCJleHAiOjE3NzUzNDY4MzZ9._p2_zQmIVgaVWybrkSV_FbNd4I1qrLBzv5bJvC0claQ
Content-Type: application/json; charset=utf-8
Content-Length: 130
ETag: W/"82-8nxuAZrYXPGMEM94oQ99uvoXrm8"
Date: Sat, 04 Apr 2026 23:33:56 GMT
Connection: close

{
  "message": "Inventory alerts are system-generated and cannot be created or deleted manually",
  "error": "Forbidden",
  "statusCode": 403
}|
| 4.14 | GET | /api/inventory-alerts | TRAVEL_MANAGER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI5MGFmOThhMi00ZWE5LTQ2ZDItOTMwOC1hYTgyYmQ1ZWIwZTEiLCJpYXQiOjE3NzUzNDU2NDQsImV4cCI6MTc3NTM0Njg0NH0.xaZiLI170QrrmxDNAB4fe6MBoEEpdJQjtv4zI0meV_Y
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 23:34:04 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |

## 5. Daily Collection Records (`daily-collection-record.http`)
| # | Method | Endpoint | Role Executing | Expected Result | Actual Result |
|---|---|---|---|---|---|
| 5.1 | POST | /api/auth/login | SYSTEM_ADMIN | 200 OK | |
| 5.2 | POST | /api/auth/login | RESOURCE_MANAGEMENT | 200 OK | |
| 5.3 | POST | /api/auth/login | WORKER | 200 OK | |
| 5.4 | POST | /api/auth/login | VISITOR | 200 OK | |
| 5.5 | POST | /api/auth/login | TRAVEL_MANAGER | 200 OK | |
| 5.6 | GET | /api/daily-collection-records | SYSTEM_ADMIN | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiYWQwZWZiMDEtNzhhYy00MjNiLWJlZWUtYWY3ZWFjZGNiZTVhIiwiaWF0IjoxNzc1MzQ1Njc0LCJleHAiOjE3NzUzNDY4NzR9.KEgvSztiBmrGilnTmYX2DaHa4Q727_fxwoRIQwj_KXc
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sat, 04 Apr 2026 23:34:34 GMT
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
| 5.7 | GET | /api/daily-collection-records | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjUxOGUxZWVhLWJjNzktNDhkOC05YjMyLWUxZDcwMjRlNjQ4YSIsImlhdCI6MTc3NTM0NTY4MywiZXhwIjoxNzc1MzQ2ODgzfQ.7UJMpE5XUyaT9aJMe1JD4SGMafXFlP3FaQE4DNDKUIw
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sat, 04 Apr 2026 23:34:43 GMT
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
| 5.8 | GET | /api/daily-collection-records | WORKER | 200 OK | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNzU5ZDljYzYtMGIxYy00MzBjLWFmNGUtZTg0ZjM3NDkwNjIxIiwiaWF0IjoxNzc1MzQ1NjkxLCJleHAiOjE3NzUzNDY4OTF9.MMDFsfgvFRjUwjeGGlgx26wloRNN4Dw8xX9opDFDbxg
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-djTSw5YAj5hIxxMcRJk5k+iTBdw"
Date: Sat, 04 Apr 2026 23:34:51 GMT
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
}|
| 5.9 | GET | /api/daily-collection-records | VISITOR | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImNhbXBJZCI6MSwicm9sIjoiVklTSVRPUiIsImp0aSI6IjdlNTIwYzQ0LTk3MDItNDI2Yy04MTNiLTRlMTcyZDBlZTAwMiIsImlhdCI6MTc3NTM0NTcwMiwiZXhwIjoxNzc1MzQ2OTAyfQ.NUAd4v951HaU6z87EtxemqgIPjHrwWaH7fGybtOtn8I
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 23:35:02 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 5.10 | GET | /api/daily-collection-records/1 | WORKER | 200 OK |HTTP/1.1 404 Not Found
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZTQxNTNlZDQtODU2ZS00OTBjLTk0MWUtNmVkODZkOTMzMmMzIiwiaWF0IjoxNzc1MzQ1NzA4LCJleHAiOjE3NzUzNDY5MDh9.o5TgRD0R0H0H8T41nEU32g0rmGJDVA-LY9BTiXglBXM
Content-Type: application/json; charset=utf-8
Content-Length: 84
ETag: W/"54-7KCNclsSmfb5aFm5bWJMsh/2BVI"
Date: Sat, 04 Apr 2026 23:35:08 GMT
Connection: close

{
  "message": "Daily collection record not found",
  "error": "Not Found",
  "statusCode": 404
} |
| 5.11 | POST | /api/daily-collection-records | WORKER | 200/201 Created | HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNzY1M2U0MjEtMzllYi00YmE1LTljOWQtNWRlMzU0OTRiMWNjIiwiaWF0IjoxNzc1MzQ1NzE1LCJleHAiOjE3NzUzNDY5MTV9.VNmBKyOquqozgpBLYcg9euAUqb-ZLeMufcwpnDUcViY
Content-Type: application/json; charset=utf-8
Content-Length: 264
ETag: W/"108-iGAAquP3cWI0Y1EoeDLSmCaBgt4"
Date: Sat, 04 Apr 2026 23:35:15 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "campId": 1,
    "personId": 1,
    "resourceTypeId": 1,
    "date": "2024-01-01",
    "expectedAmount": "1000.00",
    "actualAmount": "950.00",
    "differenceReason": "string",
    "recordedBy": 2,
    "movementId": null
  },
  "message": "Daily collection record created successfully"
}|
| 5.12 | POST | /api/daily-collection-records | RESOURCE_MANAGEMENT | 200/201 Created |HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjViOWZhY2Q3LTBkNDMtNDNlMi1iNzUyLTYzYTAwZjQ3ZjkzNCIsImlhdCI6MTc3NTM0NTcyNywiZXhwIjoxNzc1MzQ2OTI3fQ.-yiFDTLCu0VLx2R9e4L6MR2EymwZII44Qurx5RJ-qxM
Content-Type: application/json; charset=utf-8
Content-Length: 255
ETag: W/"ff-vK/MP4IBYuur7aHLfUQG2DAPGZE"
Date: Sat, 04 Apr 2026 23:35:27 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 2,
    "campId": 1,
    "personId": 1,
    "resourceTypeId": 1,
    "date": "2024-01-02",
    "expectedAmount": "8.00",
    "actualAmount": "8.00",
    "differenceReason": null,
    "recordedBy": 3,
    "movementId": null
  },
  "message": "Daily collection record created successfully"
} |
| 5.13 | PUT | /api/daily-collection-records/1 | WORKER | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiOTZmYjUxNmItZWI5Yy00NjdiLWIzMWEtZjFjYzA0MDlmYjUwIiwiaWF0IjoxNzc1MzQ1NzM5LCJleHAiOjE3NzUzNDY5Mzl9.EQ7HRIsoJaipNFRCnrlCN73ddRY_zhB9CqtBVHkfuXY
Content-Type: application/json; charset=utf-8
Content-Length: 271
ETag: W/"10f-563ZuNeKe7VeP1DIiPzstknVyQc"
Date: Sat, 04 Apr 2026 23:35:39 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "campId": 1,
    "personId": 1,
    "resourceTypeId": 1,
    "date": "2024-01-01",
    "expectedAmount": "1000.00",
    "actualAmount": "970",
    "differenceReason": "field correction",
    "recordedBy": 2,
    "movementId": null
  },
  "message": "Daily collection record updated successfully"
} |
| 5.14 | PUT | /api/daily-collection-records/1 | RESOURCE_MANAGEMENT | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjAxZDc2MzY5LThhM2QtNGU2MS05ZDAzLWRiODQ3YzQyNmE3MCIsImlhdCI6MTc3NTM0NTc0NiwiZXhwIjoxNzc1MzQ2OTQ2fQ.jmZew_vsk5rmAe0kSmmjO62uFv4DI0OTtNpmODqda7o
Content-Type: application/json; charset=utf-8
Content-Length: 283
ETag: W/"11b-eCAjlQIad8KfVdUY8UhV7Z33/OY"
Date: Sat, 04 Apr 2026 23:35:46 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "campId": 1,
    "personId": 1,
    "resourceTypeId": 1,
    "date": "2024-01-01",
    "expectedAmount": "1000.00",
    "actualAmount": "970.00",
    "differenceReason": "official validated reason",
    "recordedBy": 2,
    "movementId": null
  },
  "message": "Daily collection record updated successfully"
} |
| 5.15 | DELETE | /api/daily-collection-records/1 | SYSTEM_ADMIN | 403 ForbiddenException (audit) | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMWU5N2VjNzAtZWJkYS00ZDJiLTkxZDYtOTBmMGE4ZjEwZTdhIiwiaWF0IjoxNzc1MzQ1NzU0LCJleHAiOjE3NzUzNDY5NTR9.RzyuCbhAUHFtRnZcjoP0oZiWf5yC7OHmizFcNL72Se8
Content-Type: application/json; charset=utf-8
Content-Length: 111
ETag: W/"6f-vKDKosB2BRRUiMkiTu78qNdd+5c"
Date: Sat, 04 Apr 2026 23:35:54 GMT
Connection: close

{
  "message": "Daily collection records cannot be deleted for audit reasons",
  "error": "Forbidden",
  "statusCode": 403
}|
| 5.16 | GET | /api/daily-collection-records | TRAVEL_MANAGER | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJlYmVjMGVmZS0wMzRhLTQzNmMtOTIzNC00MjM1NTlhYjMyY2EiLCJpYXQiOjE3NzUzNDU3NjYsImV4cCI6MTc3NTM0Njk2Nn0._qB6r9KqVk984mbn87a0JpHiQ1hr69kPqLfTDcPZbhc
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 23:36:06 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
