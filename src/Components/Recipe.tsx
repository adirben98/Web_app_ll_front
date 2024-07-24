import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth, { CanceledError } from "../Services/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faThumbsUp, faTrash } from "@fortawesome/free-solid-svg-icons";
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
  const [istheAuthor, setIsTheAuthor] = useState<boolean>(false);

  const { isLoading } = useAuth();

  function deleteRecipe() {
    recipeService
      .deleteRecipe(id!)
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
      });}

  useEffect(() => {
    const link = document.createElement("link");
    link.href = googleFontUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const { getRecipe, cancelRecipe } = recipeService.getRecipe(id!);
    const { isLike, cancelLike } = recipeService.isLiked(id!);
    const { comments, cancelComments } = commentService.getComments(id!);

    function errorHandler(error: unknown) {
      if (error instanceof CanceledError) return;
      window.location.href = "/404";
      console.log(error);
    }
    const user=userService.getConnectedUser()!;
    if(user.username===recipe.author){
      setIsTheAuthor(true);
    }
    getRecipe
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Open Sans', sans-serif",
        backgroundColor: "#ffffff",
        padding: "20px",
        minHeight: "100vh", 
      }}
    >
      <div
        style={{
          height: "400px", 
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <img
          src={recipe.image}
          style={{
            width: "500px",
            height: "100%",
            objectFit: "cover",
          }}
          alt="Recipe"
        />
      </div>
      <div>
          <h2 style={{ fontWeight: "bolder", margin: "10px 0" }}>
            {recipe.name}
          </h2>
          {istheAuthor && (
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
    )}
      </div>
      <p style={{ margin: "10px 0", textAlign: "center" }}>{recipe.description}</p>
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
    onClick={() => window.location.href = `/profile/${recipe.author}`}
  />
  <h3 style={{ marginLeft: "10x" }}>{recipe.author}</h3>
  <div style={{ display: "flex", alignItems: "center", marginLeft: "10px" }}>
    <span style={{ margin: "0 10px" }}>|</span>
    <div style={{ display: "flex", alignItems: "center" }}>
      <h5 style={{ fontSize: "14px", fontWeight: "bold", margin: 0 }}>Created At:</h5>
      <p style={{ fontSize: "12px", fontWeight: "bold", margin: "0 0 0 10px" }}>{recipe.createdAt}</p>
    </div>
  </div>
</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {userService.getConnectedUser()!.username !== recipe.author && (
            <button
              type="button"
              className="btn"
              onClick={likeClick}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              <FontAwesomeIcon
                icon={faThumbsUp}
                className={`fa-xl tinted-icon ${like ? "liked" : ""}`}
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
      </div>
      <h2 style={{ marginTop: "50px", textAlign: "center" }}>Comments</h2>
      <CommentCreate
        author={userService.getConnectedUser()!.username!}
        recipeId={`${id}`}
        handle={() => setRenderNeeded(!renderNeeded)}
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
            onUpdateHandler={() => setRenderNeeded(!renderNeeded)}
          />
        ))}
      </div>
 </div>
);
}