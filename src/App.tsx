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
import DefaultLayout from './Components/withBackground';
import NoBackgroundLayout from './Components/withoutBackground';
import ApiRecipe from './Components/ApiRecipe';


function App() {
  return (
    <Routes>
      <Route path="/register" element={<NoBackgroundLayout />}>
        <Route index element={<RegisterForm />} />
      </Route>
      <Route path="/login" element={<NoBackgroundLayout />}>
        <Route index element={<LoginForm />} />
      </Route>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/searchFromApi" element={<SearchPage />} />
        <Route path="/profile/:name" element={<ProfilePage />} />
        <Route path="/addRecipe" element={<AddRecipe />} />
        <Route path="/recipe/:id" element={<Recipe />} />
        <Route path="/editRecipe/:id" element={<EditRecipe />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
