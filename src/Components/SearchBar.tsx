import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";

import recipeService from "../Services/recipe-service";

interface SearchResults{
  id: string;
  name: string;
}

export default function SearchBar() {
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLInputElement>(null);

  async function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    console.log(query);

    if (!query) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const { results } = recipeService.searchRecipes(query);

    try {
      console.log("starting");
      results.then((response) => {
        console.log(response.data);
        const recipes = response.data.map((recipe) => ({
          id: recipe._id!,
          name: recipe.name,
        }));
        setSearchResults(recipes);
        setShowDropdown(true);
      }).catch((err) => console.log(err));
      
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = ref.current?.value;

    if (!query) return;
    ref.current!.value = "";

    setShowDropdown(false);
    navigate(`/search?q=${query}&f=search`);
  }

  const handleItemClick = (id: string) => {
    ref.current!.value = "";
    navigate(`/recipe/${id}`);
    setShowDropdown(false);

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
        />
        <button type="submit" className="btn">
          <FontAwesomeIcon icon={faSearch} className="fa-xl tinted-icon" />
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
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #ccc",
                  cursor: "pointer",
                }}
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
