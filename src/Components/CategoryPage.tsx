import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth,{ CanceledError } from "../Services/useAuth";
import { IRecipe } from "./Recipe";
import RecipeRow from "./RecipeRow";
import recipeService from "../Services/recipe-service";

export default function CategoryPage() {
  const { name } = useParams();
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { isLoading } = useAuth();
  const errorHandler = (error: unknown) => {
    if (error instanceof CanceledError) return;
    console.log(error);
  }


  useEffect(() => {

  
  
    const { getCategories, cancelCategories } = recipeService.getCategories();
    const { results, cancelSearch } = recipeService.searchCategory(name!);
    const getData = async () => {
        console.log("starting")
        getCategories.then((res) => {
        setCategories(res.data);
        console.log(res)
        if (!categories.includes(name!)) {
          window.location.href = "/404";
        }
        }
          ).catch((err)=>{errorHandler(err)})
        
        results.then((res2) =>{
          setRecipes(res2.data);

        }).catch((err)=>{errorHandler(err)})
      
      setLoading(isLoading);
    };
      getData();
    return () => {

      cancelCategories();
      cancelSearch();
    };
  }, [name,isLoading]);

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
                <Link className="dropdown-item" to={"/recipe"}>
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
  );
}
