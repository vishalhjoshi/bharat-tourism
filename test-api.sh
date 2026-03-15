#!/bin/bash

# Base URL
API_URL="http://localhost:5000/api"

echo "---------------------------------------------------------"
echo "Starting Automated API Tests for Travel Booking Backend..."
echo "---------------------------------------------------------"

echo -e "\n1. Testing Auth: Register User"
REGISTER_RES=$(curl -s -X POST "$API_URL/auth/register" -H "Content-Type: application/json" -d '{ "name": "ApiTester", "email": "tester@example.com", "password": "password123", "phone": "1234567890" }')
echo $REGISTER_RES
TOKEN=$(echo $REGISTER_RES | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "Wait, user might already exist. Trying to login..."
    LOGIN_RES=$(curl -s -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d '{ "email": "tester@example.com", "password": "password123" }')
    TOKEN=$(echo $LOGIN_RES | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo $LOGIN_RES
fi

echo -e "\n---> JWT Token Acquired: $TOKEN"

echo -e "\n2. Testing Auth: Get Profile (/auth/me)"
curl -s -X GET "$API_URL/auth/me" -H "Authorization: Bearer $TOKEN" | jq . || echo "Failed"

echo -e "\n3. Testing Travel: Search Travel Packages"
curl -s -X GET "$API_URL/travel/search" | jq . || echo "Search returned empty or error"

echo -e "\n4. Testing Bookings: Create a Booking (assuming travelId 1 exists, fail softly if not)"
# Creating booking (just attempting)
BOOKING_RES=$(curl -s -X POST "$API_URL/bookings/create" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{ "travelId": 1, "travelDate": "2026-05-01T00:00:00Z", "travelers": 2 }')
echo $BOOKING_RES

echo -e "\n5. Testing Bookings: View User Bookings"
curl -s -X GET "$API_URL/bookings" -H "Authorization: Bearer $TOKEN" | jq . || echo "Failed"

echo -e "\n---------------------------------------------------------"
echo "Tests complete."
echo "---------------------------------------------------------"
