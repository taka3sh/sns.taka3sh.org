import React from 'react';

import { PostWithKey } from '../PostTypes';

export interface Props {
  readonly posts: PostWithKey[]
}

export const PostCards: React.FC<Props> = ({ posts }: Props) => (
  <div className="mdl-grid">
    {
        posts.map((post) => (
          <div className="card" id={post.key} key={post.key}>
            <div className="card-title white-text pink lighten-1">{post.title}</div>
            <div className="card-content">
              {
                // eslint-disable-next-line react/no-array-index-key
                post.body.split('\n').map((line, index) => <p key={index}>{line}</p>)
              }
              <p>{post.createdAt}</p>
            </div>
          </div>
        ))
      }
  </div>
);

export default PostCards;
