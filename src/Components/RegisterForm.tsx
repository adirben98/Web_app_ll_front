import React, { useEffect } from "react";
import avatar from "../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import uploadPhoto from "../Services/file-service";
import { useForm } from "react-hook-form";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import registerService, { IUser } from "../Services/auth-service";
import backgroundImage from "../assets/background.png";
import userService from "../Services/user-service";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<IUser>();
  const [error, seterror] = React.useState<string>("");

  async function Register() {
    let url = "";
    try{
    if (image) {
      url = await uploadPhoto(image);
    }}catch(e){
      console.log(e);
    }

    const user: IUser = {
      email: watch("email"),
      image: url,
      username: watch("username"),
      password: watch("password"),
    };
    console.log(url);

    registerService
      .registrUser(user)
      .then((data) => {
        window.location.href = "/";
        console.log(data);
      })
      .catch((error) => {
        if (error.response.status === 409) {
          setError("email", { message: "This Email is Already Taken" });
        } else if (error.response.status === 408) {
          setError("username", { message: "This Username is Already Taken" });
        }
        console.log(error);
      });
  }

  function handleClick() {
    photoGalleryRef.current?.click();
  }

  async function checkEmail(email: string) {
    registerService
      .isEmailTaken(email)
      .then((res) => {
        if (res) setError("email", { message: "" });
      })
      .catch((error) => {
        setError("email", { message: "This Email is Already Taken" });
        console.log(error);
      });
  }

  async function checkUsername(username: string) {
    registerService
      .isUsernameTaken(username)
      .then((res) => {
        if (res) setError("username", { message: "" });
        else {
          setError("username", { message: "This Username is Already Taken" });
        }
      })
      .catch((error) => {
        setError("username", { message: "This Username is Already Taken" });
        console.log(error);
      });
  }
  async function onSuccess(response: CredentialResponse) {
    registerService
      .googleLogin(response)
      .then((res) => {
        console.log(res);
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function onError() {
    seterror("Error login from google");
    console.log();
  }

  const [image, setImage] = React.useState<File>();

  const photoGalleryRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
     if (userService.getConnectedUser()) window.location.href = "/";
  }, []);
  return (
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
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          width: "400px",
          padding: "20px",
          height: "auto",
        }}
      >
        <h1
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontWeight: "bold",
            padding: "30px",
            fontSize: "2rem",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Register
        </h1>
        <form
          onSubmit={handleSubmit(Register)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {error && <span>{error}</span>}
          <div style={{ marginBottom: "20px" }}>
            <img
              src={image ? URL.createObjectURL(image) : avatar}
              alt="Avatar"
              style={{ width: "80px", height: "80px", borderRadius: "50%" }}
            />
          </div>
          <button
            type="button"
            className="btn"
            onClick={handleClick}
            style={{
              display: "block",
              margin: "0 auto 20px auto",
              padding: "10px",
              fontSize: "1.2rem",
            }}
          >
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
              onBlur={(e) => checkUsername(e.target.value)}
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
        </form>
      </div>
    </div>
  );
}
