import React from 'react'

import dayjs from 'dayjs'

import 'dayjs/locale/ja'

import { PostWithKey } from '../PostTypes'

dayjs.locale('ja')

export interface Props {
  readonly posts: PostWithKey[]
}

export const PostCards: React.FC<Props> = ({ posts }: Props) => (
  <div className="mdl-grid">
    {posts.map((post) => (
      <div className="card" id={post.key} key={post.key}>
        <div className="card-title white-text pink lighten-1">{post.title}</div>
        <div className="card-content">
          {post.body.split('\n').map((line, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={index}>{line}</p>
          ))}
          <p>{dayjs(post.createdAt).format('YYYY年MM月DD日 dddd HH:mm:ss')}</p>
        </div>
      </div>
    ))}
  </div>
)

export default PostCards
