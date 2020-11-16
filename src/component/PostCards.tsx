import React from 'react';

export interface Props {
  posts: {
    key: string
    title: string
    body: string
    createdAt: string
  }[]
}

export const PostCards = ({ posts }: Props) => {
  return (
    <div className="mdl-grid">
      {
        posts.map(post =>
          <div className="card" id={post.key} key={post.key}>
            <div className="card-title white-text pink lighten-1">{post.title}</div>
            <div className="card-content">
              {
                post.body.split('\n').map((line, index) =>
                  <p key={index}>{line}</p>
                )
              }
              <p>{post.createdAt}</p>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default PostCards
