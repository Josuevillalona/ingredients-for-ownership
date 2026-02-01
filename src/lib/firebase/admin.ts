import * as admin from 'firebase-admin';

// Lazy initialization getter
export const getAdminAuth = () => {
    if (!admin.apps.length) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
            });
            console.log('✅ Firebase Admin initialized');
        } catch (error) {
            // During build time, env vars might be missing, which is fine if we catch it
            console.warn('⚠️ Firebase Admin initialization failed (likely missing env vars during build):', error);
            // We can't actually throw here or build fails, but subsequent calls will fail if env vars are truly missing at runtime
        }
    }
    return admin.auth();
};

export const getAdminDb = () => {
    if (!admin.apps.length) {
        // Ideally re-use initialization logic or ensure getAdminAuth is called first. 
        // For simplicity, we can just call getAdminAuth's logic or depend on it.
        // But better to just re-check apps.length.
        getAdminAuth(); // Ensure init
    }
    return admin.firestore();
}
