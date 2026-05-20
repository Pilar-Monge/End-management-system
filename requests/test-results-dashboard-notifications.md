# Block 4 Verification - Notifications & Dashboard RBAC Test Results

### Notifications RBAC
| # | Label | Expected | Result |
|---|-------|----------|--------|
| 1 | POST `/api/notifications` - Admin creates | 201 Created |HTTP/1.1 201 Created
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNzMxNDRlYWMtY2RhNi00ZTM5LWFjYjctYTVhYzk3MTIxYzRjIiwiaWF0IjoxNzc1NjM0MTcwLCJleHAiOjE3NzU2MzUzNzB9.DZTzmO2fc4JDW6ai6Tn3a2D4D4xFVo8K4DbQIa2L7aA
Content-Type: application/json; charset=utf-8
Content-Length: 353
ETag: W/"161-KzVDeCNRjbF1zQmgWrjvH1SQYKI"
Date: Wed, 08 Apr 2026 07:42:50 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 5,
    "campId": 1,
    "userId": null,
    "targetRole": "WORKER",
    "type": "INVENTORY_ALERT",
    "title": "RBAC notification test",
    "message": "Admin-created notification for RBAC validation",
    "read": false,
    "createdDate": "2026-04-06T00:00:00.000Z",
    "readDate": null,
    "sourceType": "RBAC_TEST",
    "sourceId": null
  },
  "message": "Notification created successfully"
}


 |
| 2 | POST `/api/notifications` - Worker attempts | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiZmVmYTMwYWMtYTc3Mi00ZmY3LTkyOGMtNGYzYWM5ZjhkMDMyIiwiaWF0IjoxNzc1NjM0MjI0LCJleHAiOjE3NzU2MzU0MjR9.yzd8c-34Zhc3BbFCtjYnPHKua4zyrIA5Mi7pSsfdXAE
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Wed, 08 Apr 2026 07:43:44 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}


 |
| 3 | GET `/api/notifications` - Worker gets all | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNTg5MjdjYzItYTZhMC00Y2M3LWFmZGEtYmU5OTc1YjQ4MWQ2IiwiaWF0IjoxNzc1NjM0MjM4LCJleHAiOjE3NzU2MzU0Mzh9.lz_MwSq5DeaICVQqtpUuGByziFAryb1K42FV603niPk
Content-Type: application/json; charset=utf-8
Content-Length: 1215
ETag: W/"4bf-ETGRjirZWuZNUk/X/OAfxXWAm+4"
Date: Wed, 08 Apr 2026 07:43:58 GMT
Connection: close

