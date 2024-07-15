import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import apiClient from "../Services/api-client";
import RecipeRow, { recipeRow } from "./RecipeRow";
import { IRecipe } from "./Recipe";

export default function SearchPage() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState<recipeRow[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const params = new URLSearchParams(location.search);
  const queryParam = params.get("q");

  useEffect(() => {
    const controller = new AbortController();

    async function getData() {
      try {
        const Categories = await apiClient.get<string[]>(
          "/recipe/getCategories",
          { signal: controller.signal }
        );
        setCategories(Categories.data);
        const res = await apiClient.get<IRecipe[]>(`/recipe/search`, {
          signal: controller.signal,
          params: { q: queryParam },
        });
        const recipes = res.data.map((recipe) => {
          return {
            id: recipe._id!,
            recipeName: recipe.name,
            recipeImg: recipe.image,
            description: recipe.description,
          };
        });
        setSearchResults(recipes);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
    return () => {
      controller.abort();
    };
  }, []);
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
