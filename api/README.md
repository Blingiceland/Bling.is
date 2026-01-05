# Public Events API

## Endpoint

`GET /api/events/{slug}`

Returns approved events for a venue in JSON format.

## Example

**Request:**
```
GET https://bling.is/api/events/dillon
```

**Response:**
```json
{
  "venue": {
    "name": "Dillon Whisky Bar",
    "slug": "dillon",
    "city": "Reykjavík",
    "address": "Laugavegur 30"
  },
  "events": [
    {
      "id": "abc123",
      "date": "2026-01-10",
      "startTime": "21:00",
      "endTime": "02:00",
      "name": "Blues Night Beggi",
      "type": "live_gig",
      "slot": "night",
      "ticketSales": "no",
      "message": "Regular Thursday Blues"
    }
  ],
  "count": 1
}
```

## Usage on External Website

```javascript
// Fetch events for Dillon
async function loadDillonEvents() {
  try {
    const response = await fetch('https://bling.is/api/events/dillon');
    const data = await response.json();
    
    // Display events
    const eventsContainer = document.getElementById('events');
    data.events.forEach(event => {
      const eventEl = document.createElement('div');
      eventEl.innerHTML = `
        <h3>${event.name}</h3>
        <p>${event.date} at ${event.startTime}</p>
      `;
      eventsContainer.appendChild(eventEl);
    });
  } catch (error) {
    console.error('Failed to load events:', error);
  }
}

// Call on page load
loadDillonEvents();
```

## Features

- ✅ CORS enabled for cross-origin requests
- ✅ Cached for 5 minutes (s-maxage=300)
- ✅ Returns only approved events
- ✅ Sorted by date (ascending)
- ✅ Includes event time, type, and ticket info

## Environment Variables Required (Vercel)

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

These should be set in Vercel dashboard under Settings → Environment Variables.
