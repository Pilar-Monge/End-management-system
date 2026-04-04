# Block 1 - Test Results

## admission-requests.http

| # | Label | Expected | Result |
|---|-------|----------|--------|
| 6 | GET /api/admission-requests - no token | 401 | HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:41:27 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
}|
| 7 | GET /api/admission-requests - SYSTEM_ADMIN | 200 |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiODI2NTRlOWEtMWViMy00Y2EyLTgzODAtNDk2ODQ1NjMyOTRmIiwiaWF0IjoxNzc1Mjc3NzAyLCJleHAiOjE3NzUyNzg5MDJ9.t2ThIMQsrJRurMQsHcDo0bZYYr4ZTldGu3ChFpqpSq4
Content-Type: application/json; charset=utf-8
Content-Length: 5674
ETag: W/"162a-ugKIjksB1JCcdRZFPpOkowKpvek"
Date: Sat, 04 Apr 2026 04:41:42 GMT
Connection: close

{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "email": "admin@camp1.com",
      "desiredUsername": "admin_camp1",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "photoUrl": null,
      "declaredHealthLevel": null,
      "previousExperience": null,
      "physicalCondition": null,
      "declaredSkills": null,
      "healthLevelScore": null,
      "physicalConditionScore": null,
      "experienceYears": null,
      "skillsScore": null,
      "campId": 1,
      "status": "APPROVED",
      "suggestedOccupationId": null,
      "finalOccupationId": null,
      "occupationModified": false,
      "reviewedBy": null,
      "reviewDate": null,
      "rejectionReason": null,
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 2,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "email": "worker@camp1.com",
      "desiredUsername": "worker_camp1",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "photoUrl": null,
      "declaredHealthLevel": null,
      "previousExperience": null,
      "physicalCondition": null,
      "declaredSkills": null,
      "healthLevelScore": null,
      "physicalConditionScore": null,
      "experienceYears": null,
      "skillsScore": null,
      "campId": 1,
      "status": "APPROVED",
      "suggestedOccupationId": null,
      "finalOccupationId": null,
      "occupationModified": false,
      "reviewedBy": null,
      "reviewDate": null,
      "rejectionReason": null,
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 3,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "email": "resource@camp1.com",
      "desiredUsername": "resource_camp1",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "photoUrl": null,
      "declaredHealthLevel": null,
      "previousExperience": null,
      "physicalCondition": null,
      "declaredSkills": null,
      "healthLevelScore": null,
      "physicalConditionScore": null,
      "experienceYears": null,
      "skillsScore": null,
      "campId": 1,
      "status": "APPROVED",
      "suggestedOccupationId": null,
      "finalOccupationId": null,
      "occupationModified": false,
      "reviewedBy": null,
      "reviewDate": null,
      "rejectionReason": null,
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 4,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "email": "travel@camp1.com",
      "desiredUsername": "travel_camp1",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "photoUrl": null,
      "declaredHealthLevel": null,
      "previousExperience": null,
      "physicalCondition": null,
      "declaredSkills": null,
      "healthLevelScore": null,
      "physicalConditionScore": null,
      "experienceYears": null,
      "skillsScore": null,
      "campId": 1,
      "status": "APPROVED",
      "suggestedOccupationId": null,
      "finalOccupationId": null,
      "occupationModified": false,
      "reviewedBy": null,
      "reviewDate": null,
      "rejectionReason": null,
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 5,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "email": "visitor@camp1.com",
      "desiredUsername": "visitor_camp1",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "photoUrl": null,
      "declaredHealthLevel": null,
      "previousExperience": null,
      "physicalCondition": null,
      "declaredSkills": null,
      "healthLevelScore": null,
      "physicalConditionScore": null,
      "experienceYears": null,
      "skillsScore": null,
      "campId": 1,
      "status": "APPROVED",
      "suggestedOccupationId": null,
      "finalOccupationId": null,
      "occupationModified": false,
      "reviewedBy": null,
      "reviewDate": null,
      "rejectionReason": null,
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 6,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "email": "admin@camp2.com",
      "desiredUsername": "admin_camp2",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "photoUrl": null,
      "declaredHealthLevel": null,
      "previousExperience": null,
      "physicalCondition": null,
      "declaredSkills": null,
      "healthLevelScore": null,
      "physicalConditionScore": null,
      "experienceYears": null,
      "skillsScore": null,
      "campId": 2,
      "status": "APPROVED",
      "suggestedOccupationId": null,
      "finalOccupationId": null,
      "occupationModified": false,
      "reviewedBy": null,
      "reviewDate": null,
      "rejectionReason": null,
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 7,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "email": "admin@camp3.com",
      "desiredUsername": "admin_camp3",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "photoUrl": null,
      "declaredHealthLevel": null,
      "previousExperience": null,
      "physicalCondition": null,
      "declaredSkills": null,
      "healthLevelScore": null,
      "physicalConditionScore": null,
      "experienceYears": null,
      "skillsScore": null,
      "campId": 3,
      "status": "APPROVED",
      "suggestedOccupationId": null,
      "finalOccupationId": null,
      "occupationModified": false,
      "reviewedBy": null,
      "reviewDate": null,
      "rejectionReason": null,
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 8,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "email": "admin@camp4.com",
      "desiredUsername": "admin_camp4",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "photoUrl": null,
      "declaredHealthLevel": null,
      "previousExperience": null,
      "physicalCondition": null,
      "declaredSkills": null,
      "healthLevelScore": null,
      "physicalConditionScore": null,
      "experienceYears": null,
      "skillsScore": null,
      "campId": 4,
      "status": "APPROVED",
      "suggestedOccupationId": null,
      "finalOccupationId": null,
      "occupationModified": false,
      "reviewedBy": null,
      "reviewDate": null,
      "rejectionReason": null,
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 9,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "email": "admin@camp5.com",
      "desiredUsername": "admin_camp5",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "photoUrl": null,
      "declaredHealthLevel": null,
      "previousExperience": null,
      "physicalCondition": null,
      "declaredSkills": null,
      "healthLevelScore": null,
      "physicalConditionScore": null,
      "experienceYears": null,
      "skillsScore": null,
      "campId": 5,
      "status": "APPROVED",
      "suggestedOccupationId": null,
      "finalOccupationId": null,
      "occupationModified": false,
      "reviewedBy": null,
      "reviewDate": null,
      "rejectionReason": null,
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 9,
    "pages": 1
  }
} |
| 8 | GET /api/admission-requests - WORKER | 403 | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNDE0NWIyN2ItZTczNi00YmQzLTgzOTEtYjllZGFkZGNhZDIxIiwiaWF0IjoxNzc1Mjc3NzIwLCJleHAiOjE3NzUyNzg5MjB9.fQUZk-DAhefKj5c-MOkxiczNODJMpwX8oOsmvER6WAk
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:42:00 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 9 | GET /api/admission-requests - RESOURCE_MANAGEMENT | 403 | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjQ3MzhlNWIyLTE2M2MtNGExNy05NThlLTUwOWVlMTgwMmQ2NiIsImlhdCI6MTc3NTI3NzcyOCwiZXhwIjoxNzc1Mjc4OTI4fQ.pdwTijzalMcN7MWDX4D1ivwN1_uMB6WJECQ3U6TEqwk
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:42:08 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 10 | GET /api/admission-requests - TRAVEL_MANAGER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI5YzRmMDlmNi01MmY3LTQwNjMtOTA1Yi1jNGJkNDJlYTE1NzQiLCJpYXQiOjE3NzUyODg1ODUsImV4cCI6MTc3NTI4OTc4NX0.kSo5K4Yru7LFcXmkwplL5MDCKzbdfoqqTOeo2h6XeRM
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 07:43:05 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}
| 11 | GET /api/admission-requests - VISITOR | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImNhbXBJZCI6MSwicm9sIjoiVklTSVRPUiIsImp0aSI6ImZjMTg2OTcxLTc3ZDMtNDYzNy05N2QzLWQ3ZTA3NzU5NzVlZiIsImlhdCI6MTc3NTI3Nzc1NywiZXhwIjoxNzc1Mjc4OTU3fQ.lVSmbrMyyzTEXlpOrIlkuWKnux8jfd3vdTnxNgeMDuk
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:42:37 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 12 | GET /api/admission-requests/1 - no token | 401 |HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:42:46 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
} |
| 13 | GET /api/admission-requests/1 - SYSTEM_ADMIN | 200 | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMThiZjc1MTYtMGU4Ni00MzQyLWFjNmUtZmRiMTlmMTQ4ZjMyIiwiaWF0IjoxNzc1Mjc3Nzc0LCJleHAiOjE3NzUyNzg5NzR9.Xz2OJiWFlnD1wp8K4ka-JKstgmmNWBh-57T0261tadA
Content-Type: application/json; charset=utf-8
Content-Length: 643
ETag: W/"283-vqaNoR7BM5Psqarpeq0W9fEeKCI"
Date: Sat, 04 Apr 2026 04:42:54 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "name": "Camp",
    "lastName1": "Admin",
    "lastName2": null,
    "email": "admin@camp1.com",
    "desiredUsername": "admin_camp1",
    "birthDate": "1990-01-01",
    "gender": "MALE",
    "photoUrl": null,
    "declaredHealthLevel": null,
    "previousExperience": null,
    "physicalCondition": null,
    "declaredSkills": null,
    "healthLevelScore": null,
    "physicalConditionScore": null,
    "experienceYears": null,
    "skillsScore": null,
    "campId": 1,
    "status": "APPROVED",
    "suggestedOccupationId": null,
    "finalOccupationId": null,
    "occupationModified": false,
    "reviewedBy": null,
    "reviewDate": null,
    "rejectionReason": null,
    "createdAt": "2026-04-03T07:30:16.884Z",
    "updatedAt": "2026-04-03T07:30:16.884Z"
  }
}|
| 14 | GET /api/admission-requests/1 - WORKER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiOWVlMjA5ZGItZjM5NC00OWJmLWJmYTUtOTExZjc2YTcwNzRjIiwiaWF0IjoxNzc1Mjc3Nzg2LCJleHAiOjE3NzUyNzg5ODZ9.sOPh0qm6l4bh6YZm4l6QxZ_u1OICZ-erHqQaeVjGTE8
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:43:06 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 15 | GET /api/admission-requests/1 - RESOURCE_MANAGEMENT | 403 | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjFkZWIwYWI3LTY4MWItNDY3Mi05N2NjLWMzNmMwMDgyYTE2NCIsImlhdCI6MTc3NTI3Nzc5MywiZXhwIjoxNzc1Mjc4OTkzfQ._qWU-6uxp2eBjCqGCBGJCKlS9iOh6nIK6b5Dccqg0E0
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:43:13 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 16 | GET /api/admission-requests/1 - TRAVEL_MANAGER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiIzMzdkODNkMC1mOWNkLTQ3Y2YtYmNjNS01MThkYTQyNTY3M2UiLCJpYXQiOjE3NzUyODg2MjEsImV4cCI6MTc3NTI4OTgyMX0.DltK_8FdtDG7_sc66iXzkFe6vMFYoUzKQOl10EeHjwg
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 07:43:41 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 17 | GET /api/admission-requests/1 - VISITOR | 403 | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImNhbXBJZCI6MSwicm9sIjoiVklTSVRPUiIsImp0aSI6ImExZjU1OGIxLTlhOTgtNGQ3OC1iNzUzLTk3ZDFhODgwZGNhZCIsImlhdCI6MTc3NTI3NzgwOCwiZXhwIjoxNzc1Mjc5MDA4fQ.kVGPjqax2tpdsbQdnfULmazYIQpc8WJFA-GjaElxgAU
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:43:28 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 18 | GET /api/admission-requests/1/ai-features - no token | 401 | HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:43:38 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
}|
| 19 | GET /api/admission-requests/1/ai-features - SYSTEM_ADMIN | 200 | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiN2VkMDEyODAtZGYwMi00M2IyLTkzYzYtNWJhNzE2N2Y3ZTM3IiwiaWF0IjoxNzc1Mjc3ODI2LCJleHAiOjE3NzUyNzkwMjZ9.57cLvDSdALmTsKVHd-Et55uungHsWP-8SlyvlN4-xaU
Content-Type: application/json; charset=utf-8
Content-Length: 130
ETag: W/"82-HPDOGHRq+Zgq6y6AQBSr0HbXacs"
Date: Sat, 04 Apr 2026 04:43:46 GMT
Connection: close

