import { Post } from '../PostTypes'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

export interface PostFormCardProps
  extends React.PropsWithChildren<
    Pick<UseFormReturn<Post>, 'register' | 'formState'>
  > {
  readonly heading: string
  readonly handleSubmit: () => void
}

export const PostFormCard: React.FC<PostFormCardProps> = ({
  children,
  formState,
  heading,
  handleSubmit,
  register
}: PostFormCardProps) => (
  <form action="#" method="POST" className="card" onSubmit={handleSubmit}>
    <div className="card-title white-text pink lighten-1">{heading}</div>
    <div className="card-content">
      <div className="input-field">
        <input
          id="title"
          type="text"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('title', { required: true })}
        />
        <label htmlFor="title">Title</label>
      </div>
      <div className="input-field">
        <textarea
          id="body"
          className="materialize-textarea"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('body', { required: true })}
        />
        <label htmlFor="body">Body</label>
      </div>
      <div className="input-field">
        <input
          id="createdAt"
          type="text"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('createdAt', {
            pattern: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/,
            required: true
          })}
        />
        <label htmlFor="createdAt" className="active">
          Created at
        </label>
        {formState.errors.createdAt && <span>Invalid date</span>}
      </div>
    </div>
    <div className="card-action">{children}</div>
  </form>
)
