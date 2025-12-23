import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signup(email, password, role = 'seeker') {
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('../firebase');

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Create user document
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email: email,
            role: role, // 'host' or 'seeker'
            createdAt: new Date(),
            managedVenues: [],
            managedProfiles: []
        });

        // Send verification email automatically
        await sendVerification(userCredential.user);

        return userCredential;
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    async function googleLogin() {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user document exists, if not create it
        const { doc, setDoc, getDoc } = await import('firebase/firestore');
        const { db } = await import('../firebase');

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                email: user.email,
                role: 'seeker', // Default role needed, can be updated later
                createdAt: new Date(),
                managedVenues: [],
                managedProfiles: [],
                authProvider: 'google'
            });
        }

        return result;
    }

    function verifyEmail() {
        if (auth.currentUser) {
            return sendVerification(auth.currentUser);
        }
        return Promise.reject("No user logged in");
    }

    // Alias for internal use to avoid conflict
    async function sendVerification(user) {
        return sendEmailVerification(user);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        googleLogin,
        verifyEmail,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
