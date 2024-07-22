import React, { useState, useEffect } from 'react';
import '../index.css'

interface Recipe {
    id: number;
    title: string;
    image: string;
    description: string;
}

export default function HomePage() {
    const [randomRecipes, setRandomRecipes] = useState<Recipe[]>([]);
    const [topRecipes, setTopRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        fetchRandomRecipes().then(setRandomRecipes);
        fetchTopRecipes().then(setTopRecipes);
    }, []);

    const fetchRandomRecipes = async (): Promise<Recipe[]> => {
        const response = await fetch('https://api.example.com/random-recipes');
        return response.json();
    };

    const fetchTopRecipes = async (): Promise<Recipe[]> => {
        const response = await fetch('https://api.example.com/top-recipes');
        return response.json();
    };

    const renderRecipeCard = (recipe: Recipe) => (
        <div className="recipe-card" key={recipe.id}>
            <img src={recipe.image} alt={recipe.title} />
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
        </div>
    );

    return (
      <body>
          <div id="content">
              <section id="random-recipes">
                  <h2>Random Recipes</h2>
                  <div id="random-recipes-list">
                      {randomRecipes.map(renderRecipeCard)}
                  </div>
              </section>

              <section id="top-recipes">
                  <h2>Top 10 Recipes</h2>
                  <div id="top-recipes-list">
                      {topRecipes.map(renderRecipeCard)}
                  </div>
              </section>
          </div>
      </body>
  );
}
