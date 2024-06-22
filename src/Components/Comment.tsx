import React, { useState } from 'react';
import User from '../Services/user-service';
import apiClient from '../Services/api-client';

export interface IComment {
    _id: string;
  author: string;
  content: string;
  recipeId: string;
  createdAt: number;
  edited: boolean;
  onUpdateHandler: () => void;
}

const Comment: React.FC<IComment> = ({ _id,author, content,createdAt, edited, onUpdateHandler }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>(content);
  async function deleteComment() {
    try{
        const res=await apiClient(User.getUser().accessToken!).delete(`/comment/${_id}`)
        console.log(res);
        onUpdateHandler()
    }
    catch(error){
      console.log(error);
    }
  }

  async function handleEdit() {
    try{
    const newComment={
        _id:_id,
        author:author,
        content:newContent,
        recipeId:"6669866c8369a34d2f140a13",
        createdAt:createdAt,
        edited:true
    }
    const res=await apiClient(User.getUser().accessToken!).put(`/comment`,newComment)
    console.log(res);
    setIsEditing(false);
    onUpdateHandler()
    }catch(error){
      console.log(error);
    }
  }

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
      {isEditing ? (
        <>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            style={{
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              resize: 'none',
              height: '100px'
            }}
          />
          <button onClick={() => {
            setIsEditing(false)}} style={{ marginRight: '10px' }}>Cancel</button>
          <button
            onClick={handleEdit}
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer',
              margin: '10px 0',
            }}
          >
            Save
          </button>
        </>
      ) : (
        <>
        

          <p style={{ margin: '10px 0' }}>{content}</p>
          {edited && <span style={{ fontSize: '0.8em', color: '#999' }}>Edited</span>}
          {User.getUser().username === author && (
            <div>
                 <button
              style={{
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer',
                margin: '10px 0',
              }}
              onClick={() => {
                setIsEditing(true)
                setNewContent(content)

              }
                
            
            }
            >
              Edit
            </button>
            <button
              style={{
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: 'red',
                color: 'white',
                cursor: 'pointer',
                margin: '10px 0',
              }}
              onClick={() => deleteComment()}
            >
              Delete
            </button>
            
            </div>
           
            
          )}
        </>
      )}
    </div>
  );
}

export default Comment;
