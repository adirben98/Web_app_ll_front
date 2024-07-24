import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import recipeService from "../Services/recipe-service";
import useAuth from "../Services/useAuth";
import yumMe from "../assets/yumMeLogo1.png";
import avatar from "../assets/avatar.png";
import userService from "../Services/user-service";

export default function Header() {
  // const [categories, setCategories] = useState<string[]>([]);
  // const { getCategories, cancelCategories } = recipeService.getCategories();
  // const { isLoading } = useAuth();
  const [image, setImage] = useState<string |undefined>(undefined);

  useEffect(() => {
    setImage(userService.getConnectedUser()!.image||avatar);
    console.log(userService.getConnectedUser()!.image);
    // getCategories.then((res) => {
    //   console.log(res.data);
    //   setCategories(res.data);
    // });
    // return () => {
    //   cancelCategories();
    // };
  }, []);
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light fixed-top"
      style={{ fontSize: "1.5rem", padding: "2rem 2.5rem" }}
    >
      <div
        className="container-fluid"
        style={{ width: "100%", padding: "0", height: `50px` }}
      >
        <a className="navbar-brand" href="/" style={{ padding: "0" }}>
          <img src={yumMe} style={{ width: "120px", height: "120px" }} />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarTogglerDemo01"
        >
          <ul className="navbar-nav mt-2 mt-lg-0" style={{ gap: "2rem" }}>
            <li className="nav-item active">
              <a className="nav-link" href="#" style={{ fontSize: "1.5rem" }}>
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                style={{ fontSize: "1.5rem" }}
              >
                Categories
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">
                  Category 1
                </a>
                <a className="dropdown-item" href="#">
                  Category 2
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">
                  Category 3
                </a>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" style={{ fontSize: "1.5rem" }}>
                All Recipes
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" style={{ fontSize: "1.5rem" }}>
                Add Recipe
              </a>
            </li>
            <li className="nav-item">
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SearchBar
                  url="/search"
                  searchFunction={recipeService.searchRecipes}
                />
              </div>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                style={{ display: "flex", alignItems: "center" }}
              >
                <img
                  src={image}
                  width="40"
                  height="40"
                  className="d-inline-block align-top"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