{
  "success": true,
  "data": {
    "age_years": 36,
    "health_level_score": 5,
    "physical_condition_score": 5,
    "experience_years": 1,
    "skills_score": 0
  }
}|
| 20 | GET /api/admission-requests/1/ai-features - WORKER | 403 | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiYzM4NDQwMDUtYmZhMC00N2I5LTk5NDItMjY4OGI5MGYxZGFiIiwiaWF0IjoxNzc1Mjc3ODM0LCJleHAiOjE3NzUyNzkwMzR9.J3lBJ5GwG4aiIhrbfvCTyokDQNb3clEU6FQwOZ603OU
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:43:54 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 21 | GET /api/admission-requests/camps/1/pending - no token | 401 |HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:44:14 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
} |
| 22 | GET /api/admission-requests/camps/1/pending - SYSTEM_ADMIN | 200 |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNmRlNDM5NGYtMzg5NS00ZDY1LWE1ODgtNmVkY2ExOTBlYjk3IiwiaWF0IjoxNzc1Mjc3ODYyLCJleHAiOjE3NzUyNzkwNjJ9.bSdYYwBMVg8tbz6izbm7HF9scLQw5qWpcjrrbhcs-F4
Content-Type: application/json; charset=utf-8
Content-Length: 36
ETag: W/"24-AJZ8G18oW/SouOo5+DJE9SNYXUY"
Date: Sat, 04 Apr 2026 04:44:22 GMT
Connection: close

