import React from 'react';
import user from '../Services/user-service';

export interface IComment {
  author: string;
  content: string;
  recipeId: string;
  createdAt: number;
  edited: boolean;
}

const Comment: React.FC<IComment> = ({ author, content, createdAt, edited }) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      padding: '10px',
      borderRadius: '5px',
      margin: '10px 0',
      backgroundColor: '#f9f9f9',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{author}</span>
        <span style={{ fontSize: '0.8em', color: '#666' }}>{new Date(createdAt).toLocaleString()}</span>
      </div>
      <p style={{ margin: '10px 0' }}>{content}</p>
      {edited && <span style={{ fontSize: '0.8em', color: '#999' }}>Edited</span>}
      {user===author && <button style={{    padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer',
            margin: '10px 0',}} />}
    </div>
  );
}

export default Comment;
