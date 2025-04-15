import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database' // ADD THIS

const firebaseConfig = {
	apiKey: 'AIzaSyB8JEjD3d4QRpfyoONiQKMazmnPhcAZRzY',
	authDomain: 'login-bc4c7.firebaseapp.com',
	projectId: 'login-bc4c7', // CHỈ LÀ projectId (bỏ https://)
	databaseURL: 'https://login-bc4c7-default-rtdb.firebaseio.com', // ADD THIS
	storageBucket: 'login-bc4c7.appspot.com', // FIXED domain
	messagingSenderId: '678793601980',
	appId: '1:678793601980:web:e485048e12ae2af90d81b9',
	measurementId: 'G-WWECDJ66W3',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app)

export { app, auth, db }
