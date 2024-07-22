import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth, { CanceledError } from "../Services/useAuth";
import RecipeRow from "./RecipeRow";
import { AxiosResponse } from "axios";
import { IRecipe } from "./Recipe";

 interface SearchPageProps {
  searchFunction: (query: string) => {
    results: Promise<AxiosResponse<IRecipe[], unknown>>;
    cancelSearch: () => void;
  };
}

export default function SearchPage({ searchFunction }: SearchPageProps) {
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<IRecipe[]>([]);
  const params = new URLSearchParams(location.search);
  const queryParam = params.get("q");
  const {isLoading} = useAuth();

  useEffect(() => {
    if (!queryParam) return;

    const { results, cancelSearch } = searchFunction(queryParam);

    results
      .then((res) => {
        setSearchResults(res.data);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.log(error);
      })
      .finally(() => {
        setLoading(isLoading);
      });

    return () => {
      cancelSearch();
    };
  }, [queryParam, isLoading]);

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
        {/* <div
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
        </div> */}
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
