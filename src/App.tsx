import ProfilePage from './Components/ProfilePage';
import {Routes, Route} from 'react-router-dom';
import Recipe from './Components/Recipe';
import EditRecipe from './Components/EditRecipe';
import RegisterForm from './Components/RegisterForm';
import LoginForm from './Components/LoginForm';
import AddRecipe from './Components/AddRecipe';
import NotFound from './Components/NotFound';
import SearchBar from './Components/SearchBar';
import SearchPage from './Components/SearchPage';
import CategoryPage from './Components/CategoryPage';


function App() {
  

  return (
    <Routes>
      <Route path="/" element={<SearchBar />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/category/:name" element={<CategoryPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/addRecipe" element={<AddRecipe />} />
      <Route path="/recipe/:id" element={<Recipe />} />
      <Route path="/editRecipe/:id" element={<EditRecipe />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="*" element={<NotFound/>} />




      </Routes>
  )
}

export default App
