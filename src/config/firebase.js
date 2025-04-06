// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyB8JEjD3d4QRpfyoONiQKMazmnPhcAZRzY',
	authDomain: 'login-bc4c7.firebaseapp.com',
	projectId: 'https://login-bc4c7-default-rtdb.firebaseio.com',
	storageBucket: 'login-bc4c7.firebasestorage.app',
	messagingSenderId: '678793601980',
	appId: '1:678793601980:web:e485048e12ae2af90d81b9',
	measurementId: 'G-WWECDJ66W3',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { app, auth }
