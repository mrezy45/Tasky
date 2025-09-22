TASKY
Tasky is a simple task management app. It lets users create, view, edit, and delete tasks with a clean UI.

Table of Contents
Features
Technologies Used
Setup & Run Instructions
Notes on AI Usage
Future Improvements

Features

Create a new task with a title, description, due date, etc.
View a list of all tasks.
Edit existing tasks.
Delete tasks.
Mark tasks as completed / toggle status.
Basic validation (e.g., required fields).
(If your implementation includes any of the following, add them: user authentication, categories/tags, search/filtering, notifications, reminders, priority levels, etc.)

Technologies Used

Frontend: e.g. HTML, CSS, Javascript
Backend: Express 
Database: PostgreSQL
Styling / UI library: CSS 
Other tools / dependencies: e.g. axios (for HTTP), cors, 

Setup & Run Instructions

These instructions assume you have the prerequisites installed: Node.js (version X or newer), npm / yarn, and a database if required.
Clone the repository
git clone https://github.com/mrezy45/Tasky.git
cd Tasky
Install dependencies
npm install
# or
yarn install
Set up environment variables
Create a .env file (if required)
Add necessary variables, e.g.:
PORT=3000
DATABASE_URL=your_database_connection_string
JWT_SECRET=some_secret

Set up the database

If you are using a local DB, ensure it's running.
Run migrations / seed data if applicable.

Run the app

npm start
# or for development with hot reload
npm run dev


Open in browser
Visit http://localhost:3000 (or whatever the port is) to access Tasky.

Notes on AI Usage (Tools & Contexts)

Used AI tools ChatGPT, GitHub Copilot
The AI assisted in writing boilerplate, generating code snippets, debuging
For what purpose: e.g. accelerating development, learning, prototyping.

Future Improvements

Implement filtering / sorting by due date, priority, status.
Add notifications or reminders (email, push).
Improve UI/UX, mobile responsiveness.
Add tests (unit, integration).
