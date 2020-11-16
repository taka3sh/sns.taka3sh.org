import React from 'react'
import { UseFormMethods } from "react-hook-form";
import Modal from 'react-modal'

export interface Props extends Pick<UseFormMethods, 'register'> {
  readonly isOpen: boolean
  readonly handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export const LoginForm = ({isOpen, handleSubmit, register}: Props) => {
  return (
    <Modal isOpen={isOpen}>
      <div id="logindialog">
        <form action="#" method="POST" onSubmit={handleSubmit}>
          <div>
            <h4>Login</h4>
            <div className="row">
              <div className="input-field col s12">
                <input id="email" name="email" type="email" ref={register({ required: true })} />
                <label htmlFor="email">Email</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input id="password" name="password" type="password" ref={register({ required: true })} />
                <label htmlFor="password">Password</label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-flat" type="submit">Login</button>
          </div>
        </form>
      </div>
    </Modal>
  )
}