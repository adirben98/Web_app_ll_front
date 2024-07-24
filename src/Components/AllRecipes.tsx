import { useEffect, useState } from "react";
import recipeService from "../Services/recipe-service";
import { IRecipe } from "./Recipe";
import RecipeRow from "./RecipeRow";
import useAuth from "../Services/useAuth";

export default function AllRecipes() {
  const { AllRecipes, cancelRecipes } = recipeService.getAll();
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading } = useAuth();

  useEffect(() => {
    AllRecipes.then((res) => setRecipes(res.data)).catch((err) =>
      console.log(err)
    );
    setLoading(isLoading);

    return () => {
      cancelRecipes();
    };
  }, [isLoading]);

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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>All Recipes</h1>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          listStyle: "none",
          padding: 0,
        }}
      >
        {recipes.map((recipe) => (
          <li
            key={recipe._id}
            style={{
              flex: "1 1 calc(33.333% - 10px)",
              boxSizing: "border-box",
            }}
          >
            <RecipeRow
              recipeImg={recipe.image}
              url={`/recipe/${recipe._id}`}
              description={recipe.description}
              recipeName={recipe.name}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
