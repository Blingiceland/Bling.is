import { CONFIG } from '../config';

export const fetchBookings = (venueId = CONFIG.defaultVenue) => {
  const venue = CONFIG.venues[venueId];
  if (!venue || !venue.apiUrl) return Promise.resolve([]);

  return fetch(venue.apiUrl)
    .then(response => response.json())
    .then(data => {
      // Data expected: { gigs: [[header, ...], [rows...]], private: [[header, ...], [rows...]] }

      const parseRows = (rows, type) => {
        if (!rows || rows.length < 2) return []; // Need at least header + 1 row
        const dataRows = rows.slice(1); // Skip header row

        return dataRows.map(row => {
          // Map by Index based on Schema
          if (type === 'gig') {
            // Gigs: [0]Date, [1]BandName, [2]Email, [3]Phone, [4]Desc, [5]Backline, [6]Ticketing, [7]Status, [8]VenueID
            return {
              id: Math.random().toString(36).substr(2, 9),
              date: row[0],
              dateObj: new Date(row[0]),
              title: "Reserved", // Anonymized
              bandName: row[1],
              description: row[4],
              technicalRequirements: row[5],
              ticketingOption: row[6],
              status: row[7],
              type: 'gig',

              // Defaults for UI safety
              entryType: 'Paid',
              ticketPrice: '',
              soundEngineer: false
            };
          } else {
            // Private: [0]Date, [1]ClientName, [2]Email, [3]Phone, [4]Type, [5]Guests, [6]Addons, [7]Message, [8]Status, [9]VenueID
            return {
              id: Math.random().toString(36).substr(2, 9),
              date: row[0],
              dateObj: new Date(row[0]),
              title: "Reserved", // Anonymized
              clientName: row[1],
              email: row[2],
              phone: row[3],
              eventType: row[4],
              guestCount: row[5],
              addOns: row[6],
              description: row[7],
              status: row[8],
              type: 'private'
            };
          }
        });
      };

      const gigs = parseRows(data.gigs, 'gig');
      const privateEvents = parseRows(data.private, 'private');

      const merged = [...gigs, ...privateEvents];
      // console.log(`Fetched ${merged.length} bookings`);
      return merged;
    })
    .catch(err => {
      console.error("API Fetch Error:", err);
      throw err;
    });
};

export const saveBooking = (bookingData, venueId = CONFIG.defaultVenue) => {
  const venue = CONFIG.venues[venueId];
  if (!venue || !venue.apiUrl) return Promise.reject("No API URL configured");

  // Serialize payload
  const payload = JSON.stringify(bookingData);
  console.log("Saving Payload:", payload);

  return fetch(venue.apiUrl, {
    method: 'POST',
    headers: {
      // 'text/plain' avoids OPTIONS preflight which GAS usually doesn't handle
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: payload
  })
    .then(response => {
      return response.text().then(text => {
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("Failed to parse GAS response:", text);
          throw new Error("Invalid Server Response: " + text.substring(0, 50));
        }
      });
    })
    .then(result => {
      console.log("GAS Result:", result);
      if (result.status === 'error') {
        throw new Error(result.message || "Unknown Script Error");
      }
      return result;
    });
};
