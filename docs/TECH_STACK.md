# Tech Stack – University Research Opportunity Portal

Only technologies allowed by the assignment (Section 4) are used.

| Layer          | Technology                | Source in assignment            |
|----------------|---------------------------|---------------------------------|
| Backend        | JavaScript / Node.js      | 4.1 Backend                     |
| Database       | MySQL                     | 4.2 Database                    |
| Frontend       | HTML, CSS, JavaScript, Bootstrap | 4.3 Frontend             |
| API testing    | Postman or Bruno          | Section 6                       |
| Version control| Git and GitHub            | Section 5                       |

## Backend
- **Node.js** runs the REST API.
- **Express** (npm package) provides the routes for the five endpoints under `/api/opportunities`.
- **mysql2** (npm package) connects Node.js to MySQL. All CRUD operations use the database.
- Database login details are kept in a local `.env` file that is not uploaded to GitHub.
- Status codes: 200, 201, 400, 404, 500.

## Database
- **MySQL** with one table, `opportunities`: id, title, description, research_area, faculty_name, department, required_skills, available_positions, application_deadline, status (Open/Closed).
- Setup file: `database/schema.sql`.

## Frontend
- **HTML** for the page structure.
- **CSS** and **Bootstrap** for a simple, clean layout.
- **JavaScript** (`fetch`) to call the REST API. No hard-coded data.
- Features: list, details, create form, update, Open→Closed, delete, success/error messages, required-field validation.

## Tools
- **Postman or Bruno** to test the API and export the collection to `postman/`.
- **Git and GitHub** for the repository with meaningful commits.

## Deliverables Mapping

| Requirement                         | Location                |
|-------------------------------------|-------------------------|
| Backend source code                 | `backend/`              |
| Frontend source code                | `frontend/`             |
| Database schema                     | `database/schema.sql`   |
| Postman/Bruno collection            | `postman/`              |
| README with setup and GitHub link   | `README.md`             |
| ZIP name                            | `P24_0000_NAME_CLASS.zip` |
