# Getting Started 

1 - npm install
2 - change the credentials on .env file if wants execute on localhost
3 - npm run migrate && npm run migrate seed
4 -
  local: serverless offline
  deploy: serverless deploy

URL for test:
FE: https://main.drvn5r210lwsu.amplifyapp.com


BE Serverless Dashboard: https://app.serverless.com/pereirapy/apps/sweatworks-app/sweatworks/dev/us-east-1
BE End-point: https://3zxe02fc86.execute-api.us-east-1.amazonaws.com/dev/  

Somes explanations:
- The database on AWS RDS is open to WorldWide to be easier access and make changes
- The CORS is allow everthing for the same reason

## Available Scripts

In the project directory, you can run:

### `npm test`

Launches the test runner

### `npm run migrate`

Will create all Tables

### `npm run seed`

Will insert some data in all tables

