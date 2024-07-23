import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth, { CanceledError } from "../Services/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faThumbsUp,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Comment, { IComment } from "./Comment";
import CommentCreate from "./CommentCreation";
import userService from "../Services/user-service";
import recipeService from "../Services/recipe-service";
import commentService from "../Services/comment-service";

export interface IRecipe {
  _id?: string;
  name: string;
  author: string;
  authorImg: string;
  category: string;
  ingredients: string[];
  instructions: string;
  description: string;
  createdAt: string;
  image: string;
  likes: number;
  likedBy: string[];
}

export default function Recipe() {
  const googleFontUrl =
    "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap";
  const { id } = useParams();
  const [recipe, setRecipe] = useState<IRecipe>({
    name: "",
    author: "",
    authorImg: "",
    category: "",
    ingredients: [],
    instructions: "",
    description: "",
    createdAt: "",
    image: "",
    likes: 0,
    likedBy: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [like, setLike] = useState<boolean>(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const [renderNeeded, setRenderNeeded] = useState<boolean>(false);

  const { isLoading } = useAuth();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = googleFontUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const { recipe, cancelRecipe } = recipeService.getRecipe(id!);
    const { isLike, cancelLike } = recipeService.isLiked(id!);
    const { comments, cancelComments } = commentService.getComments(id!);

    function errorHandler(error: unknown) {
      if (error instanceof CanceledError) return;
      window.location.href = "/404";
      console.log(error);
    }
    recipe
      .then((recipe) => setRecipe(recipe.data))
      .catch((error) => {
        errorHandler(error);
      });

    comments
      .then((comments) => setComments(comments.data))
      .catch((error) => {
        errorHandler(error);
      });

    isLike
      .then((isLike) => setLike(isLike.data))
      .catch((error) => {
        errorHandler(error);
      });

    setLoading(isLoading);
    function cancel() {
      cancelRecipe();
      cancelComments();
      cancelLike();
    }

    return () => cancel();
  }, [id, isLoading, renderNeeded]);

  function deleteRecipe() {
    recipeService
      .deleteRecipe(id!)
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function likeClick() {
    if (!like) {
      recipeService
        .like(id!)
        .then(() => {
          setRecipe((prevRecipe) => ({
            ...prevRecipe,
            likes: prevRecipe.likes + 1,
          }));
          setLike(true);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      recipeService
        .unlike(id!)
        .then(() => {
          setRecipe((prevRecipe) => ({
            ...prevRecipe,
            likes: prevRecipe.likes - 1,
          }));
          setLike(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        ></div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ display: "flex" }}>
      <div className="sidebar" style={{ flex: "1" }}></div>
      <div
        style={{
          flex: "2",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "sans-serif",
          backgroundColor: "#ffffff",
          padding: "20px",
        }}
      >
        <img
          src={recipe.image}
          style={{ width: "80%", maxWidth: "500px", margin: "10px auto" }}
          alt="Recipe"
        />
        <div>
          <h2 style={{ fontWeight: "bolder", margin: "10px 0" }}>
            {recipe.name}
          </h2>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              type="button"
              className="btn"
              onClick={() => {
                window.location.href = `/editRecipe/${id}`;
              }}
              style={{ marginRight: "10px" }}
            >
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="fa-xl tinted-icon"
              />
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                deleteRecipe();
              }}
              style={{ marginRight: "10px" }}
            >
              <FontAwesomeIcon icon={faTrash} className="fa-xl tinted-icon" />
            </button>
          </div>
        </div>

        <p style={{ margin: "10px 0" }}>{recipe.description}</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            margin: "20px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
          <img
              src={recipe.authorImg}
              style={{ borderRadius: "50%", width: "50px", height: "50px", cursor: "pointer" }}
              alt="Author"
              onClick={() => {
                window.location.href = `/profile/${recipe.author}`;
              }}
            />
            <h3 onClick={()=>window.location.href='/profile/'+recipe.author} style={{ marginRight: "20px" }}>{recipe.author}</h3>
          
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {userService.getConnectedUser().username !== recipe.author && (
              <button
                type="button"
                className="btn"
                onClick={likeClick}
                style={{ marginRight: "10px" }}
              >
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  className="fa-xl tinted-icon"
                  style={{ color: like ? "green" : "inherit" }}
                />
              </button>
            )}
            <span style={{ padding: "25px 20px" }}>Likes: {recipe.likes}</span>
          </div>
        </div>
        <div style={{ width: "100%" }}>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h2 style={{ marginTop: "25px" }}>Instructions</h2>
          <p>{recipe.instructions}</p>
          <h2 style={{ marginTop: "25px" }}>Created At</h2>
          <p>{recipe.createdAt}</p>
        </div>
        <h2 style={{ marginTop: "50px", textAlign: "center" }}>Comments</h2>
        <CommentCreate
          author={userService.getConnectedUser().username!}
          recipeId={`${id}`}
          handle={() => setRenderNeeded((prev) => !prev)}
        />
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
              onUpdateHandler={() => setRenderNeeded((prev) => !prev)}
            />
          ))}
        </div>
      </div>
      <div className="sidebar" style={{ flex: "1" }}></div>
    </div>
  );
}
