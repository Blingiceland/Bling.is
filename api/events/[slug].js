import { collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (only once)
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const db = getFirestore();

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { slug } = req.query;

    if (!slug) {
        return res.status(400).json({ error: 'Venue slug is required' });
    }

    try {
        // 1. Find venue by slug
        const venuesRef = db.collection('venues');
        const venueQuery = venuesRef.where('slug', '==', slug).limit(1);
        const venueSnapshot = await venueQuery.get();

        if (venueSnapshot.empty) {
            return res.status(404).json({ error: 'Venue not found' });
        }

        const venueDoc = venueSnapshot.docs[0];
        const venueData = venueDoc.data();
        const venueId = venueDoc.id;

        // 2. Fetch approved bookings for this venue
        const bookingsRef = db.collection('bookings');
        const bookingsQuery = bookingsRef
            .where('venueId', '==', venueId)
            .where('status', '==', 'approved');

        const bookingsSnapshot = await bookingsQuery.get();

        // 3. Format events
        const events = bookingsSnapshot.docs
            .map(doc => {
                const data = doc.data();

                // Convert Firestore Timestamp to ISO date string
                let dateStr = '';
                if (data.date && data.date.toDate) {
                    dateStr = data.date.toDate().toISOString().split('T')[0];
                } else if (data.date) {
                    dateStr = new Date(data.date).toISOString().split('T')[0];
                }

                return {
                    id: doc.id,
                    date: dateStr,
                    startTime: data.startTime || '',
                    endTime: data.endTime || '',
                    name: data.bookerName || 'Event',
                    type: data.eventType || data.slot || 'event',
                    slot: data.slot || '',
                    ticketSales: data.ticketSales || 'no',
                    message: data.message || '',
                };
            })
            // Filter out events without valid dates and sort by date
            .filter(event => event.date)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // 4. Return response
        return res.status(200).json({
            venue: {
                name: venueData.name || 'Unknown Venue',
                slug: venueData.slug || slug,
                city: venueData.city || '',
                address: venueData.address || '',
            },
            events,
            count: events.length,
        });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
