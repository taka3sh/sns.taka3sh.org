
import { Post, PostWithKey } from './PostTypes'
import React, { useState } from 'react'
import {
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseDatabaseURL,
  firebaseMessagingSenderId,
  postPrefix,
  pushEndpoint
} from './constants/development'

import { AuthService } from './AuthService'
import { Footer } from './component/Footer'
import { Header } from './component/Header'
import { LoginForm } from './component/LoginForm'
import Materialize from 'materialize-css'
import { PostCards } from './component/PostCards'
import { PostFormCard } from './component/PostFormCard'
import { PushService } from './PushService'
import { StoredPost } from './StoredPost'
import dayjs from 'dayjs'
import firebase from 'firebase/app'
import { useForm } from 'react-hook-form'

import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'
import 'materialize-css/dist/css/materialize.min.css'

firebase.initializeApp({
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  databaseURL: firebaseDatabaseURL,
  messagingSenderId: firebaseMessagingSenderId
})

const auth = firebase.auth()
const database = firebase.database()

const authService = new AuthService(auth)
const pushService = new PushService(auth, pushEndpoint)
const storedPost = new StoredPost(database.ref(postPrefix))

const getDefaultValues = () => ({
  body: '',
  createdAt: dayjs().format('YYYY-MM-DDTHH:mm'),
  title: ''
})

const CreateApp: React.FC<unknown> = () => {
  const {
    register: registerPost,
    handleSubmit: handleSubmitPost,
    watch: watchPost,
    formState: formStatePost,
    reset: resetPost
  } = useForm<Post>({
    defaultValues: getDefaultValues()
  })

  const handleReset = () => {
    resetPost(getDefaultValues())
    Materialize.updateTextFields()
  }

  const post: PostWithKey = {
    body: watchPost('body'),
    createdAt: watchPost('createdAt'),
    key: '',
    title: watchPost('title')
  }

  const handleCreate = (data: Post) => {
    storedPost
      .create(data.title, data.body, data.createdAt)
      .then((postRef: firebase.database.Reference) => {
        Materialize.toast({ html: 'The new post was successfully created.' })
        if (postRef.key === null) {
          throw new Error('Key is not generated')
        }
        return pushService.publish(postRef.key, data)
      })
      .then(() => {
        handleReset()
        Materialize.toast({ html: 'The new post was successfully published.' })
      })
      .catch((err: Error) => {
        Materialize.toast({ html: err.message })
      })
  }

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    watch: watchLogin
  } = useForm<{ email: string; password: string }>()

  const [user, setUser] = useState(AuthService.getUser())

  const handleLogin = () => {
    authService
      .login(watchLogin('email'), watchLogin('password'))
      .then(setUser)
      .catch((err: Error) => {
        Materialize.toast({ html: err.message })
      })
  }

  const handleLogout = () => {
    authService.logout().then(() => {
      setUser(false)
    })
  }

  return (
    <div className="grey lighten-3">
      <Header />

      <div className="container" id="app">
        <PostFormCard
          formState={formStatePost}
          heading="Creating a new post"
          register={registerPost}
          handleSubmit={handleSubmitPost((data) => {
            handleCreate(data)
          })}
        >
          <button className="btn" type="submit">
            Submit
          </button>
          <button className="btn-flat" type="button" onClick={handleReset}>
            Reset
          </button>
          <button className="btn-flat" type="button" onClick={handleLogout}>
            Logout
          </button>
        </PostFormCard>

        <PostCards posts={[post]} />
      </div>

      <LoginForm
        isOpen={user === false}
        handleSubmit={handleSubmitLogin(handleLogin)}
        register={registerLogin}
      />

      <Footer />
    </div>
  )
}

export default CreateApp
