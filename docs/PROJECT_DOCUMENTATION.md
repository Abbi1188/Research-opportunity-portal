# University Research Opportunity Portal – Project Documentation

This document explains the whole project: the scenario, backend, database, frontend (including its design), testing, GitHub, and submission. Everything here comes from the assignment.

---

## 1. Scenario

The university shares research opportunities through emails, WhatsApp groups, and noticeboards. Because information is scattered, students miss opportunities and faculty find it hard to manage their openings.

The solution is a **Research Opportunity Portal** where faculty members can **post, view, update, and manage** research opportunities in one place.

The project is a complete web application made of:
1. a backend REST API,
2. a MySQL database,
3. a simple frontend interface.

It is an **individual** assignment.

---

## 2. Technologies Used

| Part      | Technology                                   |
|-----------|----------------------------------------------|
| Backend   | JavaScript / Node.js (with Express and mysql2 packages) |
| Database  | MySQL                                        |
| Frontend  | HTML, CSS, JavaScript, Bootstrap             |
| Testing   | Postman                            |
| Repository| Git and GitHub                               |

---

## 3. Folder Structure

```
research-opportunity-portal/
├── backend/
│   ├── src/
│   │   ├── config/db.js                         MySQL connection
│   │   ├── routes/opportunityRoutes.js          the 5 endpoints
│   │   ├── controllers/opportunityController.js CRUD logic using the database
│   │   └── middleware/validateOpportunity.js    input validation (400 errors)
│   ├── server.js                                starts the server
│   ├── package.json
│   └── .env.example                             template only, no real passwords
├── frontend/
│   ├── css/style.css
│   ├── js/
│   │   ├── api.js                               fetch calls to the REST API
│   │   ├── validation.js                        required-field checks
│   │   ├── ui.js                                rendering and messages
│   │   └── app.js                               connects everything
│   └── index.html
├── database/schema.sql                          creates the table
├── postman/                                     exported Postman/Bruno collection
├── docs/
│   ├── TECH_STACK.md
│   └── PROJECT_DOCUMENTATION.md
├── README.md
└── .gitignore
```

---

## 4. Database

**Database name:** `research_portal`  **Table:** `opportunities`

| Field                 | Type                     | Meaning                           |
|-----------------------|--------------------------|-----------------------------------|
| id                    | INT, auto-increment, PK  | Unique ID                         |
| title                 | VARCHAR(255)             | Research title                    |
| description           | TEXT                     | Research description              |
| research_area         | VARCHAR(150)             | Research area                     |
| faculty_name          | VARCHAR(150)             | Faculty member's name             |
| department            | VARCHAR(150)             | Department                        |
| required_skills       | VARCHAR(500)             | Required skills                   |
| available_positions   | INT                      | Number of available positions     |
| application_deadline  | DATE                     | Application deadline              |
| status                | ENUM('Open','Closed')    | Status (default Open)             |

The setup script is `database/schema.sql`. **All CRUD operations use the database. No data is hard-coded.**

---

## 5. Backend (REST API)

The backend lets faculty members perform CRUD operations on research opportunities.

### 5.1 Endpoints

| # | Operation                      | Method | URL                         |
|---|--------------------------------|--------|-----------------------------|
| 1 | Create a research opportunity  | POST   | /api/opportunities          |
| 2 | Retrieve all opportunities     | GET    | /api/opportunities          |
| 3 | Retrieve one opportunity       | GET    | /api/opportunities/:id      |
| 4 | Update an opportunity          | PUT    | /api/opportunities/:id      |
| 5 | Delete an opportunity          | DELETE | /api/opportunities/:id      |

1. **Create** – stores a new opportunity in the database.
2. **Retrieve all** – returns every opportunity stored in the database.
3. **Retrieve one** – returns the complete details of one opportunity by its ID.
4. **Update** – changes an existing opportunity (title, required skills, available positions, application deadline, or status).
5. **Delete** – removes an opportunity posted by mistake or no longer required.

### 5.2 HTTP Status Codes

| Code | Meaning                | When it is returned                                          |
|------|------------------------|--------------------------------------------------------------|
| 200  | OK                     | Successful GET, PUT, and DELETE                              |
| 201  | Created                | Successful POST                                              |
| 400  | Bad Request            | Missing or invalid data (e.g., empty title, bad status)      |
| 404  | Not Found              | No opportunity with the given ID                             |
| 500  | Internal Server Error  | Unexpected server or database error                          |

### 5.3 Example request body (POST / PUT)

```json
{
  "title": "AI for Medical Imaging",
  "description": "Research on detecting diseases from scans.",
  "research_area": "Artificial Intelligence",
  "faculty_name": "Dr. Ayesha Khan",
  "department": "Computer Science",
  "required_skills": "Python, Machine Learning",
  "available_positions": 2,
  "application_deadline": "2026-12-15",
  "status": "Open"
}
```

### 5.4 Credentials

Database settings are placed in a local `.env` file (copied from `.env.example`). The `.env` file is listed in `.gitignore` and is **never uploaded**.

---

## 6. Frontend

A **simple, clean, and functional** interface that talks to the backend only through the REST API. **Data is not hard-coded** in the frontend.

### 6.1 Required Functionality

| Requirement                                              | How the frontend provides it                                   |
|----------------------------------------------------------|----------------------------------------------------------------|
| Display all available research opportunities             | Home section lists every opportunity from `GET /api/opportunities` |
| Display complete details of a selected opportunity       | "View" button opens a details panel using `GET /api/opportunities/:id` |
| Form for creating a new opportunity                      | "Add Opportunity" form sends `POST /api/opportunities`         |
| Option to update an existing opportunity                 | "Edit" button fills the form and sends `PUT /api/opportunities/:id` |
| Change status from Open to Closed                        | "Close" button sends `PUT` with status = Closed                |
| Option to delete an opportunity                          | "Delete" button (with confirmation) sends `DELETE`             |
| Success and error messages                               | Bootstrap alerts shown after every action                      |
| Basic validation for required form fields                | `validation.js` checks fields before the request is sent       |

