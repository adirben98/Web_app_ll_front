import React from 'react'
interface props{
    recipeImg:string;
    recipeName:string;
    description:string;
}

export default function RecipeRow({recipeImg,recipeName,description}:props) {
  return (
    <div className="col-md-4">
      <div className="card mb-4">
        <img src={recipeImg} className="card-img-top" alt={recipeName} />
        <div className="card-body">
          <h5 className="card-title">{recipeName}</h5>
          <p className="card-text">{description}</p>
        </div>
      </div>
    </div>
  )
}
