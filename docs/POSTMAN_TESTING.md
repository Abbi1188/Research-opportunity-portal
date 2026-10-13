# Postman Testing Guide – Research Opportunity Portal

This guide shows how to test the backend API with Postman. It covers exactly what the assignment (Section 6) requires.

Base URL: `http://localhost:5000/api`

## 1. Before You Start

1. Set up MySQL using `database/schema.sql`.
2. Start the backend (`cd backend`, `npm install`, `npm start`).
3. Open Postman.

## 2. Import the Collection

1. Click **Import**.
2. Choose `postman/Research_Opportunity_Portal.postman_collection.json`.
3. The collection "Research Opportunity Portal" appears with 10 requests.
4. Variable `baseUrl` is already set to `http://localhost:5000/api`. Change it only if your port is different.

## 3. Run the Tests

Send the requests **in order, top to bottom** (or click **Run collection**). Requests 1–3 save the new IDs automatically, so the later requests use them.

| # | Request                          | Method | URL                       | Expected status |
|---|----------------------------------|--------|---------------------------|-----------------|
| 1 | Create Opportunity 1             | POST   | /opportunities            | 201 Created     |
| 2 | Create Opportunity 2             | POST   | /opportunities            | 201 Created     |
| 3 | Create Opportunity 3             | POST   | /opportunities            | 201 Created     |
| 4 | Get All Opportunities            | GET    | /opportunities            | 200 OK          |
| 5 | Get One Opportunity              | GET    | /opportunities/:id        | 200 OK          |
| 6 | Update Opportunity               | PUT    | /opportunities/:id        | 200 OK          |
| 7 | Change Status Open to Closed     | PUT    | /opportunities/:id        | 200 OK          |
| 8 | Delete Opportunity               | DELETE | /opportunities/:id        | 200 OK          |
| 9 | Get Deleted Opportunity          | GET    | /opportunities/:id        | 404 Not Found   |
| 10| Create with Missing Data         | POST   | /opportunities            | 400 Bad Request |

Each request has a test. After sending, open the **Test Results** tab: green = passed, red = failed.

## 4. Request Body (POST and PUT)

Select **Body → raw → JSON**:

```json
{
  "title": "AI for Medical Imaging",
  "description": "Research on detecting diseases from medical scans.",
  "research_area": "Artificial Intelligence",
  "faculty_name": "Dr. Ayesha Khan",
  "department": "Computer Science",
  "required_skills": "Python, Machine Learning",
  "available_positions": 2,
  "application_deadline": "2026-12-15",
  "status": "Open"
}
```

To close an opportunity, send a PUT with the same body and `"status": "Closed"`.

## 5. What the Assignment Requires You to Show

- [ ] Create at least three research opportunities (requests 1–3)
- [ ] Retrieve all research opportunities (request 4)
- [ ] Retrieve one opportunity using its ID (request 5)
- [ ] Update an existing opportunity (request 6)
- [ ] Change status from Open to Closed (request 7)
- [ ] Delete an opportunity (request 8)
- [ ] Request the deleted opportunity again to show 404 Not Found (request 9)
- [ ] Send one request with invalid or missing data to show 400 Bad Request (request 10)

## 6. Export the Collection

1. Right-click the collection (or click the three dots).
2. Choose **Export**.
3. Select **Collection v2.1** and save.
4. Put the exported file in the `postman/` folder, the GitHub repository, and the submission ZIP.

## 7. Common Problems

| Problem                      | Fix                                                        |
|------------------------------|------------------------------------------------------------|
| Could not get response       | Backend is not running, or the port in `baseUrl` is wrong  |
| 500 Internal Server Error    | Check MySQL is running and `.env` details are correct      |
| Requests 5–9 use empty id    | Run requests 1–3 first so the IDs are saved                |
| Test shows red               | Check the status code and response body in Postman        |
