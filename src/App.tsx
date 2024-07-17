//import RecipeRow from './Components/RecipeRow';
import ProfilePage from './Components/ProfilePage';
import {Routes, Route} from 'react-router-dom';
import Recipe from './Components/Recipe';
import EditRecipe from './Components/EditRecipe';
import RegisterForm from './Components/RegisterForm';
import LoginForm from './Components/LoginForm';
import AddRecipe from './Components/AddRecipe';
import NotFound from './Components/NotFound';
import Chat from './Components/Chat';


function App() {

  return (
    <Routes>
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/addRecipe" element={<AddRecipe />} />
      <Route path="/recipe/:id" element={<Recipe />} />
      <Route path="/editRecipe/:id" element={<EditRecipe />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  )

}

export default App
