import { useState, ChangeEvent, FormEvent, useRef } from "react";
import apiClient from "../Services/api-client";
import { useNavigate } from "react-router-dom";
import { IRecipe } from "./Recipe";

interface SearchResult {
  id: string;
  name: string;
}

export default function SearchBar() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const navigate = useNavigate();
  const ref=useRef<HTMLInputElement>(null);

  async function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    try {
      if (!query) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }
      const results = await apiClient.get<IRecipe[]>(`/recipe/search`, {
        params: { q: query },
      });
      const recipes=results.data.map((recipe) => { return {id:recipe._id!,name:recipe.name}; });
      setSearchResults(recipes);
      setShowDropdown(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = ref.current?.value;

    if (!query) return;
    navigate(`/search?q=${query}`);


  }

  

  const handleItemClick = (id: string) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <div style={{ position: "relative" }}>
      <form
        className="form-inline"
        onSubmit={handleSubmit}
        style={{ display: "flex", alignItems: "center" }}
      >
        <input
        ref={ref}
          className="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          onChange={handleInputChange}
          style={{ flex: 1 }}
        />
        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
          Search
        </button>
      </form>
      {showDropdown && searchResults.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            zIndex: 1000,
          }}
        >
          <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
            {searchResults.map((result) => (
              <li
                key={result.id}
                style={{ padding: "8px", borderBottom: "1px solid #ccc", cursor: "pointer" }}
                onClick={() => handleItemClick(result.id)}
              >
                {result.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
