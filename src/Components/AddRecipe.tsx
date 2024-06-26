import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import bread from "../assets/bread.jpeg";
import { IRecipe } from "./Recipe";
import apiClient from "../Services/api-client";
import User from "../Services/user-service";
import uploadPhoto from "../Services/file-service";

export default function AddRecipe() {
  const [image, setImage] = useState<File>();
  const photoGalleryRef = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [category, setCategory] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredient, setIngredient] = useState<string>("");

  const token = User.getUser().accessToken!;
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IRecipe>();

  function handleAddIngredient() {

    if (!ingredient.trim()) return;

    //setValue("ingredients", []);
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
    return true;
  }

  const user = User.getUser();

  async function onSubmit() {
    console.log(ingredients);
    if (inputValid()) {
      let imageUrl;
      if (image) imageUrl = await uploadPhoto(image!);
      else imageUrl = bread;

      const newRecipe: IRecipe = {
        name: watch("name"),
        author: user.username!,
        authorImg: user.userImg!,
        category: category,
        ingredients: ingredients,
        instructions: watch("instructions"),
        description: watch("description"),
        image: imageUrl,
        createdAt: Date.now(),
        likes: 0,
        likedBy: [],
      };
      try {
        const res = await apiClient(token).post<IRecipe>("/recipe", newRecipe);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
  }
  
  async function getCategories() {
    try {
      const categories = await apiClient(token).get("/recipe/getCategories");
      console.log(categories);
      const arr = [];
      for (let i = 0; i < categories.data.length; i++) {
        arr.push({ value: categories.data[i], label: categories.data[i] });
      }
      setOptions(arr);
    } catch (err) {
      console.log(err);
    }
  }

  function handleClick() {
    photoGalleryRef.current?.click();
  }

  useEffect(() => {
    getCategories();
  }, []);

  const selectRef = useRef<HTMLSelectElement>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "300px", textAlign: "center" }}>
          <h1 style={{ marginBottom: "50px" }}>New Recipe</h1>
          <div style={{ marginBottom: "20px" }}>
            <img
              src={image ? URL.createObjectURL(image) : bread}
              style={{ width: "100%", margin: "10px" }}
            />
          </div>
          <div style={{ marginRight: "300px" }}>
            <button type="button" className="btn" onClick={handleClick}>
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
              type="name"
              className="form-control"
              id="name"
              placeholder="Recipe Name"
              {...register("name", { required: "Recipe name is required" })}
            />
            <label htmlFor="name">Recipe Name</label>
            {errors.name && <span>{errors.name.message}</span>}
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
            >
              <option value="">Select Category</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-danger">{errors.category.message}</p>
            )}
          </div>
          <div className="form-floating mb-3">
            <input
              type="ingredients"
              className="form-control"
              id="ingredients"
              placeholder="ingredients"
              {...register("ingredients", {
                required: "Ingredients are required",
              })}
              onChange={(e) => setIngredient(e.target.value)}
            />
            <label htmlFor="ingredients">Ingredients</label>
            {errors.ingredients && <span>{errors.ingredients.message}</span>}
            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={handleAddIngredient}
              style={{ marginRight: "300px" }}
            >
              Add Ingredient
            </button>
            {ingredients.length > 0 && (
              <ul className="list-group mt-3">
                {ingredients.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {item}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveIngredient(index)}
                    >
                      Remove
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
              {...register("instructions", {
                required: "Instructions are required",
              })}
              onInput={handleTextareaChange}
              style={{ overflow: "hidden" }}
            />
            <label htmlFor="instructions">Instructions</label>
            {errors.instructions && <span>{errors.instructions.message}</span>}
          </div>
          <div className="form-floating mb-3">
            <textarea
              className="form-control"
              id="description"
              placeholder="Description"
              {...register("description", {
                required: "Description is required",
              })}
              onInput={handleTextareaChange}
              style={{ overflow: "hidden" }}
            />
            <label htmlFor="description">Description</label>
            {errors.description && <span>{errors.description.message}</span>}
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginBottom: "50px" }}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
