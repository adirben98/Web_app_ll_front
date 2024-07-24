import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth, { CanceledError } from "../Services/useAuth";
import recipeService from "../Services/recipe-service";
import { IRecipe } from "./Recipe";


export default function ApiRecipe() {
  const googleFontUrl =
    "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap";
  const { name } = useParams();
  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { isLoading } = useAuth();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = googleFontUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const { getRecipeFromApi, cancelRecipeFromApi } =
      recipeService.getRecipeFromApi(name!);

    getRecipeFromApi
      .then((res) => {
        setRecipe(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        console.log(err);
      });

    setLoading(isLoading);

    return () => cancelRecipeFromApi();
  }, [name, isLoading]);

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
          src={recipe?.image}
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
          {recipe?.name}
        </h2>
      </div>
      <p style={{ margin: "10px 0", textAlign: "center" }}>
        {recipe?.description}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          margin: "20px 0",
        }}
      ></div>
      <div style={{ width: "100%" }}>
        <h2>Ingredients</h2>
        <ul>
          {recipe?.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <h2 style={{ marginTop: "25px" }}>Instructions</h2>
        <p>{recipe?.instructions}</p>
      </div>
    </div>
  );
}
