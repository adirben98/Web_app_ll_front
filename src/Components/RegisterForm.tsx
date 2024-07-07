import React, {  } from "react";
import avatar from "../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import uploadPhoto from "../Services/file-service";
import { useForm } from "react-hook-form";
import apiClient from "../Services/api-client";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { IUser, registrUser ,setLocalStorage} from "../Services/register-service";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<IUser>();


  async function Register() {

    let url = "";
    if (image) url = await uploadPhoto(image!);
    else url = avatar;

    const user: IUser = {
      email: watch("email"),
      imgUrl: url,
      username: watch("username"),
      password: watch("password"),
    };
    registrUser(user)
      .then((data) => {
        
        


        console.log(data);
      })
      .catch((error) => {
        if(error.response.status===409){
          setError("email", { message: "This Email is Already Taken" });
        }
        else if(error.response.status===408){
          setError("username", { message: "This Username is Already Taken" });

        }
        console.log(error);
      });
  }

  function handleClick() {
    photoGalleryRef.current?.click();
  }

  async function checkEmail(email: string) {
    try {
      const res=await apiClient.post("/auth/isEmailTaken", {
        email: email,
      });
      if (res.status===200)setError("email", { message: "" });

    } catch (error) {
      setError("email", { message: "This Email is Already Taken" });
    }
  }
  async function checkUsername(username: string) {
    try {
      const res=await apiClient.post("/auth/isUsernameTaken", {
        username: username,
      });
      if (res.status===200)setError("username", { message: "" });

    } catch (error) {
      setError("username", { message: "This Username is Already Taken" });
    }
  }
  async function onSuccess(response: CredentialResponse) {
    try {
      const res = await apiClient.post<IUser>("auth/googleLogin", {
        credentials: response.credential,
      });
      setLocalStorage(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  function onError() {
    console.log();
  }

  const [image, setImage] = React.useState<File>();

  const photoGalleryRef = React.useRef<HTMLInputElement>(null);
  return (
    <form onSubmit={handleSubmit(Register)}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="register-form" style={{ width: "300px" }}>
          <h1 style={{ textAlign: "center", marginBottom: "50px" }}>
            Register
          </h1>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src={image ? URL.createObjectURL(image) : avatar}
              alt="Avatar"
              style={{ width: "100px", height: "100px" }}
            />
          </div>

          <button type="button" className="btn" onClick={handleClick}>
            <FontAwesomeIcon icon={faImage} className="fa-xl" />
          </button>
          <input
            style={{ display: "none" }}
            ref={photoGalleryRef}
            type="file"
            onChange={(event) => {
              if (event.target.files) {
                setImage(event.target.files[0]);
              }
            }}
          />
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              onBlur={(e) => checkEmail(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          <div className="form-floating mb-3">
            <input
              type="username"
              className="form-control"
              id="username"
              placeholder="Username"
              {...register("username", { required: "Username is required" })}
              onBlur={(e)=>checkUsername(e.target.value)}
            />
            <label htmlFor="username">Username</label>
            {errors.username && <span>{errors.username.message}</span>}
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
            <button className="btn btn-primary">Register</button>
            <GoogleLogin onSuccess={onSuccess} onError={onError} />
          </div>
        </div>
      </div>
    </form>
  );
}
