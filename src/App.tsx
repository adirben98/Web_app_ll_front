import ProfilePage from './Components/ProfilePage';
import {Routes, Route} from 'react-router-dom';
import Recipe from './Components/Recipe';
import EditRecipe from './Components/EditRecipe';
import RegisterForm from './Components/RegisterForm';
import LoginForm from './Components/LoginForm';
import AddRecipe from './Components/AddRecipe';
import NotFound from './Components/NotFound';
import SearchPage from './Components/SearchPage';
import CategoryPage from './Components/CategoryPage';
import HomePage from './Components/HomePage';
import SearchBar from './Components/SearchBar';
import Chat from './Components/Chat';
import Background from './Components/Background';



function App() {
  

  return (<>
  
    <SearchBar/>
    <Background>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/category/:name" element={<CategoryPage />} />
      <Route path="/profile/:name" element={<ProfilePage />} />
      <Route path="/addRecipe" element={<AddRecipe />} />
      <Route path="/recipe/:id" element={<Recipe />} />
      <Route path="/editRecipe/:id" element={<EditRecipe />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="*" element={<NotFound/>} />
      <Route path="/chat" element={<Chat />} />
      </Routes>
      </Background>
      </>
  )
}

export default App

