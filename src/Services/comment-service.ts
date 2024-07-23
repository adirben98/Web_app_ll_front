import { IComment } from "../Components/Comment";
import {apiClient} from "./useAuth";

class commentService{
    getComments(id: string){
        const controller = new AbortController();
        const comments = apiClient.get<IComment[]>(`/comment/${id}`, { signal: controller.signal });
        return {comments, cancelComments:()=>controller.abort()};
    }

    createComment(comment: IComment){
        return apiClient.post(`/comment`, comment);
    }

    updateComment(comment: IComment){
        return apiClient.put(`/comment`, comment);
    }

    deleteComment(id: string){
        return apiClient.delete(`/comment/${id}`);
    }



}

export default new commentService();