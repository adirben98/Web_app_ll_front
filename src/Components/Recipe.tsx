import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../Services/api-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import Comment, { IComment } from "./Comment";
import CommentCreate from "./CommentCreation";
import User from '../Services/user-service';

export interface IRecipe {
  _id?: string;
  name: string;
  author: string;
  authorImg: string;
  category: string;
  ingredients: string[];
  instructions: string;
  description: string;
  createdAt: number;
  image: string;
  likes: number;
  likedBy: string[];
}

export default function Recipe() {
  const googleFontUrl = "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap";
  const { id } = useParams();
  const [recipe, setRecipe] = useState<IRecipe>(null!);
  const [loading, setLoading] = useState<boolean>(true);
  const [like, setLike] = useState<boolean>(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const [renderNeeded, setRenderNeeded] = useState<boolean>(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = googleFontUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const controller = new AbortController();

    async function getData() {
      try {
        const res = await apiClient.get(`/comment/${id}`, { signal: controller.signal });
        setComments(res.data);

        const res1 = await apiClient.get(`/recipe/isLiked/${id}`, { signal: controller.signal });
        setLike(res1.data);

        const recipe = await apiClient.get(`/recipe/${id}`, { signal: controller.signal });
        setRecipe(recipe.data);

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
    return () => { controller.abort() };
  }, [id, renderNeeded]);

  async function likeClick() {
    try {
      if (!like) {
        await apiClient.post(`/recipe/like/${id}`);
        setRecipe(prevRecipe => ({ ...prevRecipe, likes: prevRecipe.likes + 1 }));
        setLike(true);
      } else {
        await apiClient.post(`/recipe/unlike/${id}`);
        setRecipe(prevRecipe => ({ ...prevRecipe, likes: prevRecipe.likes - 1 }));
        setLike(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ display: 'flex' }}>
      <div className="sidebar" style={{ flex: "1", backgroundColor: "#579fba" }}></div>
      <div style={{ flex: "2", display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "sans-serif", backgroundColor: "#FFFDD0", padding: "20px" }}>
        <img src={recipe.image} style={{ width: '80%', maxWidth: '500px', margin: "10px auto" }} alt="Recipe" />
        <h2 style={{ fontWeight: "bolder", margin: "10px 0" }}>{recipe.name}</h2>
        <p style={{ margin: "10px 0" }}>{recipe.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', margin: "20px 0" }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ marginRight: "20px" }}>{recipe.author}</h3>
            <img src={recipe.authorImg} style={{ borderRadius: '50%', width: '50px', height: '50px' }} alt="Author" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {User.getUser().username !== recipe.author && (
              <button type="button" className="btn" onClick={likeClick} style={{ marginRight: '10px' }}>
                <FontAwesomeIcon icon={faThumbsUp} className="fa-xl tinted-icon" style={{ color: like ? 'green' : 'inherit' }} />
              </button>
            )}
            <span style={{ padding: "25px 20px" }}>Likes: {recipe.likes}</span>
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>)}
          </ul>
          <h2 style={{ marginTop: "25px" }}>Instructions</h2>
          <p>{recipe.instructions}</p>
        </div>
        <h2 style={{ marginTop: "50px", textAlign: 'center' }}>Comments</h2>
        <CommentCreate author={User.getUser().username!} recipeId={`${id}`} handle={() => setRenderNeeded(!renderNeeded)} />
        <div>
          {comments.map((comment, index) => (
            <Comment
              key={index}
              _id={comment._id}
              author={comment.author}
              content={comment.content}
              recipeId={comment.recipeId}
              createdAt={comment.createdAt}
              edited={comment.edited}
              onUpdateHandler={() => setRenderNeeded(!renderNeeded)}
            />
          ))}
        </div>
      </div>
      <div className="sidebar" style={{ flex: "1", backgroundColor: "#579fba" }}></div>
    </div>
  );
}
