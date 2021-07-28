import { PostWithKey } from '../PostTypes'
import React from 'react'
import dayjs from 'dayjs'

import 'dayjs/locale/ja'

dayjs.locale('ja')

export interface PostCardsProps {
  readonly posts: PostWithKey[]
}

export const PostCards: React.VFC<PostCardsProps> = ({ posts }) => (
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
