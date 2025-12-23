export const ICELAND_REGIONS = [
    {
        name: "Capital Area (Höfuðborgarsvæðið)",
        cities: [
            "Reykjavík", "Reykjavik 101", "Reykjavik 103", "Reykjavik 104", "Reykjavik 105",
            "Reykjavik 107", "Reykjavik 108", "Reykjavik 109", "Reykjavik 110", "Reykjavik 111",
            "Reykjavik 112", "Reykjavik 113", "Reykjavik 116", "Reykjavik 162",
            "Kópavogur", "Hafnarfjörður", "Garðabær", "Mosfellsbær", "Seltjarnarnes", "Álftanes"
        ]
    },
    {
        name: "Suðurnes",
        cities: ["Reykjanesbær", "Suðurnesjabær", "Grindavík", "Vogar", "Keflavík", "Njarðvík", "Sandgerði", "Garður"]
    },
    {
        name: "Suðurland",
        cities: ["Selfoss", "Hveragerði", "Vík", "Vestmannaeyjar", "Hella", "Hvolsvöllur", "Kirkjubæjarklaustur", "Flúðir", "Eyrarbakki", "Stokkseyri", "Þorlákshöfn"]
    },
    {
        name: "Vesturland",
        cities: ["Akranes", "Borgarnes", "Stykkishólmur", "Snæfellsbær", "Grundarfjörður", "Ólafsvík", "Búðardalur"]
    },
    {
        name: "Vestfirðir",
        cities: ["Ísafjörður", "Bolungarvík", "Patreksfjörður", "Hólmavík"]
    },
    {
        name: "Norðurland",
        cities: ["Akureyri", "Húsavík", "Dalvík", "Siglufjörður", "Ólafsfjörður", "Blönduós", "Sauðárkrókur", "Hvammstangi"]
    },
    {
        name: "Austurland",
        cities: ["Egilsstaðir", "Seyðisfjörður", "Neskaupstaður", "Eskifjörður", "Reyðarfjörður", "Fáskrúðsfjörður", "Vopnafjörður", "Höfn í Hornafirði"]
    }
];

// Helper to get all cities in a flat list for dropdowns
export const getAllCities = () => {
    return ICELAND_REGIONS.flatMap(r => r.cities).sort();
};

// Helper to find region for a city
export const getRegionForCity = (city) => {
    if (!city) return "Other";
    const normalizedCity = city.toLowerCase().trim();
    const region = ICELAND_REGIONS.find(r =>
        r.cities.some(c => c.toLowerCase() === normalizedCity)
    );
    return region ? region.name : "Other";
};

// Approximate coordinates for mapping
export const CITY_COORDINATES = {
    // Capital Area
    "Reykjavík": { lat: 64.1466, lng: -21.9426 },
    "Reykjavik 101": { lat: 64.1475, lng: -21.9347 },
    "Reykjavik 103": { lat: 64.1292, lng: -21.8967 },
    "Reykjavik 104": { lat: 64.1373, lng: -21.8710 },
    "Reykjavik 105": { lat: 64.1402, lng: -21.9068 },
    "Reykjavik 107": { lat: 64.1432, lng: -21.9678 },
    "Reykjavik 108": { lat: 64.1265, lng: -21.8596 },
    "Kópavogur": { lat: 64.1111, lng: -21.9056 },
    "Hafnarfjörður": { lat: 64.0671, lng: -21.9403 },
    "Garðabær": { lat: 64.0888, lng: -21.9329 },
    "Mosfellsbær": { lat: 64.1678, lng: -21.6961 },
    "Seltjarnarnes": { lat: 64.1558, lng: -22.0000 },

    // Suðurnes
    "Keflavík": { lat: 64.0028, lng: -22.5622 },
    "Reykjanesbær": { lat: 63.9744, lng: -22.5638 },
    "Grindavík": { lat: 63.8368, lng: -22.4332 },

    // Suðurland
    "Selfoss": { lat: 63.9335, lng: -21.0014 },
    "Hveragerði": { lat: 64.0004, lng: -21.1895 },
    "Vík": { lat: 63.4186, lng: -19.0060 },
    "Vestmannaeyjar": { lat: 63.4377, lng: -20.2673 },

    // Vesturland
    "Akranes": { lat: 64.3184, lng: -22.0707 },
    "Borgarnes": { lat: 64.5383, lng: -21.9213 },
    "Stykkishólmur": { lat: 65.0747, lng: -22.7276 },

    // Vestfirðir
    "Ísafjörður": { lat: 66.0749, lng: -23.1240 },

    // Norðurland
    "Akureyri": { lat: 65.6826, lng: -18.0907 },
    "Húsavík": { lat: 66.0450, lng: -17.3383 },
    "Siglufjörður": { lat: 66.1524, lng: -18.9070 },

    // Austurland
    "Egilsstaðir": { lat: 65.2669, lng: -14.3948 },
    "Seyðisfjörður": { lat: 65.2598, lng: -14.0101 }
};

export const getCityCoordinates = (city) => {
    if (!city) return { lat: 64.1466, lng: -21.9426 }; // Default Reykjavik
    const normalized = city.trim();
    // Direct match
    if (CITY_COORDINATES[normalized]) return CITY_COORDINATES[normalized];
    // Case-insensitive match
    const found = Object.keys(CITY_COORDINATES).find(key => key.toLowerCase() === normalized.toLowerCase());
    if (found) return CITY_COORDINATES[found];
    // Default to Reykjavik if unknown
    return { lat: 64.1466, lng: -21.9426 };
};
