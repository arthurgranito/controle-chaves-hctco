import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBQhYIdeJ5nWnb-jb_nMBFGmpQ4iVSiKtk",
    authDomain: "controle-chaves-hctco.firebaseapp.com",
    projectId: "controle-chaves-hctco",
    storageBucket: "controle-chaves-hctco.firebasestorage.app",
    messagingSenderId: "1026795857840",
    appId: "1:1026795857840:web:9516673a8e6f53f3b11875"
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);