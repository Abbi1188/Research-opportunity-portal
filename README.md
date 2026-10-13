# University Research Opportunity Portal

A web application where faculty members can post, view, update, and manage research opportunities in one place.


## Project Structure

```
research-opportunity-portal/
├── backend/            Node.js REST API
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── config/db.js
│       ├── routes/opportunityRoutes.js
│       ├── controllers/opportunityController.js
│       └── middleware/validateOpportunity.js
├── frontend/           HTML, CSS, JavaScript, Bootstrap
│   ├── index.html
│   ├── css/style.css
│   └── js/ (api.js, validation.js, ui.js, app.js)
├── database/schema.sql MySQL schema
├── postman/            Exported Postman collection
├── docs/               PRD, tech stack, Postman guide, project documentation
├── README.md
└── .gitignore
```

## Prerequisites

- Node.js 20.6 or newer
- MySQL
- Internet connection (Bootstrap is loaded from a CDN link)

## Setup and Run

1. **Create the database** (run once). In PowerShell (Windows):
   ```powershell
   Get-Content database\schema.sql | mysql -u root -p
   ```
   On macOS/Linux or Command Prompt:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
2. **Start the backend:**
   ```bash
   cd backend
   npm install
   copy .env.example .env     # Windows  (macOS/Linux: cp .env.example .env)
   ```
   Open `.env` and enter your own MySQL username and password, then:
   ```bash
   npm start
   ```
   You should see `Server running on http://localhost:5000` and `Connected to MySQL database`.
3. **Open the frontend:** go to **http://localhost:5000** in your browser.
   (Opening `frontend/index.html` directly also works while the backend is running.)

## API Endpoints

| Method | Endpoint                 | Description                   | Success |
|--------|--------------------------|-------------------------------|---------|
| POST   | /api/opportunities       | Create an opportunity         | 201     |
| GET    | /api/opportunities       | Get all opportunities         | 200     |
| GET    | /api/opportunities/:id   | Get one opportunity           | 200     |
| PUT    | /api/opportunities/:id   | Update an opportunity         | 200     |
| DELETE | /api/opportunities/:id   | Delete an opportunity         | 200     |

Errors: 400 Bad Request (invalid or missing data), 404 Not Found (unknown ID), 500 Internal Server Error.

Success responses look like `{ "message": "...", "data": ... }`. Error responses look like `{ "error": "..." }`.

## Testing with Postman

1. Start the backend.
2. In Postman click **Import** and choose `postman/Research_Opportunity_Portal.postman_collection.json`.
3. Run the 10 requests in order (or use **Run collection**). Details are in `docs/POSTMAN_TESTING.md`.

## Demonstration Video

<!-- paste video link here -->

## Notes

No credentials are uploaded. Use `.env.example` as a template for your own `.env`.
