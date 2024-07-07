import { useForm } from "react-hook-form";
import apiClient from "../Services/api-client";

interface AddCommentProps {
  author: string;
  recipeId: string;
  handle:()=>void;
}

interface FormData {
  content: string;
}

export default function CommentCreate({ author, recipeId, handle }: AddCommentProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {

      const newComment = {
        author,
        recipeId,
        content: data.content,
      };
      const res = await apiClient.post("/comment", newComment);
      console.log(res);
      reset()
      handle()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ margin: '20px 0', display: 'flex', flexDirection: 'column' }}>
      <textarea
        {...register("content", { required: "Your Comment is Empty!" })}
        placeholder="Your comment"
        style={{
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          border: '1px solid #ddd',
          resize: 'none',
          height: '100px'
        }}
      />
      {errors.content && <span>{errors.content.message}</span>}
      <button type="submit" style={{
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer'
      }}>
        Add Comment
      </button>
    </form>
  );
}
