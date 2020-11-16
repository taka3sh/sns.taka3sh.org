import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/messaging';

import dayjs from 'dayjs';

import Materialize from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

import StoredPost from './StoredPost';
import AuthService from './AuthService';
import PushService from './PushService';

import { Post, PostWithKey } from './PostTypes';
import { PostCards } from './component/PostCards';
import { PostFormCard } from './component/PostFormCard';
import { LoginForm } from './component/LoginForm';

import {
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseDatabaseURL,
  firebaseMessagingSenderId,
  pushEndpoint,
  postPrefix,
} from './constants/development';

firebase.initializeApp({
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  databaseURL: firebaseDatabaseURL,
  messagingSenderId: firebaseMessagingSenderId,
});

const auth = firebase.auth();
const database = firebase.database();

const authService = new AuthService(auth);
const pushService = new PushService(auth, pushEndpoint);
const storedPost = new StoredPost(database.ref(postPrefix));

const getDefaultValues = () => ({
  body: '',
  title: '',
  createdAt: dayjs().format('YYYY-MM-DDTHH:mm'),
});

const CreateApp = () => {
  const {
    register: registerPost,
    handleSubmit: handleSubmitPost,
    watch: watchPost,
    errors: errorsPost,
    reset: resetPost,
  } = useForm<Post>({
    defaultValues: getDefaultValues(),
  });

  const handleReset = () => {
    resetPost(getDefaultValues());
    Materialize.updateTextFields();
  };

  const post: PostWithKey = {
    body: watchPost('body'),
    title: watchPost('title'),
    createdAt: watchPost('createdAt'),
    key: '',
  };

  const handleCreate = (data: Post) => {
    storedPost.create(data.title, data.body, data.createdAt)
      .then((postRef: firebase.database.Reference) => {
        Materialize.toast({ html: 'The new post was successfully created.' });
        if (postRef.key === null) { throw new Error('Key is not generated'); }
        return pushService.publish(postRef.key, data);
      })
      .then(() => {
        handleReset();
        Materialize.toast({ html: 'The new post was successfully published.' });
      })
      .catch((err: Error) => {
        Materialize.toast({ html: err.message });
      });
  };

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    watch: watchLogin,
  } = useForm<{email: string, password: string}>();

  const [user, setUser] = useState(AuthService.getUser());

  const handleLogin = () => {
    authService.login(watchLogin('email'), watchLogin('password'))
      .then(setUser)
      .catch((err: Error) => {
        Materialize.toast({ html: err.message });
      });
  };

  const handleLogout = () => {
    authService.logout().then(() => {
      setUser(false);
    });
  };

  return (
    <div className="grey lighten-3">
      <nav className="pink darken-1">
        <div className="nav-wrapper container">
          <span className="brand-logo">支援隊ヌーボー</span>
        </div>
      </nav>

      <div className="container" id="app">
        <PostFormCard
          errors={errorsPost}
          heading="Creating a new post"
          register={registerPost}
          handleSubmit={handleSubmitPost((data) => { handleCreate(data); })}
        >
          <button className="btn" type="submit">Submit</button>
          <button className="btn-flat" type="button" onClick={handleReset}>Reset</button>
          <button className="btn-flat" type="button" onClick={handleLogout}>Logout</button>
        </PostFormCard>

        <PostCards posts={[post]} />
      </div>

      <LoginForm
        isOpen={user === false}
        handleSubmit={handleSubmitLogin(handleLogin)}
        register={registerLogin}
      />

      <footer className="page-footer grey darken-3 white-text">
        <div className="container">
          <div>Copyright © 2015-2017 高井戸第三小学校学校支援本部</div>
          <div>
            Developed by
            <a href="https://github.com/umireon">umireon</a>
            .
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreateApp;
