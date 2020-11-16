import React from 'react';
import { UseFormMethods } from 'react-hook-form';
import Modal from 'react-modal';

export interface Props extends Pick<UseFormMethods<{email: string, password: string}>, 'register'> {
  readonly isOpen: boolean
  readonly handleSubmit: () => void
}

export const LoginForm = ({ isOpen, handleSubmit, register }: Props) => (
  <Modal isOpen={isOpen}>
    <div id="logindialog">
      <form action="#" method="POST" onSubmit={handleSubmit}>
        <div>
          <h4>Login</h4>
          <div className="row">
            <div className="input-field col s12">
              <label htmlFor="email">
                <input id="email" name="email" type="email" ref={register({ required: true })} />
                Email
              </label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <label htmlFor="password">
                <input id="password" name="password" type="password" ref={register({ required: true })} />
                Password
              </label>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-flat" type="submit">Login</button>
        </div>
      </form>
    </div>
  </Modal>
);
