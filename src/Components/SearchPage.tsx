import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth, { CanceledError } from "../Services/useAuth";
import RecipeRow from "./RecipeRow";
import { IRecipe } from "./Recipe";
import recipeService from "../Services/recipe-service";


export default function SearchPage() {
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<IRecipe[]>([]);
  const [categoriesResults, setCategoriesResults] = useState<IRecipe[]>([]);
  const params = new URLSearchParams(location.search);
  const queryParam = params.get("q");
  const func = params.get("f");
  const { isLoading } = useAuth();
  
  useEffect(() => {
    if (!queryParam || !func) return;

    const { results, cancelSearch } = func === 'search' 
      ? recipeService.searchRecipes(queryParam) 
      : recipeService.searchCategory(queryParam);

    results
      .then((res) => {
        if (func === 'search') {
          setSearchResults(res.data);
        } else {
          setCategoriesResults(res.data);
        }
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      cancelSearch();
    };
  }, [queryParam, func, isLoading]);

  if (loading || isLoading) {
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
            {func === 'search'
              ? searchResults.map((recipe) => (
                  <div
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
                  </div>
                ))
              : categoriesResults.map((recipe) => (
                  <div
                    key={recipe.name}
                    style={{
                      flex: "1 1 calc(33.333% - 10px)",
                      boxSizing: "border-box",
                    }}
                  >
                  <RecipeRow
                  recipeImg={recipe.image}
                  url={`/recipeFromApi/${recipe.name!}`}
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
