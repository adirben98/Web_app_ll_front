import { useForm } from "react-hook-form";
import registerService, {IUser} from "../Services/auth-service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";


export default function LoginForm() {


  function login() {
    console.log("login");

   registerService.login(watch("email"), watch("password")!).then((data) => {
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

  async function onSuccess(credentials: CredentialResponse) {
    registerService.googleLogin(credentials).then((data) => {
      window.location.href = "/";
      console.log(data);
    })
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