{
  "success": true,
  "data": [],
  "count": 0
} |
| 23 | GET /api/admission-requests/camps/1/pending - WORKER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiYzA3ZjBlZGItNmY4Yi00YTViLWJkOWQtMDRjMTM3ZWM1MmJkIiwiaWF0IjoxNzc1Mjc3ODczLCJleHAiOjE3NzUyNzkwNzN9.MDTs9STp2QM61HtkoHtv3Y_mIcT45sQe_1ef3UXt_f8
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:44:33 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 24 | POST /api/admission-requests - public no token | 200 or 400 | HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 704
ETag: W/"2c0-mTlrvGFT2nSGdPW5Zm7o16vrMCU"
Date: Sat, 04 Apr 2026 04:44:41 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 10,
    "name": "Test",
    "lastName1": "Applicant",
    "lastName2": null,
    "email": "test.applicant@test.com",
    "desiredUsername": "test_applicant",
    "birthDate": "1995-06-15T00:00:00.000Z",
    "gender": "MALE",
    "photoUrl": null,
    "declaredHealthLevel": null,
    "previousExperience": null,
    "physicalCondition": null,
    "declaredSkills": null,
    "healthLevelScore": 5,
    "physicalConditionScore": 5,
    "experienceYears": 1,
    "skillsScore": 0,
    "campId": 1,
    "status": "PENDING_AI",
    "suggestedOccupationId": null,
    "finalOccupationId": null,
    "occupationModified": false,
    "reviewedBy": null,
    "reviewDate": null,
    "rejectionReason": null,
    "createdAt": "2026-04-04T04:44:42.123Z",
    "updatedAt": "2026-04-04T04:44:42.123Z"
  },
  "message": "Request created successfully"
}|
| 25 | POST /api/admission-requests/1/process-ai - no token | 401 |HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:44:50 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
} |
| 26 | POST /api/admission-requests/1/process-ai - SYSTEM_ADMIN | 200 |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiOGI2N2Q4ZTEtMmY2Yi00MjZkLTg5ZGUtNDVhODMxMTI4ZDExIiwiaWF0IjoxNzc1Mjc3ODk3LCJleHAiOjE3NzUyNzkwOTd9.rMA_iAcHzC1ofm1nWzOdSUWFxaW7uw9HRYnkpMNq5dU
Content-Type: application/json; charset=utf-8
Content-Length: 115
ETag: W/"73-XFUxhSmMt1wInUwG/aYQOlu4Abs"
Date: Sat, 04 Apr 2026 04:44:57 GMT
Connection: close

{
  "message": [
    "decision must be one of the following values: ACCEPT, REJECT"
  ],
  "error": "Bad Request",
  "statusCode": 400
} |
| 27 | POST /api/admission-requests/1/process-ai - WORKER | 403 | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNDVlNTQ0MzAtZmUzZC00NDI5LTk2ZjQtNTYzOTM1NzViYjlkIiwiaWF0IjoxNzc1Mjc3OTA1LCJleHAiOjE3NzUyNzkxMDV9.vDDSYEXjZPR8-Ebv474ipSGLB3VgQjhG4H52W4ccm3I
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:45:05 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 28 | POST /api/admission-requests/1/review - no token | 401 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNDVlNTQ0MzAtZmUzZC00NDI5LTk2ZjQtNTYzOTM1NzViYjlkIiwiaWF0IjoxNzc1Mjc3OTA1LCJleHAiOjE3NzUyNzkxMDV9.vDDSYEXjZPR8-Ebv474ipSGLB3VgQjhG4H52W4ccm3I
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:45:05 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 29 | POST /api/admission-requests/1/review - SYSTEM_ADMIN | 200 | HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiZTFhMzUzZTEtMDZkMy00NGEyLWFjZmItZTQzZDQ3NmQxMmIwIiwiaWF0IjoxNzc1Mjc3OTE5LCJleHAiOjE3NzUyNzkxMTl9.W6MippmzDhJCXBS_AgHGMLpfHceWCydhM_8UTXRTKIo
Content-Type: application/json; charset=utf-8
Content-Length: 93
ETag: W/"5d-MPD/UEVVTcB/uxZ/k0YNtqWelEs"
Date: Sat, 04 Apr 2026 04:45:19 GMT
Connection: close

{
  "message": "This request is not pending admin review",
  "error": "Bad Request",
  "statusCode": 400
}|
| 30 | POST /api/admission-requests/1/review - WORKER | 403 | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiOTllZmQwMTAtOGQyOC00ZTM4LTgxZWUtODhkODIwZDU3NmIwIiwiaWF0IjoxNzc1Mjc3OTI5LCJleHAiOjE3NzUyNzkxMjl9.J5fZRHrtcXdD8QChC6_r6RwAO97xBCv21q6L_WR04lA
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:45:29 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 31 | PUT /api/admission-requests/1 - no token | 401 |HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:45:36 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
} |
| 32 | PUT /api/admission-requests/1 - SYSTEM_ADMIN | 200 |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiYTM5ODIwZDktNjgzNy00MTY4LWE3MjUtOWI2MzY2ZGFkMzcwIiwiaWF0IjoxNzc1Mjc3OTQ4LCJleHAiOjE3NzUyNzkxNDh9.iwbwFI6GorlWw_slQxjbobodcT5JaKo832sLHto4xew
Content-Type: application/json; charset=utf-8
Content-Length: 87
ETag: W/"57-fhga6Nd6jml4Zi4B+XMGIb768uY"
Date: Sat, 04 Apr 2026 04:45:48 GMT
Connection: close

{
  "message": [
    "property status should not exist"
  ],
  "error": "Bad Request",
  "statusCode": 400
} |
| 33 | PUT /api/admission-requests/1 - WORKER | 403 | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiYjcyMmE2MTUtNmM3YS00YWY2LTlhOWUtNmYyYTc2ZTYwYjU3IiwiaWF0IjoxNzc1Mjc3OTU1LCJleHAiOjE3NzUyNzkxNTV9.rgmrUOvQBqDote78ZJPikZWKGFOP4w4rg5v-AA5qcg4
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:45:55 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 34 | DELETE /api/admission-requests/1 - no token | 401 |HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:46:02 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
} |
| 35 | DELETE /api/admission-requests/1 - SYSTEM_ADMIN | 200 |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMzY0MTg1N2YtMzRmZi00YjdmLWI0MmUtYWI0NDY1ODNjYWY4IiwiaWF0IjoxNzc1Mjc3OTY5LCJleHAiOjE3NzUyNzkxNjl9.dsR3_6seZIwMfOsIMSbaMYHadjLS1_N0WO_WRuUo248
Content-Type: application/json; charset=utf-8
Content-Length: 86
ETag: W/"56-cML1rTUjAMSYRDggk4ON5jzNUa0"
Date: Sat, 04 Apr 2026 04:46:09 GMT
Connection: close

