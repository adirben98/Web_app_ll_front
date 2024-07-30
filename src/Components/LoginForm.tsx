import { useForm } from "react-hook-form";
import registerService, { IUser } from "../Services/auth-service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";
import UserService from "../Services/user-service";
import backgroundImage from "../assets/background.png";


export default function LoginForm() {
  function login() {
    console.log("login");

    registerService
      .login(watch("email"), watch("password")!)
      .then((data) => {
        window.location.href = "/";
        console.log(data);
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

  function onSuccess(credentials: CredentialResponse) {
    registerService.googleLogin(credentials).then((data) => {
      window.location.href = "/";
      console.log(data);
    });
  }
  useEffect(() => {
    if (UserService.getConnectedUser()) window.location.href = "/";
  }, []);

  return (
    <form onSubmit={handleSubmit(login)}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "15px",
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
            width: "500px",
            height: "auto",
            padding: "30px",
          }}
        >
          <h1
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: "bold",
              fontSize: "2.5rem",
              marginTop: "30px",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            Welcome<br />
            to YumMe!
          </h1>
          <div className="form-floating mb-4">
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
          <div className="form-floating mb-4">
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
          <button className="btn btn-primary" style={{ fontSize: "1rem", width: "100%", marginBottom: "15px" }}>
            Login
          </button>
          <GoogleLogin onSuccess={onSuccess} />
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <span>Don't have an account? </span>
            <button
              onClick={() => { window.location.href = "/register" }}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                fontSize: "1rem",
                cursor: "pointer",
                textDecoration: "underline",
                padding: "0",
                marginLeft: "5px",
              }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
