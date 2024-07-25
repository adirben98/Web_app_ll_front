import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import example from "../assets/example.png";
import { IRecipe } from "./Recipe";
import useAuth, { CanceledError } from "../Services/useAuth";
import User from "../Services/user-service";
import uploadPhoto from "../Services/file-service";
import recipeService from "../Services/recipe-service";
import moment from "moment";

export default function AddRecipe() {
  const [image, setImage] = useState<File>();
  const photoGalleryRef = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [category, setCategory] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredient, setIngredient] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading } = useAuth();

  const {
    setError,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IRecipe>();

  function handleAddIngredient() {
    if (!ingredient.trim()) return;

    setIngredients([...ingredients, ingredient.trim()]);
    console.log(ingredients);
    console.log(ingredient);
  }

  function handleRemoveIngredient(index: number) {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  }

  function inputValid() {
    if (ingredients.length === 0) {
      setError("ingredients", { message: "Ingredients are required" });
      return false;
    } else if (category === "") {
      setError("category", { message: "Category is required" });
      return false;
    }
    
    else if (image === undefined) {
      setError("image", { message: "Image is required" });
      return false;
    }
    return true;
  }

  const user = User.getConnectedUser()!;

  async function onSubmit() {
    console.log(ingredients);

    if (inputValid()) {
      let imageUrl;
      if (image) imageUrl = await uploadPhoto(image!);
      else imageUrl = example;

      const newRecipe: IRecipe = {
        name: watch("name"),
        author: user.username!,
        authorImg: user.image!,
        category: category,
        ingredients: ingredients,
        instructions: watch("instructions"),
        description: watch("description"),
        image: imageUrl,
        createdAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
        likes: 0,
        likedBy: [],
      };
      
        recipeService.createRecipe(newRecipe).then((res) => {
          console.log(res);
          window.location.href = "/";
        });

      
    }
  }

  function handleClick() {
    photoGalleryRef.current?.click();
  }

  useEffect(() => {
    const { getCategories, cancelCategories } = recipeService.getCategories();

    async function Categories() {
      getCategories
        .then((Categories) => {
          const arr = [];
          for (let i = 0; i < Categories.data.length; i++) {
            arr.push({ value: Categories.data[i].name, label: Categories.data[i].name });
          }
          setOptions(arr);
        })
        .catch((err) => {
          if (err instanceof CanceledError) return;
          console.log(err);
        });

      setLoading(isLoading);
    }
    Categories();
    return () => cancelCategories();
  }, [isLoading]);

  const selectRef = useRef<HTMLSelectElement>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "20px",
          backgroundColor: "#f9f9f9"
        }}
      >
        <div style={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          margin: "0 auto",
          maxWidth: "1000px"
        }}>
          <h1 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "600", color: "#333" }}>New Recipe</h1>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <img
              src={image ? URL.createObjectURL(image) : example}
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                margin: "10px 0"
              }}
              alt="Recipe"
            />
            {errors.image && <span style={{ color: "red" }}>{errors.image.message}</span>}

          </div>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <button type="button" className="btn btn-outline-secondary" onClick={handleClick} style={{ borderRadius: "50%", padding: "10px" }}>
              <FontAwesomeIcon icon={faImage} className="fa-xl" />
            </button>
            <input
              style={{ display: "none" }}
              ref={photoGalleryRef}
              type="file"
              onChange={(event) => {
                if (event.target.files) {
                  setImage(event.target.files[0]);
                }
              }}
            />
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Recipe Name"
              {...register("name", { required: "Recipe name is required" })}
              style={{ borderRadius: "8px", padding: "15px", paddingTop: "30px" }}
            />
            <label htmlFor="name">Recipe Name</label>
            {errors.name && <span style={{ color: "red" }}>{errors.name.message}</span>}
          </div>
          <div className="form-group mb-3">
            <select
              className="form-select"
              id="category"
              {...register("category")}
              onChange={(selectedOption) => {
                setCategory(selectedOption.target.value);
              }}
              ref={selectRef}
              style={{ borderRadius: "8px", padding: "10px" }}
            >
              <option  value="">Select Category</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p style={{ color: "red" }}>{errors.category.message}</p>
            )}
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="ingredients"
              placeholder="Ingredients"
              {...register("ingredients", { required: "Ingredients are required" })}
              onChange={(e) => setIngredient(e.target.value)}
              style={{ borderRadius: "8px", padding: "15px", paddingTop: "30px" }}
            />
            <label htmlFor="ingredients">Ingredients</label>
            {errors.ingredients && <span style={{ color: "red" }}>{errors.ingredients.message}</span>}
            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={handleAddIngredient}
              style={{ borderRadius: "8px", padding: "10px" }}
            >
              Add Ingredient
            </button>
            {ingredients.length > 0 && (
              <ul className="list-group mt-3" style={{ paddingLeft: "0" }}>
                {ingredients.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{ borderRadius: "8px", marginBottom: "5px" }}
                  >
                    {item}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveIngredient(index)}
                      style={{ borderRadius: "50%", padding: "5px 10px" }}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-floating mb-3">
            <textarea
              className="form-control"
              id="instructions"
              placeholder="Instructions"
              {...register("instructions", { required: "Instructions are required" })}
              onInput={handleTextareaChange}
              style={{ borderRadius: "8px", padding: "15px", paddingTop: "30px", height: "100px" }}
            />
            <label htmlFor="instructions">Instructions</label>
            {errors.instructions && <span style={{ color: "red" }}>{errors.instructions.message}</span>}
          </div>
          <div className="form-floating mb-3">
            <textarea
              className="form-control"
              id="description"
              placeholder="Description"
              {...register("description", { required: "Description is required" })}
              onInput={handleTextareaChange}
              style={{ borderRadius: "8px", padding: "15px", paddingTop: "30px", height: "100px" }}
            />
            <label htmlFor="description">Description</label>
            {errors.description && <span style={{ color: "red" }}>{errors.description.message}</span>}
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}  