{
  "message": "Cannot delete an approved request",
  "error": "Bad Request",
  "statusCode": 400
} |
| 36 | DELETE /api/admission-requests/1 - WORKER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNzM3ZmFmYTMtMzhjNS00NWQ0LWI5ODEtNDMyZjZmZTA2OTE0IiwiaWF0IjoxNzc1Mjc3OTc1LCJleHAiOjE3NzUyNzkxNzV9.Qnu3Hm6PVu4HB9KUZhplg78I8kxd9Dne6G2qVaVM1p0
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:46:15 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |

## persons.http

| # | Label | Expected | Result |
|---|-------|----------|--------|
| 6 | GET /api/persons - no token | 401 |HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:47:48 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
} |
| 7 | GET /api/persons - SYSTEM_ADMIN | 200 |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNGJhZTZjZjgtODk5NS00ZGYyLWIzYzItN2JjNTdhZmI2OWUwIiwiaWF0IjoxNzc1Mjc4MDc1LCJleHAiOjE3NzUyNzkyNzV9.p-8tAS79LvwCLI5XllQpvuYHzSEE8Wg-FUu08xdnh8A
Content-Type: application/json; charset=utf-8
Content-Length: 3968
ETag: W/"f80-+RJxrD61SixAZNxIx+reaGoyne8"
Date: Sat, 04 Apr 2026 04:47:55 GMT
Connection: close

