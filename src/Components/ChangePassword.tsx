import { useForm } from "react-hook-form";
import authService from "../Services/auth-service";
import userService from "../Services/user-service";
interface IPassword {
  oldPassword?: string;
  newPassword?: string;
  afterEdit: () => void;
}

export default function EditProfile({ afterEdit }: IPassword) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<IPassword>();

  async function onSubmit(data: IPassword) {
      const oldPassword = watch("oldPassword");
      const newPassword = watch("newPassword");
      const username = userService.getConnectedUser().username;

      authService
        .changePassword({
          username: username!,
          oldPassword: oldPassword!,
          newPassword: newPassword!,
        })
        .then((res) => {
          {
            res && afterEdit();
          }
        })
        .catch((err) => {
          setError("oldPassword", { message: "Password is incorrect" });
          console.log(err);
        });
   

    console.log(data);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "300px", textAlign: "center" }}>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="oldPassword"
              placeholder="oldPassword"
              {...register("oldPassword", {
                required: "OldPassword is required",
              })}
            />
            <label htmlFor="oldPassword">oldPassword</label>
            {errors.oldPassword && <span>{errors.oldPassword.message}</span>}
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="newPassword"
              placeholder="newPassword"
              {...register("newPassword", {
                required: "newPassword is required",
              })}
            />
            <label htmlFor="newPassword">newPassword</label>
            {errors.newPassword && <span>{errors.newPassword.message}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginBottom: "50px" }}
          >
            Change Password
          </button>
        </div>
      </div>
    </form>
  );
}
