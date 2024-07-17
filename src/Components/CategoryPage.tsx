import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CanceledError } from "../Services/api-client";
import { IRecipe } from "./Recipe";
import RecipeRow from "./RecipeRow";
import recipeService from "../Services/recipe-service";

export default function CategoryPage() {
  const { name } = useParams();
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const { Categories, cancelCategories } = recipeService.getCategories();
    const { results, cancelSearch } = recipeService.searchCategory(name!);
    async function getData() {
      Categories.then((Categories) => setCategories(Categories.data));
      if (!categories.includes(name!)) {
        window.location.href = "/404";
      }
      results
        .then((res) => {
          setRecipes(res.data);
        })
        .catch((error) => {
          if (error instanceof CanceledError) return;
          console.log(error);
        });

      setLoading(false);
    }
    getData();
    return () => {
      cancelCategories();
      cancelSearch();
    };
  }, []);

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