{
  "success": true,
  "data": [
    {
      "id": 1,
      "admissionRequestId": 1,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000001",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 2,
      "admissionRequestId": 2,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000001",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 3,
      "admissionRequestId": 3,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000002",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 4,
      "admissionRequestId": 4,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000003",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 5,
      "admissionRequestId": 5,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000004",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 6,
      "admissionRequestId": 6,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000002",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 2,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 7,
      "admissionRequestId": 7,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000003",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 3,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 8,
      "admissionRequestId": 8,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000004",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 4,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 9,
      "admissionRequestId": 9,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000005",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 5,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 9,
    "pages": 1
  }
} |
| 8 | GET /api/persons - WORKER | 200 |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiOWQzYTQxMWUtZTg1Yi00Y2E1LTg2ODAtYTA2NDRmMWExYjViIiwiaWF0IjoxNzc1Mjc4MDg4LCJleHAiOjE3NzUyNzkyODh9.uaMp0y_189oNiB3SVBMwQHKAt7y3-5lnCBS28VmdIRg
Content-Type: application/json; charset=utf-8
Content-Length: 3968
ETag: W/"f80-+RJxrD61SixAZNxIx+reaGoyne8"
Date: Sat, 04 Apr 2026 04:48:08 GMT
Connection: close

{
  "success": true,
  "data": [
    {
      "id": 1,
      "admissionRequestId": 1,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000001",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 2,
      "admissionRequestId": 2,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000001",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 3,
      "admissionRequestId": 3,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000002",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 4,
      "admissionRequestId": 4,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000003",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 5,
      "admissionRequestId": 5,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000004",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 6,
      "admissionRequestId": 6,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000002",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 2,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 7,
      "admissionRequestId": 7,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000003",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 3,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 8,
      "admissionRequestId": 8,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000004",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 4,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 9,
      "admissionRequestId": 9,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000005",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 5,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 9,
    "pages": 1
  }
} |
| 9 | GET /api/persons - RESOURCE_MANAGEMENT | 200 |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6ImQzNWUzNTQ2LTc3MTgtNDBlNC05Yzc5LTI4MjIxN2NjZTllNCIsImlhdCI6MTc3NTI4ODcyMywiZXhwIjoxNzc1Mjg5OTIzfQ.eOh1pMaW5NT_QNg33hILXX3_b8TqF6BFYCKdU6weKZo
Content-Type: application/json; charset=utf-8
Content-Length: 3968
ETag: W/"f80-W4i4BeuhmkV2x6lEItATA2Bx3mI"
Date: Sat, 04 Apr 2026 07:45:23 GMT
Connection: close

{
  "success": true,
  "data": [
    {
      "id": 1,
      "admissionRequestId": 1,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000001",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-04T07:32:41.796Z",
      "createdAt": "2026-04-04T07:32:41.796Z",
      "updatedAt": "2026-04-04T07:32:41.796Z"
    },
    {
      "id": 2,
      "admissionRequestId": 2,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000001",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-04T07:32:41.796Z",
      "createdAt": "2026-04-04T07:32:41.796Z",
      "updatedAt": "2026-04-04T07:32:41.796Z"
    },
    {
      "id": 3,
      "admissionRequestId": 3,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000002",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-04T07:32:41.796Z",
      "createdAt": "2026-04-04T07:32:41.796Z",
      "updatedAt": "2026-04-04T07:32:41.796Z"
    },
    {
      "id": 4,
      "admissionRequestId": 4,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000003",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-04T07:32:41.796Z",
      "createdAt": "2026-04-04T07:32:41.796Z",
      "updatedAt": "2026-04-04T07:32:41.796Z"
    },
    {
      "id": 5,
      "admissionRequestId": 5,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000004",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-04T07:32:41.796Z",
      "createdAt": "2026-04-04T07:32:41.796Z",
      "updatedAt": "2026-04-04T07:32:41.796Z"
    },
    {
      "id": 6,
      "admissionRequestId": 6,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000002",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 2,
      "occupationId": null,
      "entryDate": "2026-04-04T07:32:41.796Z",
      "createdAt": "2026-04-04T07:32:41.796Z",
      "updatedAt": "2026-04-04T07:32:41.796Z"
    },
    {
      "id": 7,
      "admissionRequestId": 7,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000003",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 3,
      "occupationId": null,
      "entryDate": "2026-04-04T07:32:41.796Z",
      "createdAt": "2026-04-04T07:32:41.796Z",
      "updatedAt": "2026-04-04T07:32:41.796Z"
    },
    {
      "id": 8,
      "admissionRequestId": 8,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000004",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 4,
      "occupationId": null,
      "entryDate": "2026-04-04T07:32:41.796Z",
      "createdAt": "2026-04-04T07:32:41.796Z",
      "updatedAt": "2026-04-04T07:32:41.796Z"
    },
    {
      "id": 9,
      "admissionRequestId": 9,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000005",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 5,
      "occupationId": null,
      "entryDate": "2026-04-04T07:32:41.796Z",
      "createdAt": "2026-04-04T07:32:41.796Z",
      "updatedAt": "2026-04-04T07:32:41.796Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 9,
    "pages": 1
  }
}
| 10 | GET /api/persons - TRAVEL_MANAGER | 200 |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI5ODk0YzkyOS01YTBkLTRmODgtOGE4NC0zN2U3NjkzODIxZDAiLCJpYXQiOjE3NzUyNzgxMTcsImV4cCI6MTc3NTI3OTMxN30.1M_gweDei97JtvnkN2DIzXb_-dXplaXCGk5NcdgIcgY
Content-Type: application/json; charset=utf-8
Content-Length: 3968
ETag: W/"f80-+RJxrD61SixAZNxIx+reaGoyne8"
Date: Sat, 04 Apr 2026 04:48:37 GMT
Connection: close

{
  "success": true,
  "data": [
    {
      "id": 1,
      "admissionRequestId": 1,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000001",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 2,
      "admissionRequestId": 2,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000001",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 3,
      "admissionRequestId": 3,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000002",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 4,
      "admissionRequestId": 4,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000003",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 5,
      "admissionRequestId": 5,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000004",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 6,
      "admissionRequestId": 6,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000002",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 2,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 7,
      "admissionRequestId": 7,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000003",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 3,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 8,
      "admissionRequestId": 8,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000004",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 4,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 9,
      "admissionRequestId": 9,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000005",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 5,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 9,
    "pages": 1
  }
} |
| 11 | GET /api/persons - VISITOR | 200 | HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImNhbXBJZCI6MSwicm9sIjoiVklTSVRPUiIsImp0aSI6ImJhNDcyMzViLTI1OGEtNDU5Ny1hYzJhLWM0NzIzMGFmOTRmMyIsImlhdCI6MTc3NTI3ODEyOSwiZXhwIjoxNzc1Mjc5MzI5fQ.OqA0YRuC_tf4MRKv4TjkJazYkgsoOb91asjkLZRpznI
Content-Type: application/json; charset=utf-8
Content-Length: 3968
ETag: W/"f80-+RJxrD61SixAZNxIx+reaGoyne8"
Date: Sat, 04 Apr 2026 04:48:49 GMT
Connection: close

{
  "success": true,
  "data": [
    {
      "id": 1,
      "admissionRequestId": 1,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000001",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 2,
      "admissionRequestId": 2,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000001",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 3,
      "admissionRequestId": 3,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000002",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 4,
      "admissionRequestId": 4,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000003",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 5,
      "admissionRequestId": 5,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "200000004",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 1,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 6,
      "admissionRequestId": 6,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000002",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 2,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 7,
      "admissionRequestId": 7,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000003",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 3,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 8,
      "admissionRequestId": 8,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000004",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 4,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    },
    {
      "id": 9,
      "admissionRequestId": 9,
      "name": "Camp",
      "lastName1": "Admin",
      "lastName2": null,
      "identificationNumber": "100000005",
      "birthDate": "1990-01-01",
      "gender": "MALE",
      "initialHealthLevel": null,
      "previousExperience": null,
      "physicalConditionAtEntry": null,
      "currentStatus": "ACTIVE",
      "imageUrl": null,
      "campId": 5,
      "occupationId": null,
      "entryDate": "2026-04-03T07:30:16.884Z",
      "createdAt": "2026-04-03T07:30:16.884Z",
      "updatedAt": "2026-04-03T07:30:16.884Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 9,
    "pages": 1
  }
}|
| 12 | GET /api/persons/1 - no token | 401 | HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:49:01 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
}|
| 13 | GET /api/persons/1 - SYSTEM_ADMIN | 200 |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiZTg2MTY4ZTctNzRhOS00ZWJmLTlmNTMtZmQ5ZGNjOGFjNjg2IiwiaWF0IjoxNzc1Mjc4MTUwLCJleHAiOjE3NzUyNzkzNTB9.2rJ1RmoXNpZkGaJrgv1ETe-Qc23pe1FxkxXbNgCLRlA
Content-Type: application/json; charset=utf-8
Content-Length: 455
ETag: W/"1c7-sQqjBsIm7tHsdgffAoQMZfLiv/I"
Date: Sat, 04 Apr 2026 04:49:10 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "admissionRequestId": 1,
    "name": "Camp",
    "lastName1": "Admin",
    "lastName2": null,
    "identificationNumber": "100000001",
    "birthDate": "1990-01-01",
    "gender": "MALE",
    "initialHealthLevel": null,
    "previousExperience": null,
    "physicalConditionAtEntry": null,
    "currentStatus": "ACTIVE",
    "imageUrl": null,
    "campId": 1,
    "occupationId": null,
    "entryDate": "2026-04-03T07:30:16.884Z",
    "createdAt": "2026-04-03T07:30:16.884Z",
    "updatedAt": "2026-04-03T07:30:16.884Z"
  }
} |
| 14 | GET /api/persons/1 - WORKER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiODE2Yzc5NWMtNWRiNS00YTEwLThiYjktN2U1NWQ5MmE1OTUxIiwiaWF0IjoxNzc1Mjc4MTU4LCJleHAiOjE3NzUyNzkzNTh9.MRw67ZbysyfmR9N47J91Gm3jvRNm38-IDafxE3g_lo0
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:49:18 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 15 | GET /api/persons/1 - RESOURCE_MANAGEMENT | 200 |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjdlZTkzMDVlLWE4ZjUtNDFkNy04N2YyLWY3YzlmMjQ5MTJmZSIsImlhdCI6MTc3NTI4ODc2NSwiZXhwIjoxNzc1Mjg5OTY1fQ.ijJ3J5Rs7C7I70BrjibW9Z0sR9W-2CCOGpQ8qlbZ_64
Content-Type: application/json; charset=utf-8
Content-Length: 455
ETag: W/"1c7-a2ln6fquYq7q3T8ztIF5Qb1qrDQ"
Date: Sat, 04 Apr 2026 07:46:05 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "admissionRequestId": 1,
    "name": "Camp",
    "lastName1": "Admin",
    "lastName2": null,
    "identificationNumber": "100000001",
    "birthDate": "1990-01-01",
    "gender": "MALE",
    "initialHealthLevel": null,
    "previousExperience": null,
    "physicalConditionAtEntry": null,
    "currentStatus": "ACTIVE",
    "imageUrl": null,
    "campId": 1,
    "occupationId": null,
    "entryDate": "2026-04-04T07:32:41.796Z",
    "createdAt": "2026-04-04T07:32:41.796Z",
    "updatedAt": "2026-04-04T07:32:41.796Z"
  }
} |
| 16 | GET /api/persons/1 - TRAVEL_MANAGER | 200 |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI1OGVlYzFjNi1lNjY4LTQwNDMtOTg1OS04MzgwN2E1NTkxZGEiLCJpYXQiOjE3NzUyNzgxNzMsImV4cCI6MTc3NTI3OTM3M30.aGjrZNtW5vyiOmCQWzZN_SKS4Ip3WhNKzTE0fuYxCR4
Content-Type: application/json; charset=utf-8
Content-Length: 455
ETag: W/"1c7-sQqjBsIm7tHsdgffAoQMZfLiv/I"
Date: Sat, 04 Apr 2026 04:49:33 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "admissionRequestId": 1,
    "name": "Camp",
    "lastName1": "Admin",
    "lastName2": null,
    "identificationNumber": "100000001",
    "birthDate": "1990-01-01",
    "gender": "MALE",
    "initialHealthLevel": null,
    "previousExperience": null,
    "physicalConditionAtEntry": null,
    "currentStatus": "ACTIVE",
    "imageUrl": null,
    "campId": 1,
    "occupationId": null,
    "entryDate": "2026-04-03T07:30:16.884Z",
    "createdAt": "2026-04-03T07:30:16.884Z",
    "updatedAt": "2026-04-03T07:30:16.884Z"
  }
} |
| 17 | GET /api/persons/1 - VISITOR | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImNhbXBJZCI6MSwicm9sIjoiVklTSVRPUiIsImp0aSI6IjRhMmRkZjA4LTJiNzItNGVhMS04ZDkyLTI1NDk0OWZiMDBkNCIsImlhdCI6MTc3NTI3ODE4MSwiZXhwIjoxNzc1Mjc5MzgxfQ.OriKBaU2ZCRmvJocIyajAvHwft1X0rlBSepO5WVsUQI
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:49:41 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 18 | POST /api/persons - no token | 401 | HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:49:49 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
}|
| 19 | POST /api/persons - SYSTEM_ADMIN | 403 | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMzVhNGFkZjctNWI1ZC00ZDNjLTkxZmEtMWViYTI5MzA2MTgxIiwiaWF0IjoxNzc1Mjc4MTk3LCJleHAiOjE3NzUyNzkzOTd9.4RWtaPiOW_Omqrxp_gUQoUHpcNWXvWCPAwxuqIf0z2I
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:49:57 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 20 | POST /api/persons - WORKER | 403 | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiYTM0NWZlNGUtZDRiMy00MWQxLWFlNjUtMjdhNWQyYzQyZmNhIiwiaWF0IjoxNzc1Mjc4MjE0LCJleHAiOjE3NzUyNzk0MTR9.nMM4e01wG23ni6uttsYOyfYo-hYcT9F8vJCUkNRK7QI
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:50:14 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 21 | PUT /api/persons/1 - no token | 401 |HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:50:20 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
} |
| 22 | PUT /api/persons/1 - SYSTEM_ADMIN | 200 |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiODdmZTE5YjMtMzZjMC00MGE1LWFlMjctY2JmYmUwZjljZGJlIiwiaWF0IjoxNzc1Mjc4MjI2LCJleHAiOjE3NzUyNzk0MjZ9.VXx3BxWSkTZxf2WAfsebIATlBEjEP4aXXNn2eVgeid4
Content-Type: application/json; charset=utf-8
Content-Length: 495
ETag: W/"1ef-pHsRRUy2bv8Sq+C1um3w2rbwkx8"
Date: Sat, 04 Apr 2026 04:50:26 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 1,
    "admissionRequestId": 1,
    "name": "Camp",
    "lastName1": "Admin",
    "lastName2": null,
    "identificationNumber": "100000001",
    "birthDate": "1990-01-01",
    "gender": "MALE",
    "initialHealthLevel": null,
    "previousExperience": null,
    "physicalConditionAtEntry": null,
    "currentStatus": "ACTIVE",
    "imageUrl": null,
    "campId": 1,
    "occupationId": null,
    "entryDate": "2026-04-03T07:30:16.884Z",
    "createdAt": "2026-04-03T07:30:16.884Z",
    "updatedAt": "2026-04-03T07:30:16.884Z"
  },
  "message": "Person updated successfully"
} |
| 23 | PUT /api/persons/1 - WORKER | 403 | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiY2I0MWI2YTAtYTZiZi00YTM3LWJmNTAtOGNiMzEwN2Y2Yzk5IiwiaWF0IjoxNzc1Mjc4MjM0LCJleHAiOjE3NzUyNzk0MzR9.hQQu99or2MdUBFSckKLzX7d0jOVQkSvtYlPgBMhAcF0
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:50:34 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 24 | PUT /api/persons/1 - RESOURCE_MANAGEMENT | 403 | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjZiZWQ5NDQ2LTI1OWYtNGZjNy1iZjVmLTE3ODU1MWMyM2MyMSIsImlhdCI6MTc3NTI4ODgxMiwiZXhwIjoxNzc1MjkwMDEyfQ.01W827XpaJYeKfTmykthr9GAk0qCX5wLbKl_rNP7dAA
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 07:46:52 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 25 | PUT /api/persons/1 - TRAVEL_MANAGER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJiZDZlZWYxNi02MjZhLTQ1N2EtYjRhYS0zMzJjYjUwZDFmNjAiLCJpYXQiOjE3NzUyNzgyNDksImV4cCI6MTc3NTI3OTQ0OX0.RVpw97tV9B6JIK7HxY_x1of1FEtIT4sZWW3aQqe1RMI
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:50:49 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 26 | PUT /api/persons/1 - VISITOR | 403 | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImNhbXBJZCI6MSwicm9sIjoiVklTSVRPUiIsImp0aSI6IjkxMjQ0ZmU3LTg3OWItNGVmYS05Nzc5LTRhZWZiYzQxZWE5OCIsImlhdCI6MTc3NTI3ODI1NywiZXhwIjoxNzc1Mjc5NDU3fQ.BRREOdfRdCIeekzoRwVYOqgzCajjqu0oi1V6cMB7plM
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:50:57 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 27 | DELETE /api/persons/1 - no token | 401 |HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:51:04 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
} |
| 28 | DELETE /api/persons/1 - SYSTEM_ADMIN | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiOTMwODk5YTUtNWFjMy00YWZmLWJkZGMtM2ZhMzY5MWJlNWEzIiwiaWF0IjoxNzc1Mjc4MjcwLCJleHAiOjE3NzUyNzk0NzB9.5j5KR3z4wHhEimDjmcwv6PUAPMpsSU-GpkAWomgW62g
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:51:10 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 29 | DELETE /api/persons/1 - WORKER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZWUyM2Q0YjEtYmY1My00MjVlLWJiOGUtNjRhZjMyNWFkZmM2IiwiaWF0IjoxNzc1Mjc4Mjc4LCJleHAiOjE3NzUyNzk0Nzh9.Ftpn1gEfeRXnReIfMDNJNjmN91Bw2Lx-HpCV1KQ-QCI
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:51:18 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |

