import { Database, ThenableReference, push, ref } from 'firebase/database'

export class StoredPost {
  readonly database: Database
  readonly prefix: string

  constructor (database: Database, prefix: string) {
    this.database = database
    this.prefix = prefix
  }

  create (
    title: string,
    body: string,
    createdAt: string
  ): ThenableReference {
    return push(ref(this.database, this.prefix), {
      body,
      createdAt: new Date(createdAt).toISOString(),
      title
    })
  }
}
