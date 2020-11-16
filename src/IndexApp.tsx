import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import 'materialize-css/dist/css/materialize.min.css'

import {
  firebaseProjectId,
  firebaseApiKey,
  firebaseDatabaseURL,
  firebaseMessagingSenderId,
  firebaseAppId,
  notifyEndpoint,
  postPrefix
} from './constants/development'

import PostCards, { Props as PostCardsProps } from './component/PostCards'
import { NotifySwitch } from './component/NotifySwitch'

import NotifyService from './service/NotifyService'

firebase.initializeApp({
  apiKey: firebaseApiKey,
  databaseURL: firebaseDatabaseURL,
  projectId: firebaseProjectId,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId
})

const database = firebase.database()
const messaging = firebase.messaging()

NotifyService.init(messaging, notifyEndpoint)

if (NotifyService.isSupported()) {
  NotifyService.getEnabled().then(function (value) {
    if (value) {
      messaging.getToken()
    }
  })
}

const IndexApp = () => {
  const [posts, setPosts] = useState<PostCardsProps['posts']>([])

  useEffect(() => {
    database.ref(postPrefix).once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        setPosts(prevPosts => [childSnapshot.val(), ...prevPosts])
      })
    })
  }, [])

  const [busy, setBusy] = useState(false)
  const [enabled, setEnabled] = useState(false)

  const handleNotifyToggle = (event: React.MouseEvent<HTMLInputElement>) => {
    if (!NotifyService.isSupported()) return
  
    if (enabled) {
      NotifyService.unsubscribe()
      setEnabled(false)
    } else {
      setBusy(true)
      NotifyService.subscribe()
        .then(() => {
          setBusy(false)
          setEnabled(true)
        })
        .catch((error: Error) =>{
          setBusy(false)
          console.error(error)
        })
    }
  }

  return (
    <div className="grey lighten-3">
      <nav className="pink darken-1">
        <div className="nav-wrapper container">
          <span className="brand-logo">支援隊ヌーボー</span>
        </div>
      </nav>

      <div className="container" id="app">
        <section className="col s12">
          <div>こちらは、たかさん支援隊からの連絡などを配信するサイトです。</div>
        </section>

        <NotifySwitch busy={busy} enabled={enabled} handleNotifyToggle={handleNotifyToggle} />

        <PostCards posts={posts}></PostCards>
      </div>

      <footer className="page-footer grey darken-3 white-text">
        <div className="container">
          <div>Copyright © 2015-2017 高井戸第三小学校学校支援本部</div>
          <div>Developed by <a href="https://github.com/umireon">umireon</a>.</div>
        </div>
      </footer>
    </div>
  )
}

export default IndexApp