## system-users.http

| # | Label | Expected | Result |
|---|-------|----------|--------|
| 6 | GET /api/users - no token | 401 |HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:53:17 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
} |
| 7 | GET /api/users - SYSTEM_ADMIN | 200 |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiOTAwNGNkZjQtMjFmNi00OWE4LWFjZjUtZWRmZjhhNjI2NGM4IiwiaWF0IjoxNzc1Mjc4NDAzLCJleHAiOjE3NzUyNzk2MDN9.ULR8iLBYdjmZ8hjjWpnUyja-8FuTqEEPbws1ydes8ps
Content-Type: application/json; charset=utf-8
Content-Length: 1957
ETag: W/"7a5-XowNRHqAm5EOgqWTPTxdQ3yiCGA"
Date: Sat, 04 Apr 2026 04:53:23 GMT
Connection: close

[
  {
    "id": 1,
    "personId": 1,
    "requestId": 1,
    "username": "admin_camp1",
    "email": "admin@camp1.com",
    "status": "ACTIVE",
    "role": "SYSTEM_ADMIN",
    "campId": 1,
    "createdAt": "2026-04-03T07:30:16.884Z",
    "updatedAt": "2026-04-03T07:30:16.884Z"
  },
  {
    "id": 2,
    "personId": 2,
    "requestId": 2,
    "username": "worker_camp1",
    "email": "worker@camp1.com",
    "status": "ACTIVE",
    "role": "WORKER",
    "campId": 1,
    "createdAt": "2026-04-03T07:30:16.884Z",
    "updatedAt": "2026-04-03T07:30:16.884Z"
  },
  {
    "id": 3,
    "personId": 3,
    "requestId": 3,
    "username": "resource_camp1",
    "email": "resource@camp1.com",
    "status": "ACTIVE",
    "role": "RESOURCE_MANAGEMENT",
    "campId": 1,
    "createdAt": "2026-04-03T07:30:16.884Z",
    "updatedAt": "2026-04-03T07:30:16.884Z"
  },
  {
    "id": 4,
    "personId": 4,
    "requestId": 4,
    "username": "travel_camp1",
    "email": "travel@camp1.com",
    "status": "ACTIVE",
    "role": "TRAVEL_MANAGER",
    "campId": 1,
    "createdAt": "2026-04-03T07:30:16.884Z",
    "updatedAt": "2026-04-03T07:30:16.884Z"
  },
  {
    "id": 5,
    "personId": 5,
    "requestId": 5,
    "username": "visitor_camp1",
    "email": "visitor@camp1.com",
    "status": "ACTIVE",
    "role": "VISITOR",
    "campId": 1,
    "createdAt": "2026-04-03T07:30:16.884Z",
    "updatedAt": "2026-04-03T07:30:16.884Z"
  },
  {
    "id": 6,
    "personId": 6,
    "requestId": 6,
    "username": "admin_camp2",
    "email": "admin@camp2.com",
    "status": "ACTIVE",
    "role": "SYSTEM_ADMIN",
    "campId": 2,
    "createdAt": "2026-04-03T07:30:16.884Z",
    "updatedAt": "2026-04-03T07:30:16.884Z"
  },
  {
    "id": 7,
    "personId": 7,
    "requestId": 7,
    "username": "admin_camp3",
    "email": "admin@camp3.com",
    "status": "ACTIVE",
    "role": "SYSTEM_ADMIN",
    "campId": 3,
    "createdAt": "2026-04-03T07:30:16.884Z",
    "updatedAt": "2026-04-03T07:30:16.884Z"
  },
  {
    "id": 8,
    "personId": 8,
    "requestId": 8,
    "username": "admin_camp4",
    "email": "admin@camp4.com",
    "status": "ACTIVE",
    "role": "SYSTEM_ADMIN",
    "campId": 4,
    "createdAt": "2026-04-03T07:30:16.884Z",
    "updatedAt": "2026-04-03T07:30:16.884Z"
  },
  {
    "id": 9,
    "personId": 9,
    "requestId": 9,
    "username": "admin_camp5",
    "email": "admin@camp5.com",
    "status": "ACTIVE",
    "role": "SYSTEM_ADMIN",
    "campId": 5,
    "createdAt": "2026-04-03T07:30:16.884Z",
    "updatedAt": "2026-04-03T07:30:16.884Z"
  }
] |
| 8 | GET /api/users - WORKER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiMzVlYjc3ZDUtMzExOS00ZGMxLWIyMDQtOGZiY2I3ODMwNzQ3IiwiaWF0IjoxNzc1Mjg4ODY3LCJleHAiOjE3NzUyOTAwNjd9.TmKYlo6xYMWt_Vh9yEY2s4lNxCPApSBYDAL3t_ET5eI
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 07:47:47 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 9 | GET /api/users - RESOURCE_MANAGEMENT | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjlkYTZhMzc0LTZjODEtNDUwZi1iYWVkLWU5NTIyMTc4YjYyZiIsImlhdCI6MTc3NTI3ODQxOSwiZXhwIjoxNzc1Mjc5NjE5fQ.5MSa2ijS-hePgEO88XVgc3OJBn_s0vdESk5EXoicfm8
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:53:39 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 10 | GET /api/users - TRAVEL_MANAGER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI5MWJiODYzZS00M2U1LTQ4OTctOTYwZi00YmQxZmQ3ZjNlZWIiLCJpYXQiOjE3NzUyNzg0MjYsImV4cCI6MTc3NTI3OTYyNn0.c8y1izVi-_MXwkfU9pZgkA8LB8pwQ2dXlsALPuheR1g
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:53:46 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 11 | GET /api/users - VISITOR | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImNhbXBJZCI6MSwicm9sIjoiVklTSVRPUiIsImp0aSI6Ijg3YmE5Mzc1LTFhNmItNDI4Zi04ZDhhLWUxY2FkOWJlY2YxMyIsImlhdCI6MTc3NTI3ODQzMSwiZXhwIjoxNzc1Mjc5NjMxfQ.GSegx3mDn_pHEgbYxiptUnXIPUEAUMX6Wb-POb3gyzA
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:53:51 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 12 | GET /api/users/1 - no token | 401 |HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:53:59 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
} |
| 13 | GET /api/users/1 - SYSTEM_ADMIN | 200 |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiN2E2NmI0OGItMTkzMy00N2MxLWJjMTUtMDdlZTk5ZTIxZDg0IiwiaWF0IjoxNzc1Mjc4NDQ1LCJleHAiOjE3NzUyNzk2NDV9.KNA4u--HIHVx8Rd9LQwUFeARUh_ixIqQC8PNFRIsASg
Content-Type: application/json; charset=utf-8
Content-Length: 215
ETag: W/"d7-zU0cgCTk0CVSUF1kgMY6nZOvLEM"
Date: Sat, 04 Apr 2026 04:54:05 GMT
Connection: close

