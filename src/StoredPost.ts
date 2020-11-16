import dayjs from 'dayjs'
import firebase from 'firebase/app'

export class StoredPost {
  readonly ref: firebase.database.Reference

  constructor(ref: firebase.database.Reference) {
    this.ref = ref
  }

  create(title: string, body: string, createdAt: string): firebase.database.ThenableReference {
    return this.ref.push({
      title: title,
      body: body,
      createdAt: dayjs(createdAt).toISOString()
    })
  }
}
