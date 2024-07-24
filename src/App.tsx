import ProfilePage from './Components/ProfilePage';
import {Routes, Route} from 'react-router-dom';
import Recipe from './Components/Recipe';
import EditRecipe from './Components/EditRecipe';
import RegisterForm from './Components/RegisterForm';
import LoginForm from './Components/LoginForm';
import AddRecipe from './Components/AddRecipe';
import NotFound from './Components/NotFound';
import SearchPage from './Components/SearchPage';
import HomePage from './Components/HomePage';
import Chat from './Components/Chat';
import AllRecipes from './Components/AllRecipes';
import ApiCategories from './Components/ApiCategories';
import ApiRecipe from './Components/ApiRecipe';


function App() {
  

  return (<>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/allRecipes" element={<AllRecipes />} />
      <Route path="/categoryFromApi" element={<SearchPage />} />
      <Route path="/categoriesFromApi" element={<ApiCategories/>} />
      <Route path="/recipeFromApi/:name" element={<ApiRecipe />} />
      <Route path="/search" element={<SearchPage  />} />
      <Route path="/profile/:name" element={<ProfilePage />} />
      <Route path="/addRecipe" element={<AddRecipe />} />
      <Route path="/recipe/:id" element={<Recipe />} />
      <Route path="/editRecipe/:id" element={<EditRecipe />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="*" element={<NotFound/>} />
      <Route path="/chat" element={<Chat />} />
      </Routes>
      
      </>
  )
}

export default App

