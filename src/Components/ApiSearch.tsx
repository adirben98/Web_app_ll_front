import { useState } from 'react'
import useAuth from '../Services/useAuth';
import SearchBar from './SearchBar';
import recipeService from '../Services/recipe-service';

export default function ApiSearch() {

const [loading,setLoading] = useState<boolean>(true);
const {isLoading} = useAuth();


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
    <div>
      <SearchBar url='/searchFromApi?q=' searchFunction={recipeService.searchFromApi} />
    </div>
  )
}
