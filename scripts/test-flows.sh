#!/bin/bash
# Test User + Admin flows via API
# Run with: ./scripts/test-flows.sh (from apps/ dir) or bash scripts/test-flows.sh

USER_API="http://localhost:3000"
ADMIN_API="http://localhost:3001"

echo "=== 1. Fetch IDs (property, guide) ==="
PROP_ID=$(curl -s "$USER_API/properties?limit=1" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const j=JSON.parse(d); const p=j.properties||j; console.log(Array.isArray(p)?p[0]?.id:'')})")
# Get guide by random index (0-4) to cycle and avoid "already reviewed" on repeat runs
GUIDE_ID=$(curl -s "$USER_API/guides?limit=5" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const j=JSON.parse(d); const g=Array.isArray(j)?j:j.guides||[]; const i=(Date.now()%1000)%Math.max(1,g.length); console.log(g[i]?.id||g[0]?.id||'')})")
echo "Property ID: $PROP_ID"
echo "Guide ID: $GUIDE_ID"

echo ""
echo "=== 2. USER: Login ==="
USER_RESP=$(curl -s -X POST "$USER_API/auth/login" -H "Content-Type: application/json" -d '{"email":"user@everstays.com","password":"user123"}')
USER_TOKEN=$(echo "$USER_RESP" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{const j=JSON.parse(d); console.log(j.accessToken||j.access_token||j.token||'')}catch(e){console.log('')}})")
echo "Token: ${USER_TOKEN:0:30}..."

echo ""
echo "=== 3. ADMIN: Login (needed for confirming booking) ==="
ADMIN_RESP=$(curl -s -X POST "$ADMIN_API/auth/login" -H "Content-Type: application/json" -d '{"email":"admin@everstays.com","password":"admin123"}')
ADMIN_TOKEN=$(echo "$ADMIN_RESP" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{const j=JSON.parse(d); console.log(j.accessToken||j.access_token||j.token||'')}catch(e){console.log('')}})")
echo "Admin Token: ${ADMIN_TOKEN:0:30}..."

echo ""
echo "=== 4. USER: Create past-dated booking (for property review eligibility) ==="
# Use dates ~60 days in past - checkout passed, unique offset to avoid conflicts
PAST_OFFSET=$(($(date +%s) % 45))
PAST_CHECKIN=$(date -v-$((60+PAST_OFFSET))d +%Y-%m-%d 2>/dev/null || date -d "-$((60+PAST_OFFSET)) days" +%Y-%m-%d 2>/dev/null || printf "2025-12-01")
PAST_CHECKOUT=$(date -v-$((58+PAST_OFFSET))d +%Y-%m-%d 2>/dev/null || date -d "-$((58+PAST_OFFSET)) days" +%Y-%m-%d 2>/dev/null || printf "2025-12-03")
PAST_BOOKING_RESP=$(curl -s -X POST "$USER_API/bookings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "{\"propertyId\":\"$PROP_ID\",\"checkIn\":\"$PAST_CHECKIN\",\"checkOut\":\"$PAST_CHECKOUT\",\"guests\":2}")
PAST_BOOKING_ID=$(echo "$PAST_BOOKING_RESP" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{const j=JSON.parse(d); console.log(j.id||'')}catch(e){console.log('')}})")
echo "Past booking ID: ${PAST_BOOKING_ID:0:8}..."

echo ""
echo "=== 5. ADMIN: Confirm past booking (so user can review) ==="
if [ -n "$PAST_BOOKING_ID" ]; then
  curl -s -X PATCH "$ADMIN_API/bookings/$PAST_BOOKING_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -d '{"status":"completed"}' | head -c 150
else
  echo "(Skipped - no booking ID, may have date conflict)"
fi
echo ""

