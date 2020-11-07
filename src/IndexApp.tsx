import React from 'react'
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

import PostCards from './component/PostCards'

import CachedPosts from './model/CachedPosts'
import ShownPosts from './model/ShownPosts'

import PostReceiver from './service/PostReceiver'
import NotifyService from './service/NotifyService'

const firebaseLoaded = () => {
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
  messaging.onTokenRefresh(function () {
    NotifyService.subscribe()
  })

  if (NotifyService.isSupported()) {
    NotifyService.getEnabled().then(function (value) {
      if (value) {
        messaging.getToken()
      }
    })
  }

  var postsRef = database.ref(postPrefix)
  postsRef.on('child_removed', function () {
    CachedPosts.invalidateCache()
  })

  PostReceiver.init(postsRef)
  return PostReceiver.loadAll()
}

const posts = CachedPosts.getPosts()
const postKeys = CachedPosts.getKeys()

CachedPosts.invalidateCache()

ShownPosts.init(postKeys, posts)

PostReceiver.onChildAdded = function (key, val) {
  CachedPosts.add(key, val)
  ShownPosts.add(key, val)
}

window.addEventListener('load', () => {
  firebaseLoaded().then(() => PostReceiver.listen())
})

const IndexApp = () => (
  <div className="grey lighten-3">
    <nav className="pink darken-1">
      <div className="nav-wrapper container">
        <span className="brand-logo">支援隊ヌーボー</span>
      </div>
    </nav>

    <div className="container" id="app">
      <div className="col s12">
      </div>

      <PostCards posts={posts}></PostCards>

      <section className="col s12">
        <div>こちらは、たかさん支援隊からの連絡などを配信するサイトです。</div>
      </section>
    </div>

    <footer className="page-footer grey darken-3 white-text">
      <div className="container">
        <div>Copyright © 2015-2017 高井戸第三小学校学校支援本部</div>
        <div>Developed by <a href="https://github.com/umireon">umireon</a>.</div>
      </div>
    </footer>
  </div>
)

export default IndexApp;
