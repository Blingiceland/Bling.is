import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Generate URL-safe slug from venue name
 * Handles Icelandic characters properly
 */
export const generateSlug = (name) => {
    if (!name) return '';

    return name
        .toLowerCase()
        // Icelandic characters
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/[ýÿ]/g, 'y')
        .replace(/ð/g, 'd')
        .replace(/þ/g, 'th')
        .replace(/æ/g, 'ae')
        // Remove special characters and replace with hyphens
        .replace(/[^a-z0-9]+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, '');
};

/**
 * Check if a slug is available (not already taken)
 */
export const isSlugAvailable = async (slug, db, excludeVenueId = null) => {
    if (!slug) return false;

    try {
        const q = query(collection(db, 'venues'), where('slug', '==', slug));
        const snapshot = await getDocs(q);

        // If excluding a venue (for updates), check if the only match is that venue
        if (excludeVenueId) {
            const matches = snapshot.docs.filter(doc => doc.id !== excludeVenueId);
            return matches.length === 0;
        }

        return snapshot.empty;
    } catch (error) {
        console.error('Error checking slug availability:', error);
        return false;
    }
};

/**
 * Validate slug format
 */
export const isValidSlug = (slug) => {
    if (!slug) return false;

    // Must be 3-50 characters
    if (slug.length < 3 || slug.length > 50) return false;

    // Only lowercase letters, numbers, and hyphens
    // Cannot start or end with hyphen
    const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    return slugRegex.test(slug);
};