### 6.2 Frontend Design

The design is intentionally simple, using Bootstrap components only.

**Layout (single page, `index.html`)**
1. **Navbar** – portal title "University Research Opportunity Portal" and an "Add Opportunity" button.
2. **Message area** – a Bootstrap alert under the navbar (green for success, red for error); disappears after a few seconds.
3. **Opportunities list** – Bootstrap cards (or a table) in a responsive grid. Each card shows: title, research area, faculty name, department, positions, deadline, and a colored **status badge** (green = Open, grey/red = Closed).
4. **Card buttons** – View, Edit, Close (shown only when Open), Delete.
5. **Details view** – a Bootstrap modal showing all fields of the selected opportunity.
6. **Form** – a Bootstrap modal/form with fields: title, description, research area, faculty name, department, required skills, available positions, application deadline, status. Used for both Create and Update.
7. **Delete confirmation** – a small confirm step before deleting.

**Style choices**
- Bootstrap 5 (loaded from its CDN link or a local copy) for grid, cards, forms, buttons, badges, modals, alerts.
- `style.css` only for small tweaks (spacing, card hover, page background).
- White/light background, one primary color for buttons, readable font sizes, responsive on phone and desktop.

**Colors for status badge**
- Open → green
- Closed → grey

### 6.3 Frontend Validation

Before sending data, `validation.js` checks that:
- title, description, research area, faculty name, department, and required skills are not empty;
- available positions is a number greater than 0;
- application deadline is selected;
- status is Open or Closed.

Invalid fields are highlighted with Bootstrap's invalid style and a short message. The backend validates again and returns **400** if needed; that error is also shown to the user.

### 6.4 Frontend Files

| File             | Role                                                               |
|------------------|--------------------------------------------------------------------|
| `index.html`     | Page structure, Bootstrap link, modals, containers                 |
| `css/style.css`  | Small custom styles                                                |
| `js/api.js`      | `fetch` calls for the five endpoints                               |
| `js/validation.js` | Required-field validation                                        |
| `js/ui.js`       | Draw cards, fill details/form, show success and error alerts       |
| `js/app.js`      | Page load, button clicks, form submit; connects the other files    |

---

## 7. Postman or Bruno Testing

The completed backend must be tested with Postman or Bruno. The testing demonstration must include:

1. Creating **at least three** research opportunities.
2. Retrieving all research opportunities.
3. Retrieving one opportunity using its ID.
4. Updating an existing opportunity.
5. Changing an opportunity's status from Open to Closed.
6. Deleting an opportunity.
7. Requesting the deleted opportunity again to show **404 Not Found**.
8. Sending one request with invalid or missing data to show **400 Bad Request** (input validation).

Export the collection and save it in the `postman/` folder, the GitHub repository, and the ZIP.

---

## 8. One-Minute Demonstration Video

The video must be about one minute and **must not exceed one minute**. It must show:

- the backend server running;
- the frontend application running;
- creating a research opportunity through the application;
- retrieving and displaying stored opportunities;
- updating an opportunity;
- closing an opportunity;
- deleting an opportunity;
- at least one validation error or 404 Not Found error;
- API requests and responses in Postman or Bruno.

---

## 9. GitHub Repository

- Create a GitHub repository for the assignment.
- It must contain: backend source code, frontend source code, database schema/setup files, README.md, and the exported Postman/Bruno collection.
- Make **meaningful commits** during development, not one big commit at the end (for example: "Add database schema", "Add create endpoint", "Add get endpoints", "Add update and delete", "Add frontend list page", "Add form validation", "Add Postman collection").
- The repository must be **accessible to the instructor** at submission time.
- The repository link must be written in `README.md` and submitted with the assignment. Example:
  `https://github.com/username/research-opportunity-portal`
- **Do not upload** database passwords, API keys, environment variables, personal access tokens, or other credentials.

---

## 10. README.md Contents

The README must allow anyone to run the project. It contains:
- project description and the GitHub repository link;
- folder structure;
- prerequisites (Node.js, MySQL);
- database setup steps;
- backend setup and run steps;
- frontend run steps;
- API endpoint list;
- how to import the Postman/Bruno collection.

---

## 11. Submission Requirements

Submit **one ZIP file** named:

`P24_0000_NAME_CLASS.zip`

It must contain:
- complete frontend and backend source code;
- database setup/schema;
- exported Postman or Bruno collection;
- README.md with setup and run instructions;
- GitHub repository link;
- one-minute demonstration video or video link.

---

## 12. Important Instructions (Checklist)

- [ ] This is an individual assignment.
- [ ] Both frontend and backend are completed.
- [ ] All CRUD operations use the database.
- [ ] No hard-coded data.
- [ ] The project runs using the instructions in README.md.
- [ ] GitHub repository is accessible to the instructor.
- [ ] No passwords, API keys, or other credentials uploaded.
- [ ] Demonstration video does not exceed one minute.
- [ ] Work is original; copied or plagiarized work may receive zero marks.

---

## 13. Suggested Order of Work

1. Create the GitHub repository and commit the folder structure.
2. Create `database/schema.sql` and set up MySQL.
3. Build the backend: connection, routes, controller, validation.
4. Test every endpoint in Postman/Bruno and export the collection.
5. Build the frontend: page layout, list, details, form, edit, close, delete.
6. Add frontend validation and success/error messages.
7. Test the full application together.
8. Finish README.md and add the GitHub link.
9. Record the one-minute video.
10. Create the ZIP with the correct name and submit.
