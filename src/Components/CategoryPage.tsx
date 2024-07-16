import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import apiClient from '../Services/api-client'
import { IRecipe } from './Recipe'
import RecipeRow from './RecipeRow'

export default function CategoryPage() {
    const {name}=useParams()  
    const [recipes,setRecipes]=useState<IRecipe[]>([])
    const [categories,setCategories]=useState<string[]>([])
    
    useEffect(() => {

        const controller=new AbortController()
        async function getData(){
            try{
                const Categories = await apiClient.get<string[]>(
                    "/recipe/getCategories",
                    { signal: controller.signal }
                  );
                  setCategories(Categories.data);
                const res=await apiClient.get(`/recipe/categorySearch/${name}`,{signal:controller.signal})
                setRecipes(res.data)
            }
            catch(error){
                console.log(error)
            }
        }
        getData()
       return ()=>{controller.abort()}
    },[])
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <div
          className="btn-group"
          style={{ marginRight: "20px", height: "10vh" }}
        >
          <button
            type="button"
            className="btn btn-primary dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Categories
          </button>
          <ul className="dropdown-menu">
            {categories.map((category) => (
              <li key={category}>
                <Link className="dropdown-item" to={'/recipe'}>
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div
          style={{
            flex: 1,
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ color: "#333" }}>
            {name}
            {":"}

          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                style={{
                  flex: "1 1 calc(33.333% - 10px)",
                  boxSizing: "border-box",
                }}
              >
                <RecipeRow
                  recipeImg={recipe.image}
                  id={recipe._id!}
                  description={recipe.description}
                  recipeName={recipe.name}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
