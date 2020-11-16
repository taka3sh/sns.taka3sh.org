import React from 'react'
import { UseFormMethods } from "react-hook-form";

import { Post } from './PostTypes'

export interface Props extends React.PropsWithChildren<Pick<UseFormMethods<Post>, 'register' | 'errors' >> {
  readonly heading: string
  readonly onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export const PostFormCard = ({
  children,
  errors,
  heading,
  onSubmit,
  register
}: Props) => {
  return (
    <form action="#" method="POST" className="card" onSubmit={onSubmit}>
      <div className="card-title white-text pink lighten-1">{heading}</div>
      <div className="card-content">
        <div className="input-field">
          <input id="title" name="title" type="text" ref={register({ required: true })} />
          <label htmlFor="title">Title</label>
        </div>
        <div className="input-field">
          <textarea id="body" name="body" className="materialize-textarea" ref={register({ required: true })}></textarea>
          <label htmlFor="body">Body</label>
        </div>
        <div className="input-field">
          <input id="createdAt" name="createdAt" type="text" ref={register({ required: true, pattern: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/ })} />
          <label htmlFor="createdAt" className="active">Created at</label>
          {errors.createdAt && <span>Invalid date</span>}
        </div>
      </div>
      <div className="card-action">
        {children}
      </div>
    </form>
  )
}