{
  "success": true,
  "data": [
    {
      "id": 2,
      "campId": 1,
      "userId": null,
      "targetRole": "WORKER",
      "type": "INVENTORY_ALERT",
      "title": "RBAC notification test",
      "message": "Admin-created notification for RBAC validation",
      "read": false,
      "createdDate": "2026-04-06T00:00:00.000Z",
      "readDate": null,
      "sourceType": "RBAC_TEST",
      "sourceId": null
    },
    {
      "id": 3,
      "campId": 1,
      "userId": null,
      "targetRole": "WORKER",
      "type": "INVENTORY_ALERT",
      "title": "RBAC notification test",
      "message": "Admin-created notification for RBAC validation",
      "read": false,
      "createdDate": "2026-04-06T00:00:00.000Z",
      "readDate": null,
      "sourceType": "RBAC_TEST",
      "sourceId": null
    },
    {
      "id": 4,
      "campId": 1,
      "userId": null,
      "targetRole": "WORKER",
      "type": "INVENTORY_ALERT",
      "title": "RBAC notification test",
      "message": "Admin-created notification for RBAC validation",
      "read": true,
      "createdDate": "2026-04-06T00:00:00.000Z",
      "readDate": null,
      "sourceType": "RBAC_TEST",
      "sourceId": null
    },
    {
      "id": 5,
      "campId": 1,
      "userId": null,
      "targetRole": "WORKER",
      "type": "INVENTORY_ALERT",
      "title": "RBAC notification test",
      "message": "Admin-created notification for RBAC validation",
      "read": false,
      "createdDate": "2026-04-06T00:00:00.000Z",
      "readDate": null,
      "sourceType": "RBAC_TEST",
      "sourceId": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "pages": 1
  }
}


 |
| 4 | PUT `/api/notifications/{{notificationId}}` - Worker (Own) | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNmU3MzAyZTktZjRlNS00YzRlLThjZjItOTgyN2JkOTBjMDllIiwiaWF0IjoxNzc1NjM0MjU5LCJleHAiOjE3NzU2MzU0NTl9.LcHfEyXLil_7gbt8Ut_dfbrAFfVPwTNMGdUpzxZHYgg
Content-Type: application/json; charset=utf-8
Content-Length: 374
ETag: W/"176-TZ8mnm93jck6/dQBe6HdIdhRqU0"
Date: Wed, 08 Apr 2026 07:44:19 GMT
Connection: close

{
  "success": true,
  "data": {
    "id": 5,
    "campId": 1,
    "userId": null,
    "targetRole": "WORKER",
    "type": "INVENTORY_ALERT",
    "title": "RBAC notification test",
    "message": "Admin-created notification for RBAC validation",
    "read": true,
    "createdDate": "2026-04-06T00:00:00.000Z",
    "readDate": "2026-04-08T07:44:19.125Z",
    "sourceType": "RBAC_TEST",
    "sourceId": null
  },
  "message": "Notification updated successfully"
}


 |
| 5 | PUT `/api/notifications/999999` - Worker (Other's) | 403 Forbidden / 404 Not Found |HTTP/1.1 404 Not Found
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiNmJkMWQwNmEtNTQ4ZS00YWNhLWI4NzEtN2M2YzIxYTMwODFlIiwiaWF0IjoxNzc1NjM0Mjc2LCJleHAiOjE3NzU2MzU0NzZ9.Cz4ZmxVAHd3yykGrGJjIpbpwYXYfWR9YoXq_dOJ5hOA
Content-Type: application/json; charset=utf-8
Content-Length: 73
ETag: W/"49-dx2fq2gr/JHo0UhU3/lAJmcxiLU"
Date: Wed, 08 Apr 2026 07:44:36 GMT
Connection: close

{
  "message": "Notification not found",
  "error": "Not Found",
  "statusCode": 404
}

|
| 6 | DELETE `/api/notifications/{{notificationId}}` - Admin deletes | 403 Forbidden | HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiNTJmZmNhNDItMDFmYS00Y2U5LTkwZTYtMTRhNDBjZTk4NzE2IiwiaWF0IjoxNzc1NjM0Mjg1LCJleHAiOjE3NzU2MzU0ODV9.EYI2NQxuSshzNARLyC_PV80f7tun5M3t9vs4KBWnExs
Content-Type: application/json; charset=utf-8
Content-Length: 132
ETag: W/"84-I/m/2feg0Dkz58Cmq9c5ZRH67IE"
Date: Wed, 08 Apr 2026 07:44:45 GMT
Connection: close

{
  "message": "Deleting notifications is strictly disabled for auditing and compliance purposes.",
  "error": "Forbidden",
  "statusCode": 403
}

|

### Dashboard RBAC
| # | Label | Expected | Result |
|---|-------|----------|--------|
| 7 | GET `/api/dashboard/general` - Admin | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIiwianRpIjoiZTgxZWJiYWYtMmNlMC00YWJlLTljNDYtZjM2ZTQxMDZhYjVmIiwiaWF0IjoxNzc1NjM0NDg1LCJleHAiOjE3NzU2MzU2ODV9.D2gZxIukwsY2Edw9iRk7ECneIIczQSRLhKQCuKVLkt4
Content-Type: application/json; charset=utf-8
Content-Length: 112
ETag: W/"70-E+uJ27KJBQ3QRzYHtTWY1szKdd0"
Date: Wed, 08 Apr 2026 07:48:05 GMT
Connection: close

{
  "success": true,
  "data": {
    "generalStats": {
      "unreadNotifications": 2,
      "totalPersons": 5,
      "pendingAdmissionRequests": 0
    }
  }
}

 |
| 8 | GET `/api/dashboard/general` - Worker | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNhbXBJZCI6MSwicm9sIjoiV09SS0VSIiwianRpIjoiOWRmMGNlNzktNTgzNC00ZDU2LTkzZWItZDM0ODM4ZjQ0ZDk5IiwiaWF0IjoxNzc1NjM0NTA3LCJleHAiOjE3NzU2MzU3MDd9.zIrsy3navzKSibUhTWup4ml4NSb2a06AaTSv3zPygC8
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Wed, 08 Apr 2026 07:48:27 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}


 |
| 9 | GET `/api/dashboard/inventory` - Resource Management | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImNhbXBJZCI6MSwicm9sIjoiUkVTT1VSQ0VfTUFOQUdFTUVOVCIsImp0aSI6IjgxMTI5Y2ZjLWQxNjgtNDZhYy04MTQ3LTBjOTU5MDFmMjYwNCIsImlhdCI6MTc3NTYzNDU3NywiZXhwIjoxNzc1NjM1Nzc3fQ.2ueaYhEy8cTtutPvZotahIWFwQsBnEywHcvh4c8-wXY
Content-Type: application/json; charset=utf-8
Content-Length: 745
ETag: W/"2e9-Ku1o2Wl1CGhqzxS3A28Q2vz+mA4"
Date: Wed, 08 Apr 2026 07:49:37 GMT
Connection: close

{
  "success": true,
  "data": {
    "inventoryData": {
      "resources": [
        {
          "resourceName": "Drinking Water",
          "currentAmount": 200
        },
        {
          "resourceName": "Canned Food",
          "currentAmount": 100
        },
        {
          "resourceName": "Medical Kit",
          "currentAmount": 20
        },
        {
          "resourceName": "Hygiene Kit",
          "currentAmount": 30
        },
        {
          "resourceName": "Ammunition",
          "currentAmount": 500
        },
        {
          "resourceName": "Tactical Helmet",
          "currentAmount": 15
        },
        {
          "resourceName": "Bulletproof Vest",
          "currentAmount": 10
        }
      ],
      "criticalStockCount": 0
    },
    "consumptionTrend": [
      {
        "date": "2026-04-02",
        "totalConsumed": 0
      },
      {
        "date": "2026-04-03",
        "totalConsumed": 0
      },
      {
        "date": "2026-04-04",
        "totalConsumed": 0
      },
      {
        "date": "2026-04-05",
        "totalConsumed": 0
      },
      {
        "date": "2026-04-06",
        "totalConsumed": 0
      },
      {
        "date": "2026-04-07",
        "totalConsumed": 0
      },
      {
        "date": "2026-04-08",
        "totalConsumed": 0
      }
    ]
  }
}


 |
| 10 | GET `/api/dashboard/inventory` - Worker | 403 Forbidden |HTTP/1.1 403 Forbidden
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImNhbXBJZCI6MSwicm9sIjoiVklTSVRPUiIsImp0aSI6IjNhY2VmNmFiLWU4OGMtNGE4Ny1iODUxLWM5M2ZkMzgxMDI4YSIsImlhdCI6MTc3NTYzNDU5OSwiZXhwIjoxNzc1NjM1Nzk5fQ.xiZTEjoSzKBdMN9kao88yZ90QyLVpF_Y4q--k5WIqlU
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-wK7V5D6iOEHIy1gWu+lx9ptqUbQ"
Date: Wed, 08 Apr 2026 07:49:59 GMT
Connection: close

{
  "message": "Acceso denegado",
  "error": "Forbidden",
  "statusCode": 403
}

 |
| 11 | GET `/api/dashboard/expeditions` - Travel Manager | 200 OK |HTTP/1.1 200 OK
X-Powered-By: Express
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImNhbXBJZCI6MSwicm9sIjoiVFJBVkVMX01BTkFHRVIiLCJqdGkiOiJlMzlhNzA5Zi1kN2UyLTQ2ODQtOTllOC1jNzUwYTA0YmE4OGIiLCJpYXQiOjE3NzU2MzQ2MDgsImV4cCI6MTc3NTYzNTgwOH0.NVEhAePLp_nZ1W29-8M8jRSz7gW_TFE2hIYjUVV4Ab8
Content-Type: application/json; charset=utf-8
Content-Length: 85
ETag: W/"55-ML/K8gkoSXJEfm/bD1ZfRWE3xa0"
Date: Wed, 08 Apr 2026 07:50:09 GMT
Connection: close

{
  "success": true,
  "data": {
    "expeditionStatus": {
      "PLANNED": 0,
      "COMPLETED": 0,
      "CANCELED": 0
    }
  }
}

