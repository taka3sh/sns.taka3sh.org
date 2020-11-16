import React, { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/messaging'
import 'firebase/database'
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

import { PostCards, Props as PostCardsProps } from './component/PostCards'
import { NotifySwitch } from './component/NotifySwitch'

import { NotifyService } from './NotifyService'

firebase.initializeApp({
  apiKey: firebaseApiKey,
  databaseURL: firebaseDatabaseURL,
  projectId: firebaseProjectId,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId
})

const database = firebase.database()
const messaging = firebase.messaging()

const notifyService = new NotifyService(messaging, notifyEndpoint)

if (notifyService.isSupported()) {
  notifyService.getEnabled().then(value => {
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
        setPosts(prevPosts => [{...childSnapshot.val(), key: childSnapshot.key}, ...prevPosts])
      })
    })
  }, [])

  const [busy, setBusy] = useState(false)
  const [enabled, setEnabled] = useState(false)

  notifyService.getEnabled().then(setEnabled)

  const handleNotifyToggle = () => {
    if (!notifyService.isSupported()) return
  
    if (enabled) {
      notifyService.unsubscribe()
      setEnabled(false)
    } else {
      setBusy(true)
      notifyService.subscribe()
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
