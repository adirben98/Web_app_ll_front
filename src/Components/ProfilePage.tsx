import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import User from "../Services/user-service";
import { IRecipe } from "./Recipe";
import apiClient,{CanceledError} from "../Services/api-client";
import RecipeRow from "./RecipeRow";
import ChangePassword from "./ChangePassword";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import uploadPhoto from "../Services/file-service";

export default function ProfilePage() {
  const user = User.getUser();

  const [activeTab, setActiveTab] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [myRecipes, setMyRecipes] = useState<IRecipe[]>([]);
  const [foodNowFavorites, setFoodNowFavorites] = useState<IRecipe[]>([]);
  const [renderNeeded, setRenderNeeded] = useState<boolean>(false);
  const { id } = useParams();
  const [newImage, setNewImage] = useState<File>();
  const photoGalleryRef = useRef<HTMLInputElement>(null);

  async function uploadCurrentPhoto(photo: File) {
    try {
      const url = await uploadPhoto(photo);
      await apiClient.put("auth/updateUserImg", {
        username: user.username,
        imgUrl: url,
      });
      localStorage.setItem("imgUrl", url);
      setRenderNeeded(prev => !prev)
    } catch (error) {
      console.log(error);
    }
  }

  function handleClick() {
    photoGalleryRef.current?.click();
  }

  async function fetchProfile() {
    setImage(user.userImg!);
    setUsername(user.username!);
    setEmail(user.email!);
  }
  async function fetchMyRecipesAndFavorites(signal: AbortSignal) {
    try {
      const recipes = await apiClient.get("/recipe/getUserRecipesAndFavorites",{signal:signal});
      setMyRecipes(recipes.data.recipes);
      setFoodNowFavorites(recipes.data.favorites);
    } catch (error) {
      if(error instanceof CanceledError ){
        console.log("Fetch canceled")
      }
      else{
      console.log(error);
        
      }
    }
  }

  useEffect(() => {
    const controller=new AbortController();
    fetchProfile();
    fetchMyRecipesAndFavorites(controller.signal);
    return () => {controller.abort()}
  }, []);

  return (
    <div
      className="profile-page-container"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        className="profile-container"
        style={{ width: "100%", maxWidth: "1000px" }}
      >
        <div className="card">
          {id === user.username && (
            <div className=" d-flex justify-content-end">
              <span
                className="text-primary cursor-pointer"
                onClick={() => setActiveTab("Edit")}
                style={{ cursor: "pointer", padding: "10px" }}
              >
                Edit
              </span>
            </div>
          )}

          <div className="card-body pb-0">
            <div className="row align-items-center">
              <div className="col-md-3">
                <div
                  className="text-center border-end"
                  style={{ padding: "20px", position: "relative" }}
                >
                  <img
                    src={newImage ? URL.createObjectURL(newImage) : image}
                    className="img-fluid avatar-xxl rounded-circle"
                    alt="Profile"
                    style={{ width: "120px", height: "120px" }}
                  />
                  {id === user.username && (
                    <button
                      type="button"
                      className="btn"
                      onClick={handleClick}
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "30px",
                        background: "rgb(0, 150, 255)",
                        borderRadius: "50%",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FontAwesomeIcon icon={faImage} className="fa-xl" />
                    </button>
                  )}
                  <input
                    style={{ display: "none" }}
                    ref={photoGalleryRef}
                    type="file"
                    onChange={(event) => {
                      if (event.target.files) {
                        setNewImage(event.target.files[0]);
                        uploadCurrentPhoto(event.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-md-9">
                <div className="ms-3">
                  <div className="row my-4">
                    <div className="col-md-12">
                      <div>
                        <h4
                          className="text-primary font-size-20"
                          style={{ padding: "6px" }}
                        >
                          {username}
                        </h4>
                        <p className="text-muted fw-medium mb-0">
                          <i className="mdi mdi-email-outline me-2"></i>
                          {email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <ul
                    className="nav nav-tabs nav-tabs-custom border-bottom-0 mt-3 nav-justified"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link px-4 ${
                          activeTab === "myRecipes" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("myRecipes")}
                        role="tab"
                        tabIndex={-1}
                      >
                        <span className="d-block d-sm-none">
                          <i className="mdi mdi-menu-open"></i>
                        </span>
                        <span className="d-none d-sm-block">My Recipes</span>
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link px-4 ${
                          activeTab === "foodNow" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("foodNow")}
                        role="tab"
                        tabIndex={-1}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-home"></i>
                        </span>
                        <span className="d-none d-sm-block">
                          "Food-Now" Favorites
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="tab-content-container"
        style={{ width: "100%", maxWidth: "1000px", marginTop: "20px" }}
      >
        <div className="tab-content mt-4">
          {activeTab === "myRecipes" && (
            <div className="tab-pane fade show active">
              <p>Here is the list of My Recipes.</p>
              {myRecipes.map((recipe) => (
                <RecipeRow
                  key={recipe.name}
                  id={recipe._id!}
                  recipeImg={recipe.image}
                  recipeName={recipe.name}
                  description={recipe.description}
                />
              ))}
            </div>
          )}
          {activeTab === "foodNow" && (
            <div className="tab-pane fade show active">
              <p>Here is the list of "Food-Now" Favorites.</p>
              {foodNowFavorites.map((recipe) => (
                <RecipeRow
                  id={recipe._id!}
                  key={recipe.name}
                  recipeImg={recipe.image}
                  recipeName={recipe.name}
                  description={recipe.description}
                />
              ))}
            </div>
          )}

          {activeTab === "Edit" && (
            <div className="tab-pane fade show active">
              <p>Edit profile</p>
              <ChangePassword
                afterEdit={() => {
                  setActiveTab("");
                  renderNeeded ? setRenderNeeded(false) : setRenderNeeded(true);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
