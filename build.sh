#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "### Building frontend ###"
cd frontend
npm install
npm run build
cd ..

echo "### Building admin-dashboard ###"
cd admin-dashboard
npm install
npm run build
cd ..

echo "### Combining build artifacts ###"
rm -rf build # Remove old build directory if it exists
mv frontend/build ./build
mkdir -p ./build/admin
mv admin-dashboard/build/* ./build/admin/