{
  "id": 1,
  "personId": 1,
  "requestId": 1,
  "username": "admin_camp1",
  "email": "admin@camp1.com",
  "status": "ACTIVE",
  "role": "SYSTEM_ADMIN",
  "campId": 1,
  "createdAt": "2026-04-03T07:30:16.884Z",
  "updatedAt": "2026-04-03T07:30:16.884Z"
} |
| 14 | GET /api/users/1 - WORKER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiN2Y4ZjJjNmItM2RiNS00YjI0LTlhZmMtM2MzZGY5ZTEwYzRjIiwiaWF0IjoxNzc1Mjg4OTIzLCJleHAiOjE3NzUyOTAxMjN9.yRKWqML78Vtjh2NVf5IcSXb0UWXq2hNntNM0p_q8e4w
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 07:48:43 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|
| 15 | GET /api/users/1 - RESOURCE_MANAGEMENT | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjUwZmM5ZmQ0LTk5ZGEtNDQzMy1hNzZjLTViYmQ4MjkwMzkwYyIsImlhdCI6MTc3NTI3ODQ2MCwiZXhwIjoxNzc1Mjc5NjYwfQ.XirkVBERof1Kn4RgJGSrlFMSw4T-gPwDBn2IBsVfbAE
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:54:20 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 16 | GET /api/users/1 - TRAVEL_MANAGER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJjYTc1MzVkNS1kNDFiLTQ0M2QtOWJlNy1iMTY1NWU0ODUwZTMiLCJpYXQiOjE3NzUyNzg0NjgsImV4cCI6MTc3NTI3OTY2OH0.pb4cpgoMc4WJAEW2RGrhP5Q2v6W66c5VyPoMtpvAoNU
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:54:28 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 17 | GET /api/users/1 - VISITOR | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImNhbXBJZCI6MSwicm9sIjoiVklTSVRPUiIsImp0aSI6IjhiN2UzZmNlLTQzNzctNGU0ZS1iMzYxLTYzNzNkMjRjOGU4OCIsImlhdCI6MTc3NTI3ODQ3NCwiZXhwIjoxNzc1Mjc5Njc0fQ.bG0xfQHp3VpbINcst70ZTNOGJHVn5CspFMGCX5TXuPQ
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:54:34 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 18 | POST /api/users - no token | 401 | HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:54:41 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
}|
| 19 | POST /api/users - SYSTEM_ADMIN | 200 or 201 |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiM2ZmMGFlOGItNTQwYi00Y2FlLWI4YzktNDU3MjIwYjdkN2QwIiwiaWF0IjoxNzc1Mjc4NDg3LCJleHAiOjE3NzUyNzk2ODd9.hBt9bsa5iRvten4mrrmzBcj_oc05TonWOekz_17G9wo
Content-Type: application/json; charset=utf-8
Content-Length: 124
ETag: W/"7c-5cqqKoYhMvlrfBH4bDm2r4jLqAA"
Date: Sat, 04 Apr 2026 04:54:47 GMT
Connection: close

