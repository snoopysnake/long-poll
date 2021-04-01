#!/usr/bin/env bash
source poll-server/.env

echo "Deploying frontend."
oc new-app https://github.com/snoopysnake/long-poll.git \
  --name='long-poll-frontend' \
  --context-dir='poll-app'

oc patch svc long-poll-frontend --type=json --patch="$(cat 'frontend-svc-patch.json')"
oc expose svc/long-poll-frontend --port='3000'

echo "Deploying database."
oc new-app postgresql-persistent \
  -p DATABASE_SERVICE_NAME="$PGHOST" \
  -p POSTGRESQL_DATABASE="$PGDATABASE" \
  -p POSTGRESQL_USER="$PGUSER" \
  -p POSTGRESQL_PASSWORD="$PGPASSWORD"

# Wait until long-poll-db pod is running
echo "Waiting for DB pod to be ready"
while [[ $(oc get pods -l name=$PGHOST -o 'jsonpath={..status.conditions[?(@.type=="Ready")].status}') != "True" ]]; do
  echo "." && sleep 2
done

db_pod=$(oc get pods -l name=$PGHOST -o custom-columns=POD:.metadata.name --no-headers)
tar cf - poll-server/db.sql | oc exec -i "$db_pod" -- tar xf - -C /tmp
oc exec "$db_pod" -- env PGPASSWORD=$PGPASSWORD psql -U $PGUSER -c "CREATE DATABASE $PGDATABASE;" 2>/dev/null
oc exec "$db_pod" -- env PGPASSWORD=$PGPASSWORD psql -d $PGDATABASE -U $PGUSER -f /tmp/poll-server/db.sql

# Setup backend
oc new-app https://github.com/snoopysnake/long-poll.git \
  --name='long-poll-backend' \
  --context-'dir=poll-server' \
  -e PGHOST="$PGHOST" \
  -e PGDATABASE="$PGDATABASE"

# Patch the backend Deployment to add PGUSER and PGPASSWORD from the Secret created by
# oc new-app postgresql-persistent
oc patch svc long-poll-backend --type=json --patch="$(cat 'backend-svc-patch.json')"
oc patch deployment long-poll-backend --type=json --patch="$(cat 'backend-d-patch.json')"

# create backend route if you want to test the backend API out of cluster
# oc expose svc/long-poll-backend --port='8000'