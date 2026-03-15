#!/bin/sh
# entrypoint.sh

echo "Running Database Migrations and Seeding..."
npx prisma db push --accept-data-loss
npx prisma db seed

echo "Starting Backend Application..."
exec npm run dev
