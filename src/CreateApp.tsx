import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'

import dayjs from 'dayjs'

import Materialize from 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'

import { StoredPost } from './StoredPost'
import { AuthService } from './AuthService'

/*
import StoredPost from './model/StoredPost'
import PushService from './service/PushService'
import AuthService from './service/AuthService'
*/

import { Post } from './component/PostTypes'
import { PostCards } from './component/PostCards'
import { PostFormCard } from './component/PostFormCard'
import { LoginForm } from './component/LoginForm'

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

firebase.initializeApp({
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  databaseURL: firebaseDatabaseURL,
  messagingSenderId: firebaseMessagingSenderId
})

const auth = firebase.auth()
const database = firebase.database()

const authService = new AuthService(auth)
//PushService.init(auth, pushEndpoint)
const storedPost = new StoredPost(database.ref(postPrefix))

const getDefaultValues = () => {
  return {
    body: '',
    title: '',
    createdAt: dayjs().format('YYYY-MM-DDTHH:mm')
  }
}

const CreateApp = () => {
  const {
    register: registerPost,
    handleSubmit: handleSubmitPost,
    watch: watchPost,
    errors: errorsPost,
    reset: resetPost
  } = useForm<Post>({
    defaultValues: getDefaultValues()
  })

  const handleReset = () => {
    resetPost(getDefaultValues())
  }

  const post = {
    body: watchPost('body'),
    title: watchPost('title'),
    createdAt: watchPost('createdAt'),
    key: ''
  }

  const handleCreate = (data: Pick<Post, 'title' | 'body' | 'createdAt'>) => {
    storedPost.create(data.title, data.body, data.createdAt)
      .then((post: firebase.database.Reference) => {
        Materialize.toast({ html: 'The new post was successfully created.' })
        //return PushService.publish(post.key, self.post)
      })
      /*.then(function () {
        self.busy = false
        e.target.reset()
        Materialize.toast('The new post was successfully published.')
      })*/
      .catch(function (err: Error) {
        console.error(err)
        Materialize.toast({ html: err.message })
      })
  }

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    watch: watchLogin
  } = useForm<{email: string, password: string}>()

  const [user, setUser] = useState(authService.getUser())

  const handleLogin = () => {
    authService.login(watchLogin('email'), watchLogin('password'))
      .then(setUser)
      .catch(function (err: Error) {
        console.error(err)
        Materialize.toast({html: err.message})
      })
  }

  const handleLogout = () => {
    authService.logout().then(() => {
      setUser(null)
    })
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
          errors={errorsPost}
          heading="Creating a new post"
          register={registerPost}
          handleSubmit={handleSubmitPost(data => { handleCreate(data) })}
        >
          <button className="btn" type="submit">Submit</button>
          <button className="btn-flat" onClick={handleReset}>Reset</button>
          <button className="btn-flat" onClick={handleLogout}>Logout</button>
        </PostFormCard>

        <PostCards posts={[post]}></PostCards>
      </div>

      <LoginForm isOpen={user === null} handleSubmit={handleSubmitLogin(handleLogin)} register={registerLogin}/>

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