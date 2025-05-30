import {initializeApp} from 'firebase/app';
import {getMessaging , getToken} from 'firebase/messaging';

const firebaseconfig = {
	  apiKey: process.env.FIREBASE_API_KEY,
          authDomain: process.env.AUTH_DOMAIN,
          projectId: process.env.PROJECT_ID,
          storageBucket: process.env.STORAGE_BUCKET,
          messagingSenderId: process.env.MESSAGIN_SENDER_ID,
          appId: process.env.APP_ID,
          measurementId: process.env.MEASUREMENT_ID
};

const apps  = initializeApp(firebaseconfig);
const messaging = getMessaging(apps);

export default messaging ;

