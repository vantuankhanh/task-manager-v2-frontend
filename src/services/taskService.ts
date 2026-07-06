import { ITaskModel } from "../models/TaskModel";
import { deleteAPI, postAPI, putAPI } from "./apiFunction";

export const createTask = async (item: ITaskModel) => {
  const data = await postAPI(import.meta.env.VITE_URL_CREATE_TASK, item, {
    messageSuccess: "Create new task successfully",
    messageFail: "Create task failed",
  });
  return data;
};

export const updateTask = async (item: ITaskModel) => {
  const res = await putAPI(import.meta.env.VITE_URL_UPDATE_TASK, item, {
    messageSuccess: "Update task successfully",
    messageFail: "Update task failed",
  });
  return res;
};

export const deleteTask = async (taskId: string) => {
  const res = await deleteAPI(
    import.meta.env.VITE_URL_GET_TASK,
    { taskId },
    {
      messageSuccess: "Delete Task successfully",
      messageFail: "Delete Task failed",
    }
  );
  return res;
};

export const getTask = async (employeeId?: string) => {
  const data = await postAPI(import.meta.env.VITE_URL_GET_TASK, {
    employeeId,
  });
  return data.data as ITaskModel[];
};
