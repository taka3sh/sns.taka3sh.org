import React, { useState, useEffect } from 'react'

import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'

/*
import StoredPost from './model/StoredPost'
import PushService from './service/PushService'
import AuthService from './service/AuthService'
*/

//import LoginForm from './component/LoginForm.vue'
import { Post } from './component/PostTypes'
import { PostCards } from './component/PostCards'
import { PostFormCard } from './component/PostFormCard'
//import PostFormCard from './component/PostFormCard.vue'
//import DateLocalize from '../common/filter/DateLocalize'

import {
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseDatabaseURL,
  firebaseMessagingSenderId,
  pushEndpoint,
  postPrefix
} from './constants/development'

/*function vueMounted () {
  this.$el.querySelector('form').reset()
}

function firebaseLoaded () {
  firebase.initializeApp({
    apiKey: firebaseApiKey,
    authDomain: firebaseAuthDomain,
    databaseURL: firebaseDatabaseURL,
    messagingSenderId: firebaseMessagingSenderId
  })

  var auth = firebase.auth()
  var database = firebase.database()

  AuthService.init(auth)
  PushService.init(auth, pushEndpoint)
  StoredPost.init(database.ref(postPrefix))
}

function onCreate (e) {
  var self = this

  self.busy = true
  StoredPost.create(this.post.title, this.post.body, this.post.createdAt)
    .then(function (post) {
      Materialize.toast('The new post was successfully created.')
      return PushService.publish(post.key, self.post)
    })
    .then(function () {
      self.busy = false
      e.target.reset()
      Materialize.toast('The new post was successfully published.')
    })
    .catch(function (err) {
      self.busy = false
      console.error(err)
      Materialize.toast(err.message)
    })
}

function onReset (e) {
  this.post.title = this.post.body = ''
  this.post.createdAt = moment().format('YYYY-MM-DDTHH:mm')
}

function onLogin (email, password) {
  AuthService.login(email, password)
    .catch(function (err) {
      console.error(err)
      Materialize.toast(err.message)
    })
}

function onLogout () {
  AuthService.logout()
}

moment.locale('ja')

var app = new Vue({
  el: '#app',
  data: {
    user: AuthService.getUser(),
    busy: false,
    post: {
      title: '',
      body: '',
      createdAt: ''
    }
  },
  methods: {
    onCreate: onCreate,
    onLogin: onLogin,
    onLogout: onLogout,
    onReset: onReset
  },
  mounted: vueMounted,
  components: {
    'login-form': LoginForm,
    'post-cards': PostCards,
    'post-form-card': PostFormCard
  },
  filters: {
    'date-localize': DateLocalize
  }
})

addEventListener('load', function () {
  firebaseLoaded()

  firebase.auth().onAuthStateChanged(function (user) {
    app.user = user && user.email
  })
})
*/

const CreateApp = () => {
  const [post, setPost] = useState<Post>({
    body: '',
    title: '',
    createdAt: '',
    key: ''
  })

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPost(prevPost => {
      return {...prevPost, title: event.target.value}
    })
  }

  const handleChangeBody = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost(prevPost => {
      return {...prevPost, body: event.target.value}
    })
  }

  const handleChangeCreatedAt = (event: React.ChangeEvent<HTMLInputElement>) => {

  }

  return (
    <div className="grey lighten-3">
      <nav className="pink darken-1">
        <div className="nav-wrapper container">
          <span className="brand-logo">支援隊ヌーボー</span>
        </div>
      </nav>

      <div className="container" id="app">
        <PostFormCard
          heading="Creating a new post"
          post={post}
          handleChangeTitle={handleChangeTitle}
          handleChangeBody={handleChangeBody}
          handleChangeCreatedAt={handleChangeCreatedAt}
        >
          <button className="btn" type="submit">Submit</button>
          <button className="btn-flat" type="reset">Reset</button>
          <button className="btn-flat">Logout</button>
        </PostFormCard>

        <PostCards posts={[post]}></PostCards>
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

export default CreateApp