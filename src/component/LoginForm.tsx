import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import Modal from 'react-modal'

export interface Props
  extends Pick<UseFormReturn<{ email: string; password: string }>, 'register'> {
  readonly isOpen: boolean
  readonly handleSubmit: () => void
}

export const LoginForm: React.FC<Props> = ({
  isOpen,
  handleSubmit,
  register,
}: Props) => (
  <Modal isOpen={isOpen}>
    <div id="logindialog">
      <form action="#" method="POST" onSubmit={handleSubmit}>
        <div>
          <h4>Login</h4>
          <div className="row">
            <div className="input-field col s12">
              <input
                id="email"
                type="email"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...register('email', { required: true })}
              />
              <label htmlFor="email">Email</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input
                id="password"
                type="password"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...register('password', { required: true })}
              />
              <label htmlFor="password">Password</label>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-flat" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  </Modal>
)
