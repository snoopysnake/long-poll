# Long Polling Demo

React frontend - [`poll-app/`](/poll-app)

Node Express backend - [`poll-server/`](/poll-server)

PostgreSQL database connection settings in [`poll-server/.env`](/poll-server/.env)

Run PostgreSQL locally as a docker container with [`poll-server/setup.sh`](/poll-server/setup.sh)

Deploy to OpenShift with [`deploy.sh`](/deploy.sh)

## Run Locally

Modify the [`poll-server/.env`](/poll-server/.env) based on your configuration, comment
the line that says `PGHOST='long-poll-db'` and uncomment `PGHOST='localhost'`

Run the DB container (docker needs to be running first)

```terminal
poll-server/setup.sh
```

Check to make sure it's running with `docker ps`

Install dependencies and run the backend

```terminal
cd poll-server
npm install
npm start
```

Modify [`url.js`](/poll-app/src/service/url.js) to use `localhost` instead of `long-poll-db`

Repeat for frontend

```terminal
cd poll-app
npm install
npm start
```

By default frontend is accessible at <http://localhost:3000>

Backend at <http://localhost:8000>

## Deploy to OpenShift

First login with the OpenShift CLI

```terminal
oc login -u <username> https://api.ocpigspr2021.daviddonley.com:6443
```

Make sure you are logged into your desired project

```terminal
oc project <project>
```

Modify the [`poll-server/.env`](/poll-server/.env) file to use your desired username and
password (do not commit to GitHub). Don't change `PGHOST` because that will break
everything.

Run the [`deploy.sh`](/deploy.sh) script to setup frontend, database, and backend
components all at once.
