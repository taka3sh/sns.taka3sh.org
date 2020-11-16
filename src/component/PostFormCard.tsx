import React, { ReactNode } from 'react'

import { Post } from './PostTypes'

export interface Props {
  children: ReactNode
  heading: string
  post: Post
  handleChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleChangeBody: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleChangeCreatedAt: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const PostFormCard = ({
  children,
  heading,
  post,
  handleChangeTitle,
  handleChangeBody,
  handleChangeCreatedAt
}: Props) => {
  return (
    <form action="#" method="POST" className="card">
      <div className="card-title white-text pink lighten-1">{heading}</div>
      <div className="card-content">
        <div className="input-field">
          <input id="title" type="text" required value={post.title} onChange={handleChangeTitle}/>
          <label htmlFor="title">Title</label>
        </div>
        <div className="input-field">
          <textarea id="body" className="materialize-textarea" required onChange={handleChangeBody}>{post.body}</textarea>
          <label htmlFor="body">Body</label>
        </div>
        <div className="input-field">
          <label htmlFor="createdAt" className="active">Created at</label>
        </div>
      </div>
      <div className="card-action">
        {children}
      </div>
    </form>
  )
}
