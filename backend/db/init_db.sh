#!/bin/bash
# This script initializes the database with the schema

# Get the directory where the script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if PGPASSWORD is set, if not, use default
if [ -z "$PGPASSWORD" ]; then
  export PGPASSWORD="mysecretpassword"
fi

# Database connection parameters
PGUSER=${PGUSER:-postgres}
PGHOST=${PGHOST:-localhost}
PGDATABASE=${PGDATABASE:-hayloft_woodshed}
PGPORT=${PGPORT:-5432}

echo "Creating database if it doesn't exist..."
psql -U "$PGUSER" -h "$PGHOST" -p "$PGPORT" -c "CREATE DATABASE $PGDATABASE;" postgres || true

echo "Initializing database schema..."
psql -U "$PGUSER" -h "$PGHOST" -p "$PGPORT" -d "$PGDATABASE" -f "$DIR/init.sql"

echo "Database initialization complete."
