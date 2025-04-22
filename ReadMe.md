# Fifty-Fifty : Splitwise Application - Expense Sharing and Settlement App

A web application that allows users to create groups, add members, share expenses, and settle balances. Inspired by Splitwise, this app includes features like individual expense tracking, group-based balance calculation, and approval-based settlement between members.

## Live URL
This project runs locally. Frontend on `localhost:5500/5501`, backend on `localhost:8090`.

##  Features

### Core Functionality
- **User Authentication** with JWT
- **Group Management**
  - Create groups
- **Expense Tracking**
  - Add expenses to groups
  - View individual shares
- **Balance Calculation**
  - Real-time balance tracking across groups
- **Settlement Workflow**
  - Users can send **approval requests** for settling balances
  - Recipient can **approve or reject** the request
  - Settlements only complete after approval

### UI Pages
- Dashboard with user balances
- Group expense history
- Approval Requests List
- Settle Up with approval prompt

---

## Tech Stack

### Frontend
- HTML, CSS, JavaScript

### Backend
- Java + Spring Boot
- PostgreSQL database
- JWT for authentication

---

## API Endpoints

### User
- `POST /users/signup` – Register a new user
- `POST /users/login` – Authenticate and get JWT

### Group
- `GET /groups/user/${userId}` - List all the groups of the current user
- `POST /groups` – Create new group
- `POST /group-members/${groupId}/${userId}` – Add user to group
- `GET /group-members/${groupId}` - Get all the members of the group

### Expense
- `POST /expenses` – Add expense
- `GET /expenses/group/${groupId}` – Get all expenses for a group

### Settlement
- `POST /expenses/send-approval-request/{payeeId}?payerId={payerId}` – Send a settlement approval request
- `POST /expenses/approve-settlement/{payeeId}?payerId={payerId}` – Approve a settlement request
- `GET /expenses/approve-requests/{userId}` – Fetch pending requests for approval

---

## How to Run Locally

### Backend
1. Clone the backend repo
2. Update `application.properties` with your PostgreSQL DB details
3. Run the Spring Boot application on port `8090`

### Frontend
1. Serve your `index.html` using VS Code Live Server or any web server
2. Ensure your frontend fetches from `localhost:8090` backend

---

##  Authentication

This project uses JWT stored in `localStorage`. All protected routes require the `Authorization: Bearer <token>` header.

