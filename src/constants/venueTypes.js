export const VENUE_TYPES = [
    { id: 'Live Venue', labelEn: 'Live Venue', labelIs: 'Tónleikastaður' },
    { id: 'Nightclub', labelEn: 'Nightclub', labelIs: 'Skemmtistaður' },
    { id: 'Bar / Pub', labelEn: 'Bar / Pub', labelIs: 'Bar / Krá' },
    { id: 'Restaurant', labelEn: 'Restaurant', labelIs: 'Veitingastaður' },
    { id: 'Banquet Hall', labelEn: 'Banquet Hall', labelIs: 'Veislusalur' },
    { id: 'Conference Hall', labelEn: 'Conference Hall', labelIs: 'Ráðstefnusalur' },
    { id: 'Cafe', labelEn: 'Cafe', labelIs: 'Kaffihús' },
    { id: 'Hotel', labelEn: 'Hotel', labelIs: 'Hótel' },
    { id: 'Outdoor Area', labelEn: 'Outdoor Area', labelIs: 'Útisvæði' },
    { id: 'Cultural Center', labelEn: 'Cultural Center', labelIs: 'Menningarhús' }
];

export const getVenueTypeLabel = (id, language = 'is') => {
    const type = VENUE_TYPES.find(t => t.id === id);
    if (!type) return id;
    return language === 'en' ? type.labelEn : type.labelIs;
};