echo ""
echo "=== 6. USER: Add property review (rating) ==="
curl -s -X POST "$USER_API/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "{\"propertyId\":\"$PROP_ID\",\"rating\":5,\"comment\":\"Amazing stay! Highly recommend.\"}" | head -c 200
echo ""

echo ""
echo "=== 7. USER: Make property booking (future dates) ==="
# Use 120+ days in future + unique day offset to avoid conflicts
DAY_OFFSET=$(($(date +%s) % 60))
CHECK_IN=$(date -v+$((120+DAY_OFFSET))d +%Y-%m-%d 2>/dev/null || date -d "+$((120+DAY_OFFSET)) days" +%Y-%m-%d 2>/dev/null || printf "2026-06-15")
CHECK_OUT=$(date -v+$((122+DAY_OFFSET))d +%Y-%m-%d 2>/dev/null || date -d "+$((122+DAY_OFFSET)) days" +%Y-%m-%d 2>/dev/null || printf "2026-06-17")
curl -s -X POST "$USER_API/bookings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "{\"propertyId\":\"$PROP_ID\",\"checkIn\":\"$CHECK_IN\",\"checkOut\":\"$CHECK_OUT\",\"guests\":2}" | head -c 200
echo ""

echo ""
echo "=== 8. USER: Hire a guide ==="
BOOK_DATE=$(date -v+4d +%Y-%m-%d 2>/dev/null || date -d "+4 days" +%Y-%m-%d 2>/dev/null || printf "%s" "2025-03-16")
curl -s -X POST "$USER_API/guides/$GUIDE_ID/bookings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "{\"bookingDate\":\"$BOOK_DATE\",\"numberOfDays\":2,\"message\":\"Would love a nature walk\"}" | head -c 200
echo ""

echo ""
echo "=== 9. USER: Request a cab ==="
TRAVEL_DATE=$(date -v+3d +%Y-%m-%d 2>/dev/null || date -d "+3 days" +%Y-%m-%d 2>/dev/null || printf "%s" "2025-03-15")
curl -s -X POST "$USER_API/cab-requests" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "{\"pickupLocation\":\"Kochi Airport\",\"dropLocation\":\"Fort Kochi\",\"travelDate\":\"$TRAVEL_DATE\",\"travelTime\":\"14:00\",\"numberOfPeople\":2,\"guestName\":\"Test Traveler\",\"guestPhone\":\"9876543210\",\"guestEmail\":\"user@everstays.com\",\"propertyId\":\"$PROP_ID\"}" | head -c 200
echo ""

echo ""
echo "=== 10. USER: Add guide review (rating) ==="
curl -s -X POST "$USER_API/guides/$GUIDE_ID/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "{\"rating\":5,\"comment\":\"Excellent guide, very knowledgeable!\"}" | head -c 200
echo ""

echo ""
echo "=== 11. ADMIN: Add new offer ==="
# Use unique code to avoid duplicate key (409)
OFFER_CODE="SUMMER$(date +%s | tail -c 6)"
curl -s -X POST "$ADMIN_API/offers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"title\":\"Summer Splash\",\"description\":\"20% off on all stays\",\"discount\":20,\"discountType\":\"percentage\",\"expiryDate\":\"2025-08-31\",\"type\":\"seasonal\",\"code\":\"$OFFER_CODE\",\"terms\":\"Valid for summer bookings\"}" | head -c 400
echo ""

echo ""
echo "=== 12. ADMIN: Add new property ==="
# Need category ID
CAT_ID=$(curl -s "$ADMIN_API/categories" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const j=JSON.parse(d); const c=Array.isArray(j)?j:j.data||[]; console.log(c[0]?.id||'')})")
curl -s -X POST "$ADMIN_API/properties" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"name\":\"New Test Villa\",\"location\":\"Marine Drive\",\"city\":\"Kochi\",\"description\":\"Lovely test property\",\"pricePerNight\":5000,\"bedrooms\":2,\"bathrooms\":2,\"maxGuests\":4,\"images\":[\"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800\"],\"amenities\":[\"WiFi\",\"AC\"],\"categoryId\":\"$CAT_ID\",\"cancellationPolicy\":\"Free cancellation up to 3 days before\"}" | head -c 300
echo ""

echo ""
echo "=== 13. ADMIN: Add new guide ==="
curl -s -X POST "$ADMIN_API/guides" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"name":"New Test Guide","location":"Kochi","description":"Friendly local guide","pricePerDay":1500,"languages":["English"],"specialties":["City Tours"],"images":["https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800"]}' | head -c 300
echo ""

echo ""
echo "=== 14. ADMIN: Add new experience ==="
curl -s -X POST "$ADMIN_API/experiences" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"name":"Sunset Kayaking","location":"Vembanad Lake","city":"Kochi","description":"Kayak at sunset","price":1500,"duration":"2 hours","category":"Nature","images":["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"]}' | head -c 300
echo ""

echo ""
echo "=== 15. ADMIN: Add new cab ==="
curl -s -X POST "$ADMIN_API/cabs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"vehicleName":"Toyota Etios","vehicleNumber":"KL-01-XY-9999","vehicleType":"Sedan","seats":5,"pricePerKm":11,"basePrice":300,"amenities":["AC","Music"],"driverName":"Test Driver","driverPhone":"9876543299"}' | head -c 300
echo ""

echo ""
echo "=== DONE. Check User app (5173) & Admin app (5174) to verify data. ==="
