import { Link } from 'react-router-dom';

export interface recipeRow {
  recipeImg: string;
  recipeName: string;
  description: string;
  url:string
}

export default function RecipeRow({ recipeImg, recipeName, description, url }: recipeRow) {
  return (
    <div className="card mb-4" style={{ height: '30vh', display: 'flex', flexDirection: 'column' }}>
      <Link to={url}>
        <img src={recipeImg} className="card-img-top" alt={recipeName} style={{ height: '15vh', objectFit: 'cover' }} />
      </Link>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1rem' }}>
        <h5 className="card-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Link to={url} style={{ textDecoration: 'none', color: 'inherit' }}>{recipeName}</Link>
        </h5>
        <p className="card-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '1px' }}>{description}</p>
      </div>
    </div>
  );
}
