export const CONFIG = {
    venues: {
        dillon: {
            id: 'dillon',
            name: 'Dillon',
            venueType: 'public',
            venueSubTypes: ['Live Venue', 'Bar / Pub'],
            currency: 'ISK',
            bookingFee: 25000,
            apiUrl: 'https://script.google.com/macros/s/AKfycbxA2ekrfLgaQZsZb5eMEFz_vreDazw_J_YZ1r2xnscjl6XFxePPeGWpHct69HL-0oRd/exec',
            addOns: [
                { id: 'karaoke', label: 'Karaoke System' },
                { id: 'dj', label: 'DJ Service' },
                { id: 'projector', label: 'Projector & Screen' },
                { id: 'catering', label: 'Catering/Drinks Inquiry' }
            ]
        }
    },
    defaultVenue: 'dillon'
};
