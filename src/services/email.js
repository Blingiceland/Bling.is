import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Trigger an email via the Firebase Extension by writing to the 'mail' collection.
 * @param {string|string[]} to - Recipient email(s)
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @param {object} [metadata] - Optional metadata to store with the email log
 */
export const sendEmail = async (to, subject, html, metadata = {}) => {
    try {
        await addDoc(collection(db, 'mail'), {
            to,
            message: {
                subject,
                html,
            },
            ...metadata,
            createdAt: serverTimestamp(),
        });
        console.log(`Email queued for: ${to}`);
        return true;
    } catch (error) {
        console.error("Failed to queue email:", error);
        return false;
    }
};
