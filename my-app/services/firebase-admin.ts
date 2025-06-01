import admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert({
        projectId : process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey:process.env.PRIVATE_KEY
    })
})

const db =  admin.firestore();
export {db};
export {admin};