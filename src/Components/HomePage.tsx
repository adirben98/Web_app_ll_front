import { useEffect, useState } from "react";
import { IRecipe } from "./Recipe";
import recipeService from "../Services/recipe-service";
import RecipeRow from "./RecipeRow";
import { CanceledError } from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import useAuth from "../Services/useAuth";

export default function HomePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [topFiveRecipes, setTopFiveRecipes] = useState<IRecipe[]>([]);
  const [randomRecipes, setRandomRecipes] = useState<IRecipe[]>([]);
  const { isLoading } = useAuth();

  useEffect(() => {
    const { topFive, cancelTopFive } = recipeService.getTopFive();
    const { randomRESTApi, cancelRandomRESTApi } =
      recipeService.getRandomRESTApi();

    const getData = async () => {
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
      style={{ display: "flex", justifyContent: "center", marginTop: "70px" ,background: "#fff"}}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          maxWidth: "1200px",
          justifyContent: "center",          
      
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              fontSize: "48px",
              marginTop: "30px",
              marginBottom: "50px",
              fontFamily: "'Dancing Script', cursive", 
              letterSpacing: "2px",
              color: "#333", 
            }}
          >
            Welcome to YumMe!
          </h1>
          <p
            style={{
              textAlign: "center",
              fontSize: "24px",
              marginBottom: "50px",
              fontFamily: "'Roboto', sans-serif", 
              color: "#555",
            }}
          >
            Let’s Dive into Deliciousness
            <br />
            <br />
            We’re excited to have you join our community of food enthusiasts! At
            YumMe, we're more than just a recipe hub—here you can share your
            culinary creations, get feedback from fellow foodies, and discover
            delicious recipes from our community. Whether you're here to upload
            your own masterpieces, explore dishes, or engage with other
            passionate cooks, YumMe is your go-to spot. Dive into the fun,
            interact with others, and let’s make cooking a shared adventure.
          </p>

          <h2
            style={{
              textAlign: "center",
              fontSize: "35",
              fontFamily: "'Roboto', sans-serif",
              letterSpacing: "2px",
              fontWeight: "bold",
            }}
          >
            Bon appétit! 🍽️
          </h2>
          <h2
            style={{
              textAlign: "center",
              fontSize: "48px",
              marginTop: "200px",
              marginBottom: "50px",
              fontFamily: "'Courier New', Courier, monospace",
              letterSpacing: "2px",
            }}
          >
            Your 5 best recipes:
          </h2>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "15px",
              listStyle: "none",
              padding: 0,
            }}
          >
            {topFiveRecipes.map((recipe) => (
              <li
                key={recipe._id}
                style={{
                  width: "calc(33.333% - 20px)",
                  height: "300px",
                  boxSizing: "border-box",
                }}
              >
                <RecipeRow
                  url={`/recipe/${recipe._id!}`}
                  recipeImg={recipe.image}
                  description={recipe.description}
                  recipeName={recipe.name}
                />
              </li>
            ))}
          </ul>

          <h2
            style={{
              textAlign: "center",
              fontSize: "48px",
              marginTop: "50px",
              marginBottom: "50px",
              fontFamily: "'Courier New', Courier, monospace",
              letterSpacing: "2px",
            }}
          >
            Explore some of our Recipes!
          </h2>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "15px",
              listStyle: "none",
              padding: 0,
            }}
          >
            {randomRecipes.map((recipe) => (
              <li
                key={recipe._id}
                style={{
                  width: "calc(33.333% - 20px)",
                  height: "300px",
                  boxSizing: "border-box",
                }}
              >
                <RecipeRow
                  recipeImg={recipe.image}
                  url={`/recipeFromApi/${recipe.name!}`}
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
