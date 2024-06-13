import  { useEffect, useState } from "react";
//import {useParams} from "react-router-dom";
import apiClient from "../Services/api-client";
import bread from "../assets/bread.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import Comment,{IComment} from "./Comment";
import CommentCreate from "./CommentCreate";
import user from '../Services/user-service';



export default function Recipe() {

  interface IRecipe{
    _id: string;
    name: string;
    author: string;
    authorImg:string;
    category: string;
    ingredients: string[];
    instructions: string;
    description: string;
    createdAt:Date
    image: string;
    likes: number;
    likedBy: string[];
  }
  const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjZhMTgzNWQyOGNjMzc5N2I0NzMzODEiLCJyYW5kb20iOiI1NDYxNTUiLCJpYXQiOjE3MTgyMjkwNDV9.r-Q01kk1HG1c8SQ6NMJOT9SQ8PkI2Mrx3KjVGpR-8ZQ"
  const googleFontUrl="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap";
  //const {id}=useParams();
  const [recipe,setRecipe] = useState<IRecipe>(null!);
  const [loading,setLoading] = useState<boolean>(true);
  const[like,setLike]=useState<boolean>(false)
  const[Comments,setComments]=useState<IComment[]>([])
  const[renderNeeded,setRenderNeeded]=useState<boolean>(false)

  useEffect(()=>{
    const link = document.createElement('link');
    link.href = googleFontUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    async function getRecipe(){
      try{
        const recipe=await apiClient(token).get("/recipe/6669866c8369a34d2f140a13");
        setRecipe(recipe.data);
        console.log(recipe);
        setLoading(false);
        }
        catch(error){
          //console.log(error);
        }
      }
    async function isLiked(){
      try{
        const res=await apiClient(token).get("/recipe/isLiked/6669866c8369a34d2f140a13")
        console.log(res)
        if (res.data){
        setLike(true)
        }
        else{
          setLike(false)
        }
      }catch(error){
        console.log(error)
      }
    }
    async function getComments(){
      try{
        const res=await apiClient(token).get("/comment/6669866c8369a34d2f140a13")
        console.log(res)
        setComments(res.data)
      }
      catch(error){
        console.log(error);
      }
    }
    getComments();
    isLiked();
    getRecipe();
    
  }
  ,[renderNeeded]);

  async function likeInc(){
    console.log("Like")
    try{
    if(!like){
      apiClient(token).post("/recipe/like/6669866c8369a34d2f140a13",{
      }).then((response)=>{
        console.log(response);
        recipe.likes+=1
      setLike(true)

      }).catch((error)=>{
        console.log(error);
      })

    }
    else
    {
      const res=await apiClient(token).post("/recipe/unlike/6669866c8369a34d2f140a13")
      recipe.likes-=1

      setLike(false)

      console.log(res)
    }}
    catch(error){
      console.log(error)
    }
  }
  
  
  if(loading){
    return     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
    </div>
  </div>}



  return (
    <div className="page-container" style={{display: 'flex'}}>
    <div className="sidebar" style={{flex:"1", backgroundColor:"#579fba"}}></div>
    <div style={{ flex:"1",display: 'flex',flexDirection: 'column', justifyContent: 'center',fontFamily: "sans-serif",backgroundColor:"#FFFDD0"}}>
        <img src={bread} style={{width: '500px',margin:"10px"}}/>
        <h2 style={{fontWeight: "bolder",marginLeft:"10px"}}>{recipe.name}</h2>        
        <p style={{marginLeft:"10px"}}>{recipe.description}</p>
        <div style={{flexDirection:'row', display:'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft:"10px", marginTop:"50px"}}>
  <div style={{display: 'flex', alignItems: 'center'}}>
    <h3 style={{marginRight:"20px"}}>{recipe.author}</h3>
    <img src={recipe.authorImg} style={{borderRadius: '50%', marginRight: '20px'}}/>
  </div>
  <div style={{display: 'flex', alignItems: 'center'}}>
    <button type="button" className="btn" onClick={likeInc} style={{marginRight: '10px'}}>
      <FontAwesomeIcon icon={faThumbsUp} className="fa-xl tinted-icon" style={{color: like ? 'green' : 'inherit'}} />
    </button>
    <span style={{padding: "25px 20px"}}>{recipe.likes}</span>
  </div>
</div>

        <div style={{marginLeft:"10px",marginTop:"25px"}}>
        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ingredient,index)=><li key={index}>{ingredient}</li>)}
        </ul>
        <h2 style={{marginTop:"25px"}}>Instructions</h2>
        <p>{recipe.instructions}</p>
        </div>
        <h2>Comments</h2>
        <CommentCreate author={user.username} recipeId="6669866c8369a34d2f140a13" token={user.accessToken} handle={()=>{setRenderNeeded(true)}}/>
        <div>
          {Comments.map((comment, index) => (
            <Comment
              key={index}
              author={comment.author}
              content={comment.content}
              recipeId={comment.recipeId}
              createdAt={comment.createdAt}
              edited={comment.edited}
            />
          ))}
        </div>
    </div>
    
    <div className="sidebar" style={{flex:"1", backgroundColor:"#579fba"}}></div>
    </div>
  )
}
