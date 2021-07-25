import firebase from 'firebase/app'
import { firebaseConfig } from '../src/constants'

import 'firebase/messaging'

firebase.initializeApp(firebaseConfig)
firebase.messaging()
