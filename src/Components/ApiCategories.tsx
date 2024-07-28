import { useEffect, useState } from 'react'
import useAuth from '../Services/useAuth';
import recipeService from '../Services/recipe-service';
import CategoryRow from './CategoryRow';

export interface ICategory {
  name: string;
  image: string;

}

export default function ApiSearch() {
  

const [loading,setLoading] = useState<boolean>(true);
const {isLoading} = useAuth();
const {getCategories, cancelCategories} = recipeService.getCategories();
const [categories, setCategories] = useState<ICategory[]>([]);

useEffect(() => {
  getCategories.then((res) => {
    setCategories(res.data);
    console.log(res.data);
  }).catch((err) => {
    console.log(err);
  })
  setLoading(isLoading);
  return () => {cancelCategories()}
}, [isLoading])


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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>Categories</h1>
    <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            listStyle: "none",
            padding: 0,
          }}
        >
          {categories.map((category) => (
           <li
           key={category.name}
           style={{
             width: "calc(33.333% - 20px)",
             height: "300px",
             boxSizing: "border-box",
}}
            >
              <CategoryRow
                name={category.name}
                image={category.image}
              />
            </li>
          ))}
        </ul>
  </div>
  )
}
