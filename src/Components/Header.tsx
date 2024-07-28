import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import recipeService from "../Services/recipe-service";
import useAuth from "../Services/useAuth";
import yumMe from "../assets/yumMeLogo1.png";
import avatar from "../assets/avatar.png";
import userService from "../Services/user-service";
import { ICategory } from "./ApiCategories";

export default function Header() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { getCategories, cancelCategories } = recipeService.getCategories();
  const { isLoading } = useAuth();
  const [image, setImage] = useState<string>(avatar);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  useEffect(() => {
    const userImg = userService.getConnectedUser()!.image;
    if (userImg !== "") setImage(userImg);
    console.log(userService.getConnectedUser()!.image);
    getCategories.then((res) => {
      console.log(res.data);
      setCategories(res.data);
    });
    return () => {
      cancelCategories();
    };
  }, [isLoading]);

 
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light fixed-top"
      style={{ fontSize: "1.5rem", padding: "2rem 2.5rem", height: "100px" }}
    >
      <div
        className="container-fluid"
        style={{ width: "100%", padding: "0" }}
      >
        <a className="navbar-brand" href="/" style={{ padding: "0" }}>
          <img
            src={yumMe}
            style={{ width: "120px", height: "120px" }}
            alt="YumMe!"
          />
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
              <a className="nav-link" href="/" style={{ fontSize: "1.5rem" }}>
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
            <li
              className="nav-item dropdown"
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setDropdownVisible(false)}
              style={{ position: "relative" }}
            >
              <a
                className="nav-link dropdown-toggle"
                href="/apiCategories"
                id="navbarDropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                style={{ fontSize: "1.5rem" }}
              >
                Categories
              </a>
              <div
                className="dropdown-menu"
                aria-labelledby="navbarDropdown"
                style={{
                  display: dropdownVisible ? "block" : "none",
                  position: "absolute",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
                  zIndex: 1000,
                }}
              >
                {categories?.map((category) => (
                  <a
                    key={category.name}
                    className="dropdown-item"
                    href={`/categoryFromApi?q=${category.name}&f=category`}
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/allRecipes"
                style={{ fontSize: "1.5rem" }}
              >
                All Recipes
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/addRecipe"
                style={{ fontSize: "1.5rem" }}
              >
                Add Recipe
              </a>
            </li>
            <li
              className="nav-item"
              style={{ display: "flex", alignItems: "center" }}
            >
              <SearchBar />
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href={`/profile/${userService.getConnectedUser()!.username}`}
                style={{ display: "flex", alignItems: "center" }}
              >
                <img
                  src={image}
                  className="img-fluid avatar-xxl rounded-circle"
                  alt="Profile"
                  style={{ width: "40px", height: "40px" }}
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}