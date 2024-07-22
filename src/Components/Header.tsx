import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import recipeService from "../Services/recipe-service";
import useAuth from "../Services/useAuth";

export default function Header() {
  // const [categories, setCategories] = useState<string[]>([]);
  // const { getCategories, cancelCategories } = recipeService.getCategories();
  // const { isAuthenticated, isLoading } = useAuth();
  
  // useEffect(() => {
  //   getCategories.then((res) => {
  //     console.log(res.data);
  //     setCategories(res.data);
  //   });
  //   return () => {
  //     cancelCategories();
  //   }
  // }, [isAuthenticated]);
  return (
<nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
    <a className="navbar-brand" href="#">
      Hidden brand
    </a>
    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
      <li className="nav-item active">
        <a className="nav-link" href="#">
          Home <span className="sr-only">(current)</span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">
          Link
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link disabled" href="#">
          Disabled
        </a>
      </li>
    </ul>
    <div className="ml-auto">
      <SearchBar url="/search" searchFunction={recipeService.searchRecipes} />
    </div>
  </div>
</nav>
  );
}
