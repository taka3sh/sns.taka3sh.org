export interface Post {
  readonly title: string
  readonly body: string
  readonly createdAt: string
}

export interface PostWithKey extends Post {
  readonly key: string
}
