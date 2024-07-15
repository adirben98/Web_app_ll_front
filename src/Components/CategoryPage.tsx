import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function CategoryPage() {
    const {name}=useParams()  
    useEffect(() => {
        try{
            const controller=new AbortController()
            //const res=await apiClient.get(`/recipe/categorySearch/${name}`,{signal:controller.signal})
        }
        catch(error){
            console.log(error)
        }
    })
  return (
    <div></div>
  )
}
