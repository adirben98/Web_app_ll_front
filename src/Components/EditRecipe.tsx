import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IRecipe } from "./Recipe";
import  useAuth, { CanceledError } from "../Services/useAuth";
import uploadPhoto from "../Services/file-service";
import { useParams } from "react-router-dom";
import recipeService from "../Services/recipe-service";

export default function EditRecipe() {
  const [image, setImage] = useState<string>("");
  const [newImage, setNewImage] = useState<File>();
  const photoGalleryRef = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

  const [category, setCategory] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredient, setIngredient] = useState<string>("");
  const { id } = useParams();
  const {isLoading} = useAuth();

  const {
    setValue,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRecipe>();

  function handleAddIngredient() {
    if (!ingredient.trim()) return;

    setIngredients([...ingredients, ingredient.trim()]);
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

  async function onSubmit(data: IRecipe) {


    if (inputValid()) {
      let imageUrl;
      if (newImage) imageUrl = await uploadPhoto(newImage!);
      else imageUrl = image!;

      const updatedRecipe: IRecipe = {
        ...data,
        _id: id,
        image: imageUrl,
        ingredients: ingredients,
        category: category,
      };
      const {Recipe} = recipeService.updateRecipe(updatedRecipe);

      Recipe.then((Recipe) => {
        console.log(Recipe);
        window.location.href = "/recipe/" + Recipe.data._id;
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  function handleClick() {
    photoGalleryRef.current?.click();
  }

  const errorHandler = (error: unknown) => {
    if (error instanceof CanceledError) return;
    window.location.href = "/404";
    console.log(error);
  };


  useEffect(() => {
    
    const { getCategories, cancelCategories } = recipeService.getCategories();
    const {getRecipe, cancelRecipe} = recipeService.getRecipe(id!);

    async function getData() {
        getCategories.then((Categories) => {
          const arr = [];
          for (let i = 0; i < Categories.data.length; i++) {
            arr.push({ value: Categories.data[i], label: Categories.data[i] });
          }
          setOptions(arr);
        }).catch((error) => {errorHandler(error);});

        getRecipe.then((res) => {
        setValue("name", res.data.name);
        setValue("author", res.data.author);
        setValue("authorImg", res.data.authorImg);
        setValue("instructions", res.data.instructions);
        setValue("description", res.data.description);
        setImage(res.data.image);
        setIngredients(res.data.ingredients);
        const categories = options.slice();
        console.log(ingredients);

        const userCategoryIndex = categories.findIndex(
          (cat) => cat.value === res.data.category
        );
        if (userCategoryIndex !== -1) {
          const userCategory = categories.splice(userCategoryIndex, 1)[0];
          categories.unshift(userCategory);
        }
        setCategory(res.data.category);
        setOptions(categories);}).catch((error) => {errorHandler(error);});
        setLoading(isLoading);
      
    }
    getData();
    return () => {
      cancelCategories();
      cancelRecipe()
    };
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
        }}
      >
        <div style={{ width: "300px", textAlign: "center" }}>
          <h1 style={{ marginBottom: "50px" }}>New Recipe</h1>
          <div style={{ marginBottom: "20px" }}>
            <img
              src={newImage ? URL.createObjectURL(newImage) : image}
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
                  setNewImage(event.target.files[0]);
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
              {...register("ingredients", {})}
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
            Edit
          </button>
        </div>
      </div>
    </form>
  );
}
