import {useForm} from 'react-hook-form';
import apiClient from '../Services/api-client';

export default function LoginForm() {
    interface IUser{
        email:string;
        password:string;
    }

    function login(){
        console.log("login")
        
        apiClient.post<IUser>("auth/login",{email:watch("email"),password:watch("password")}).then((response)=>{
            console.log(response);
        }).catch(()=>{
            setError("password",{message:"Invalid Email or Password"})
        })
    }
    const {handleSubmit,formState:{errors},register,watch,setError} = useForm<IUser>();

  return (
<form onSubmit={handleSubmit(login)}>
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="login-form" style={{ width: '300px' }}>
      <h1 style={{textAlign:'center', marginBottom: '50px' }}>Welcome!</h1>
      <div className="form-floating mb-3">
        <input type="email" className="form-control" id="email" placeholder="Email" {...register("email",{required:"Email is required"})} />
        <label htmlFor="email">Email</label>
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <div className="form-floating">
        <input type="password" className="form-control" id="password" placeholder="Password" {...register("password",{required:"Password is required"})}/>
        <label htmlFor="password">Password</label>
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      <button className="btn btn-primary mt-3" >Login</button>
    </div>
  </div>
</form>
  )
}
