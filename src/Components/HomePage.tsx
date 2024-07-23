import { useEffect, useState } from "react";
import { IRecipe } from "./Recipe";
import recipeService from "../Services/recipe-service";
import RecipeRow from "./RecipeRow";
import { Link } from "react-router-dom";
import { CanceledError } from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import useAuth from "../Services/useAuth";

export default function HomePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [topFiveRecipes, setTopFiveRecipes] = useState<IRecipe[]>([]);
  const [randomRecipes, setRandomRecipes] = useState<IRecipe[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const { isLoading } = useAuth();

  useEffect(() => {
    const { getCategories, cancelCategories } = recipeService.getCategories();
    const { topFive, cancelTopFive } = recipeService.getTopFive();
    const { randomRESTApi, cancelRandomRESTApi } =
      recipeService.getRandomRESTApi();

    const getData = async () => {
      getCategories
        .then((res) => {
          setCategories(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          if (err instanceof CanceledError) return;
          console.log(err);
        });

      topFive
        .then((res) => {
          setTopFiveRecipes(res.data);
        })
        .catch((err) => {
          if (err instanceof CanceledError) return;
          console.log(err);
        });

      randomRESTApi
        .then((res) => {
          setRandomRecipes(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          if (err instanceof CanceledError) return;
          console.log(err);
        });

      setLoading(isLoading);
    };

      getData();
    
    return () => {
      cancelCategories();
      cancelTopFive();
      cancelRandomRESTApi();
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
                <Link className="dropdown-item" to={`/recipe/${category}`}>
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
          <h2>Your best recipes:</h2>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              listStyle: "none",
              padding: 0,
            }}
          >
            {topFiveRecipes.map((recipe) => (
              <li
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
              </li>
            ))}
          </ul>

          <h2>Explore some of our Recipes!</h2>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              listStyle: "none",
              padding: 0,
            }}
          >
            {randomRecipes.map((recipe) => (
              <li
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
