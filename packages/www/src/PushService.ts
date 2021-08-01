import { Post } from './PostTypes'
import dayjs from 'dayjs'
import firebase from 'firebase/app'
import logo192 from './logo192.png'

export class PushService {
  readonly auth: firebase.auth.Auth

  readonly endpoint: string

  constructor (auth: firebase.auth.Auth, endpoint: string) {
    this.auth = auth
    this.endpoint = endpoint
  }

  async publish (key: string, post: Post): Promise<void> {
    const { endpoint } = this

    const data = new FormData()
    data.append('key', key)
    data.append('title', post.title)
    data.append('body', post.body)
    data.append('createdAt', dayjs(post.createdAt).toISOString())
    data.append('imageUrl', new URL(logo192).pathname)

    if (this.auth.currentUser === null) throw new Error('User is not defined')

    const idToken = await this.auth.currentUser.getIdToken(true)
    data.append('idToken', idToken)

    const response = await fetch(endpoint, {
      body: data,
      method: 'POST',
      mode: 'cors'
    })
    if (!response.ok) throw new Error('Failed to publish')
  }
}
