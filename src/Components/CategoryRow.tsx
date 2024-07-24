import { Link } from "react-router-dom";
import { ICategory } from "./ApiCategories";

export default function CategoryRow({name,image}:ICategory) {
  return (
    <div className="card mb-4" style={{ height: '30vh', display: 'flex', flexDirection: 'column' }}>
      <Link to={`/categoryFromApi/${name}`}>
        <img src={image} className="card-img-top" alt={name} style={{ height: '15vh', objectFit: 'cover' }} />
      </Link>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1rem' }}>
        <h5 className="card-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Link to={`/categoryFromApi/${name}`} style={{ textDecoration: 'none', color: 'inherit' }}>{name}</Link>
        </h5>
      </div>
    </div>
  )
}
