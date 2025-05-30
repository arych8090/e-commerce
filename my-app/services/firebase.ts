import {initializeApp} from 'firebase/app';
import {getMessaging , getToken} from 'firebase/messaging';

const firebaseconfig = {
	  apiKey: "AIzaSyCfPP2Ah_1tG05Ekil4LzidPLyJuT7fTuI",
          authDomain: "commerce-281eb.firebaseapp.com",
          projectId: "commerce-281eb",
          storageBucket: "commerce-281eb.firebasestorage.app",
          messagingSenderId: "203081330945",
          appId: "1:203081330945:web:7f745fd2d343029c692b00",
          measurementId: "G-L3E20376ER"
};

const apps  = initializeApp(firebaseconfig);
const messaging = getMessaging(apps);

export default messaging ;

