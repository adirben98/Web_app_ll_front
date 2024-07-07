import React from 'react'
import { Link } from 'react-router-dom';
interface props{
    recipeImg:string;
    recipeName:string;
    description:string;
    id:string;
}

export default function RecipeRow({  id,recipeImg,recipeName,description}:props) {
    
  return (
    <div className="col-md-4 d-flex align-items-stretch">
    <div className="card mb-4" style={{ height: '30vh', width: '30vh', display: 'flex', flexDirection: 'column' }}>
      <Link to={`/recipe/${id}`} >
      <img src={recipeImg} className="card-img-top" alt={recipeName} style={{ height: '15vh', objectFit: 'cover' }}  />

      </Link>

      
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1rem' }}>
        <h5 className="card-title" >
        <Link to={`/recipe/${id}`} >{recipeName}</Link>
            </h5>
        <p className="card-text" style={{ padding: '1px'  }}>{description}</p>
      </div>
    </div>
  </div>
  )
}