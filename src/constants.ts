export const firebaseConfig = {
  apiKey: 'AIzaSyB3rU05SgP6XFnQqPgrvCBLSPulxsfpwxI',
  appId: '1:895779023522:web:b56d399bb3a5601a1c85fb',
  authDomain: 'sns-taka3sh-org-157419.firebaseapp.com',
  databaseURL: 'https://sns-taka3sh-org-157419.firebaseio.com',
  measurementId: 'G-C0W1HZN6WV',
  messagingSenderId: '895779023522',
  projectId: 'sns-taka3sh-org-157419',
  storageBucket: 'sns-taka3sh-org-157419.appspot.com'
}

export const notifyEndpoint =
  process.env.NODE_ENV === 'production' ? 'https://asia-northeast1-sns-taka3sh-org-157419.cloudfunctions.net/Subscribe' : 'https://asia-northeast1-sns-taka3sh-org-157419.cloudfunctions.net/SubscribeDev'

export const pushEndpoint =
  process.env.NODE_ENV === 'production' ? 'https://asia-northeast1-sns-taka3sh-org-157419.cloudfunctions.net/Publish' : 'https://asia-northeast1-sns-taka3sh-org-157419.cloudfunctions.net/PublishDev'

export const postPrefix = process.env.NODE_ENV === 'production' ? 'posts' : 'posts-stage'
