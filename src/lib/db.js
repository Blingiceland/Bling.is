import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const signUpVenue = async (venueData) => {
    try {
        const docRef = await addDoc(collection(db, "venues"), {
            ...venueData,
            createdAt: serverTimestamp(),
        });
        console.log("Document written with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error adding document: ", e);
        return { success: false, error: e };
    }
};
