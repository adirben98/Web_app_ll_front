import  { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import  { CanceledError } from "../Services/api-client";
import RecipeRow, { recipeRow } from "./RecipeRow";
import recipeService from "../Services/recipe-service";

export default function SearchPage() {
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<recipeRow[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const params = new URLSearchParams(location.search);
  const queryParam = params.get("q");

  useEffect(() => {
    const { Categories, cancelCategories } = recipeService.getCategories();
    const { results, cancelSearch } = recipeService.searchRecipes(queryParam!);
    async function getData() {
        Categories.then((Categories) => setCategories(Categories.data));
        Categories.catch((error) => {
          if (error instanceof CanceledError) return;
          console.log(error);
        });
        results.then((results) => {
          const recipes = results.data.map((recipe) => {
            return {
              id: recipe._id!,
              recipeName: recipe.name,
              recipeImg: recipe.image,
              description: recipe.description,
            };
          });
          setSearchResults(recipes);

        })
        results.catch((error) => {
          if (error instanceof CanceledError) return;
          console.log(error);

        })
    
        setLoading(false);
      
    }
    getData();
    return () => {
      cancelCategories();
      cancelSearch()
    };
  }, [queryParam]);

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
            {"Your search result for: "}
            {queryParam}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {searchResults.map((recipe) => (
              <div
                key={recipe.id}
                style={{
                  flex: "1 1 calc(33.333% - 10px)",
                  boxSizing: "border-box",
                }}
              >
                <RecipeRow
                  recipeImg={recipe.recipeImg}
                  id={recipe.id}
                  description={recipe.description}
                  recipeName={recipe.recipeName}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
