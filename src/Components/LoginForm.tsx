import { useForm } from "react-hook-form";
import apiClient from "../Services/api-client";
import {setLocalStorage} from "../Services/register-service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

export default function LoginForm() {
  interface IUser {
    email: string;
    username: string;
    password: string;
    imgUrl: string;
    accessToken?: string;
    refreshToken?: string;
  }

  function login() {
    console.log("login");

    apiClient
      .post<IUser>("/auth/login", {
        email: watch("email"),
        password: watch("password"),
      })
      .then((response) => {
        setLocalStorage(response.data)
        console.log(response);
      })
      .catch(() => {
        setError("password", { message: "Invalid Email or Password" });
      });
  }
  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
    setError,
  } = useForm<IUser>();

  async function onSuccess(credentials: CredentialResponse) {
    try {
      const res = await apiClient.post("auth/googleLogin", {
        credentials: credentials.credential,
      });
      setLocalStorage(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(login)}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="login-form" style={{ width: "300px" }}>
          <h1 style={{ textAlign: "center", marginBottom: "50px" }}>
            Welcome!
          </h1>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
            />
            <label htmlFor="email">Email</label>
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            <label htmlFor="password">Password</label>
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "25px",
            }}
          >
            <button className="btn btn-primary ">Login</button>
            <GoogleLogin onSuccess={onSuccess} />
          </div>
        </div>
      </div>
    </form>
  );
}
