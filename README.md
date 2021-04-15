# Getting Started 

1 - npm install
2 - change the credentials on .env file if you wants execute on localhost or to execute tests(the current value is for version online)
3 - execute the following code if you want execute on localhost(online is not necessary): npm run migrate && npm run migrate seed
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
- I did not use Redux because it has been over two years since I last used it and I have unfortunately run out of time to go back and learn it. I was also not familiar with the serverless framework at AWS and had to spend quite a bit of time studying it to be able to use it.

## Available Scripts

In the project directory, you can run:

### `npm run test`

Launches the test runner for both unit test and end-to-end

### `npm run migrate`

Will create all Tables

### `npm run seed`

Will insert some data in all tables

