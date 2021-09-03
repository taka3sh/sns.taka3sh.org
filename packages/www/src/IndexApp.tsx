import {
  NotifyService,
  isNotifyServiceEnabled,
  registerNotifyServiceWorker
} from './NotifyService'
import { PostCards, PostCardsProps } from './component/PostCards'
import React, { useEffect, useState } from 'react'
import { child, get, getDatabase, ref } from 'firebase/database'
import {
  firebaseConfig,
  notifyEndpoint,
  postPrefix
} from './constants'

import { Footer } from './component/Footer'
import { Header } from './component/Header'
import { NotifySwitch } from './component/NotifySwitch'
import { getMessaging } from 'firebase/messaging'
import { initializeApp } from 'firebase/app'

import 'materialize-css/dist/css/materialize.min.css'

const firebaseApp = initializeApp(firebaseConfig)

const database = getDatabase(firebaseApp)
const messaging = getMessaging(firebaseApp)

registerNotifyServiceWorker()
const notifyService = new NotifyService(messaging, notifyEndpoint)

export const IndexApp: React.VFC = () => {
  const [posts, setPosts] = useState<PostCardsProps['posts']>([])

  useEffect(() => {
    const dbRef = ref(database)
    get(child(dbRef, postPrefix)).then(snapshot => {
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

  isNotifyServiceEnabled().then(setEnabled)

  const handleNotifyToggle = () => {
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
