# Inter Finder - Backend

## Setup Instructions

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file based on `.env.team`
4. Run the app:
   ```bash
   npm run dev


## Environment Variables

Create a `.env` file in the root with the following:

  - `MONGO_URI=your_mongodb_connection_string`
  - `JWT_SECRET=your_super_secret_key`
  - `PORT=5000`

## API Endpoints

- **Auth**
  - `POST /api/auth/register/intern` — Register as intern
  - `POST /api/auth/register/client` — Register as client

- **Listings**
  - `POST /api/listings/` — Create listing (client only)
  - `PUT /api/listings/:id` — Edit listing (client only)
  - `DELETE /api/listings/:id` — Delete listing (client only)

- **Applications**
  - `POST /api/applications/:id/apply` — Intern applies to a listing

- **Feedback**
  - `POST /api/feedback/` — Client submits feedback for intern

- **Dashboard**
  - `GET /api/dashboard/intern/:id` — Intern dashboard
  - `GET /api/dashboard/client/:id` — Client dashboard

## Security

- Never commit your `.env` file or secrets to version control.
- Use a strong, unique JWT secret.

## Development

- Use `npm run dev` for development (nodemon).
- Use `npm start` for production.
---

If you want, I can update the README.md and add a sample validation to your registration route. Let me know if you want both or just one!

## Mark Application as Completed

PATCH /api/applications/:id/complete

- Marks an application as completed.
- If the application is for a **free** internship, feedback must be submitted before completion. If not, the API returns HTTP 400 with the message: "Feedback is mandatory for free internships before completion."
- For **paid** internships, feedback is optional and not required for completion.

**Request:**
- Auth required
- :id = Application ID

**Response:**
- 200 OK with updated application if successful
- 400 Bad Request if feedback is missing for free internships
