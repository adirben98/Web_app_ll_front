import { IRecipe } from "../Components/Recipe";
import apiClient from "./api-client";

interface favoritesAndRecipes{
    favorites: IRecipe[];
    recipes: IRecipe[];
}

class recipeService{
    getCategories(){
        const controller = new AbortController();

        const Categories = apiClient.get<string[]>(
            "/recipe/getCategories",
            { signal: controller.signal }
          );
          return {Categories, cancelCategories:()=>controller.abort()};
    }

    searchCategory(category: string){
        const controller = new AbortController();
        const results = apiClient.get<IRecipe[]>(`/recipe/categorySearch/${category}`, { signal: controller.signal });
        return {results, cancelSearch:()=>controller.abort()};
    }
    searchRecipes(query: string){
        const controller = new AbortController();

        const results = apiClient.get<IRecipe[]>(`/recipe/search`, {
            signal: controller.signal,
            params: { q: query },
          });
          return {results, cancelSearch:()=>controller.abort()};

    }

    getRecipe(id: string){
        const controller = new AbortController();
        const recipe = apiClient.get<IRecipe>(`/recipe/${id}`, { signal: controller.signal });
        return {recipe, cancelRecipe:()=>controller.abort()};
    }

    createRecipe(recipe: IRecipe){
        return apiClient.post(`/recipe`, recipe);
    }

    updateRecipe(recipe: IRecipe){
        const controller = new AbortController();
        const Recipe= apiClient.put(`/recipe/${recipe._id}`, recipe);
        return {Recipe, cancelUpdate:()=>controller.abort()};
    }
    

    getUserRecipesAndFavorites(username: string){
        const controller=new AbortController();
        const userRecipesAndFavorites=apiClient.get<favoritesAndRecipes>(`/recipe/getUserRecipesAndFavorites/${username}`, {signal: controller.signal});
        return {userRecipesAndFavorites, cancelUserRecipesAndFavorites:()=>controller.abort()};
    }

    isLiked(id: string){
        const controller = new AbortController();
        const isLike = apiClient.get<boolean>(`/recipe/isLiked/${id}`, { signal: controller.signal });
        return {isLike, cancelLike:()=>controller.abort()};
    }

    like(id:string){
        return apiClient.post(`/recipe/like/${id}`);
    }

    unlike(id:string){
        return apiClient.post(`/recipe/unlike/${id}`);
    }


}
export default new recipeService();