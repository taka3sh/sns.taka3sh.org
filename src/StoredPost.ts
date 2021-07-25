import firebase from 'firebase/app'

export default class {
  readonly ref: firebase.database.Reference

  constructor (ref: firebase.database.Reference) {
    this.ref = ref
  }

  create (
    title: string,
    body: string,
    createdAt: string
  ): firebase.database.ThenableReference {
    return this.ref.push({
      body,
      createdAt: new Date(createdAt).toISOString(),
      title
    })
  }
}