{
  "message": "duplicate key value violates unique constraint \"uq_usuario_solicitud\"",
  "error": "Bad Request",
  "statusCode": 400
} |
| 20 | POST /api/users - WORKER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZTkxZTI3YWItMzczZi00YmM2LWJhMWYtZmM5MDZkNmM3YWIzIiwiaWF0IjoxNzc1Mjg4OTUxLCJleHAiOjE3NzUyOTAxNTF9.ImB6183UmWp_RdJYYIeYkWngUazYTwN4mn4lYXI3ft8
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 07:49:11 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 21 | PUT /api/users/1 - no token | 401 | HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 04:55:01 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
}|
| 22 | PUT /api/users/1 - SYSTEM_ADMIN | 200 |HTTP/1.1 400 Bad Request
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiMGU5MzJmOGQtZWQxZC00ZWRiLWExY2EtMmJjZjczYjFiODM0IiwiaWF0IjoxNzc1Mjc4NTEyLCJleHAiOjE3NzUyNzk3MTJ9.V6q_B5A7YV657ywID4TxAgCauxX80G_oLkKFxjHzUvw
Content-Type: application/json; charset=utf-8
Content-Length: 120
ETag: W/"78-ZD6OQjbuBaFuFe9KC12dNa4LZ0s"
Date: Sat, 04 Apr 2026 04:55:12 GMT
Connection: close

{
  "message": [
    "property role should not exist",
    "property status should not exist"
  ],
  "error": "Bad Request",
  "statusCode": 400
} |
| 23 | PUT /api/users/1 - WORKER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiODk5YWM0YzgtOWU0Yi00Y2QzLWFlMjAtMGI2ODdkNzZhYjNiIiwiaWF0IjoxNzc1Mjg4OTc3LCJleHAiOjE3NzUyOTAxNzd9.mk0r6CcSpgTAzX7AO8A6OxkTRhCV_8a_t4dbkrfFaeQ
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 07:49:37 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 24 | PUT /api/users/1 - RESOURCE_MANAGEMENT | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjFhYjJkM2JlLWZhODEtNDg3NC1iZWY2LTZiN2FkNzUwNGI4YiIsImlhdCI6MTc3NTI3ODUzMSwiZXhwIjoxNzc1Mjc5NzMxfQ.yZ0HEueAo7CzDI_PE-1P6WngEqbyhQxtVUSnoL1lRN0
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:55:31 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 25 | PUT /api/users/1 - TRAVEL_MANAGER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiI0NGNiZGMzOC1lNDI1LTQ4MWUtYTE5ZS1iM2U2Mzc5OTdhMzUiLCJpYXQiOjE3NzUyNzg1MzgsImV4cCI6MTc3NTI3OTczOH0.Q-TDDaJvDEchNHk9fknYh3fT4RPt0EE3yps-0wo4sIw
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:55:38 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 26 | PUT /api/users/1 - VISITOR | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImNhbXBJZCI6MSwicm9sIjoiVklTSVRPUiIsImp0aSI6IjYzMmU5ZDYwLWMzZjItNGRjZC1hMjBiLTU0ZDIzYmZmNmJiMiIsImlhdCI6MTc3NTI3ODU0NSwiZXhwIjoxNzc1Mjc5NzQ1fQ.a8EFa8QovchisL2fuH6Bquu3qDiU3F1OcDGzjQ1o_B4
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 04:55:45 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
} |
| 27 | DELETE /api/users/5 - no token | 401 | HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-2vXyz+1H9rroAw0aLZPxS6Lp+cw"
Date: Sat, 04 Apr 2026 07:49:59 GMT
Connection: close

{
  "message": "Token requerido",
  "error": "Unauthorized",
  "statusCode": 401
}|
| 28 | DELETE /api/users/5 - SYSTEM_ADMIN | 200 |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiZDMwZWMxMmMtOGEzMi00ZjEwLTlhODEtMDQyYWFiYTVjYWNlIiwiaWF0IjoxNzc1Mjg5MDM0LCJleHAiOjE3NzUyOTAyMzR9.TuxKneMoodh4PLujI4Ji1O4ePSBvUo2CJ8VknSe6rv4
Content-Type: application/json; charset=utf-8
Content-Length: 217
ETag: W/"d9-nzou+rRUGX8/agyjxo8m3orquwo"
Date: Sat, 04 Apr 2026 07:50:34 GMT
Connection: close

{
  "id": 1,
  "personId": 1,
  "requestId": 1,
  "username": "admin_camp1",
  "email": "admin@camp1.com",
  "status": "INACTIVE",
  "role": "SYSTEM_ADMIN",
  "campId": 1,
  "createdAt": "2026-04-04T07:32:41.796Z",
  "updatedAt": "2026-04-04T07:50:34.695Z"
} |
| 29 | DELETE /api/users/5 - WORKER | 403 |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiM2Q3NWU5ZTYtNjc1OC00NDg0LTg4M2EtZDcyNDRhY2ZiODZkIiwiaWF0IjoxNzc1Mjg5MDYzLCJleHAiOjE3NzUyOTAyNjN9.c6KAG_Nwo5HyJJjQ2G6I2ezHTcH1xmoFrCnra5zZFaQ
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Sat, 04 Apr 2026 07:51:03 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}|