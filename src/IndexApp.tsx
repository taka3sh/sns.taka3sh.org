import { NotifyService, registerNotifyServiceWorker } from './NotifyService'
import { PostCards, PostCardsProps } from './component/PostCards'
import React, { useEffect, useState } from 'react'
import {
  firebaseConfig,
  notifyEndpoint,
  postPrefix
} from './constants'

import { Footer } from './component/Footer'
import { Header } from './component/Header'
import { NotifySwitch } from './component/NotifySwitch'
import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'
import 'materialize-css/dist/css/materialize.min.css'

firebase.initializeApp(firebaseConfig)

const database = firebase.database()
const messaging = firebase.messaging()

registerNotifyServiceWorker()
const notifyService = new NotifyService(messaging, notifyEndpoint)

if (NotifyService.isSupported()) {
  NotifyService.getEnabled().then((value) => {
    if (value) {
      messaging.getToken()
    }
  })
}

const IndexApp: React.FC<unknown> = () => {
  const [posts, setPosts] = useState<PostCardsProps['posts']>([])

  useEffect(() => {
    database.ref(postPrefix).once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        setPosts((prevPosts) => [
          { ...childSnapshot.val(), key: childSnapshot.key },
          ...prevPosts
        ])
      })
    })
  }, [])

  const [busy, setBusy] = useState(false)
  const [enabled, setEnabled] = useState(false)

  NotifyService.getEnabled().then(setEnabled)

  const handleNotifyToggle = () => {
    if (!NotifyService.isSupported()) return

    if (enabled) {
      notifyService.unsubscribe()
      setEnabled(false)
    } else {
      setBusy(true)
      notifyService
        .subscribe()
        .then(() => {
          setBusy(false)
          setEnabled(true)
        })
        .catch(() => {
          setBusy(false)
        })
    }
  }

  return (
    <div className="grey lighten-3">
      <Header />

      <div className="container" id="app">
        <section className="col s12">
          <div>
            こちらは、たかさん支援隊からの連絡などを配信するサイトです。
          </div>
        </section>

        <NotifySwitch
          busy={busy}
          enabled={enabled}
          handleNotifyToggle={handleNotifyToggle}
        />

        <PostCards posts={posts} />
      </div>

      <Footer />
    </div>
  )
}

export default IndexApp
