import firebase from 'firebase/app'
import dayjs from 'dayjs'

import { Post } from './PostTypes'

export default class {
  readonly auth: firebase.auth.Auth

  readonly endpoint: string

  constructor(auth: firebase.auth.Auth, endpoint: string) {
    this.auth = auth
    this.endpoint = endpoint
  }

  publish(key: string, post: Post): Promise<void> {
    const { endpoint } = this

    const data = new FormData()
    data.append('key', key)
    data.append('title', post.title)
    data.append('body', post.body)
    data.append('createdAt', dayjs(post.createdAt).toISOString())

    if (this.auth.currentUser === null) throw new Error('User is not defined')

    return this.auth.currentUser.getIdToken(true).then((idToken) => {
      data.append('idToken', idToken)

      return fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        body: data,
      }).then((response) => {
        if (!response.ok) throw new Error('Failed to publish')
      })
    })
  }
}
