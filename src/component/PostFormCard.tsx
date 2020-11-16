import React from 'react'
import { UseFormMethods } from 'react-hook-form'

import { Post } from '../PostTypes'

export interface Props
  extends React.PropsWithChildren<
    Pick<UseFormMethods<Post>, 'register' | 'errors'>
  > {
  readonly heading: string
  readonly handleSubmit: () => void
}

export const PostFormCard: React.FC<Props> = ({
  children,
  errors,
  heading,
  handleSubmit,
  register,
}: Props) => (
  <form action="#" method="POST" className="card" onSubmit={handleSubmit}>
    <div className="card-title white-text pink lighten-1">{heading}</div>
    <div className="card-content">
      <div className="input-field">
        <label htmlFor="title">
          <input
            id="title"
            name="title"
            type="text"
            ref={register({ required: true })}
          />
          Title
        </label>
      </div>
      <div className="input-field">
        <label htmlFor="body">
          <textarea
            id="body"
            name="body"
            className="materialize-textarea"
            ref={register({ required: true })}
          />
          Body
        </label>
      </div>
      <div className="input-field">
        <label htmlFor="createdAt" className="active">
          <input
            id="createdAt"
            name="createdAt"
            type="text"
            ref={register({
              required: true,
              pattern: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/,
            })}
          />
          Created at
        </label>
        {errors.createdAt && <span>Invalid date</span>}
      </div>
    </div>
    <div className="card-action">{children}</div>
  </form>
)
