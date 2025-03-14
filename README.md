# P4SBU
## Group 6: Dane Meister, Michael Lieberman, Kalyani Thayil, Jaret McManus

### Running Program
#### Clone repository
git clone https://github.com/michaelliebs/SBU06-P4SBU.git

cd p4sbu

#### Setup Server Environment
Create a .env file inside of /server directory with the following content (after setting up PostgreSQL on your local device)

DB_USER=

DB_PASSWORD=

DB_HOST=localhost

DB_NAME=p4sbu

DB_TEST_NAME=p4sbu_test

DB_PROD_NAME=p4sbu_prod

DB_PORT=5432

PORT=8000

This file configures database access. Ensure PostgreSQL is running and a database named p4sbu is created.

#### Install Dependencies
Navigate to both the server and client folders and install dependencies.

For Server:

cd server

npm install


For Client:

cd ../client

npm install

#### Setup Database
Make sure PostgreSQL is running before proceeding.

Run the following commands in order to prime database:

1: Sync the Database Schema

node server/sync.js

2: Populate Parking Lots

node server/populate_db/populateParkingLots.js

3: Populate Buildings

node server/populate_db/populateBuildings.js

#### Start the Server
cd server

npm start

The backend should now be running on http://localhost:8000.

#### Start the Frontend
cd client

npm start

The frontend should now be running on http://localhost:3000.

#### API Endpoints
You can test endpoints using Postman to confirm they work as expected.

- GET /api/buildings → Returns a list of all buildings.
- GET /api/parking-lots → Returns a list of all parking lots.
- GET /api/wayfinding/:buildingId → Returns parking lots sorted by distance from a selected building.

