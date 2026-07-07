import { request } from "../../libs/api/api-function";
import { ITaskModel } from "./task.types";

export const createTask = async (item: ITaskModel) => {
  const data = await request("post", import.meta.env.VITE_URL_CREATE_TASK, item, {
    messageSuccess: "Create new task successfully",
    messageFail: "Create task failed",
  });
  return data;
};

export const updateTask = async (item: ITaskModel) => {
  const res = await request("put", import.meta.env.VITE_URL_UPDATE_TASK, item, {
    messageSuccess: "Update task successfully",
    messageFail: "Update task failed",
  });
  return res;
};

export const deleteTask = async (taskId: string) => {
  const res = await request(
    "delete",
    import.meta.env.VITE_URL_GET_TASK,
    { taskId },
    {
      messageSuccess: "Delete Task successfully",
      messageFail: "Delete Task failed",
    },
  );
  return res;
};

export const getTask = async (employeeId?: string) => {
  const data = await request("post", import.meta.env.VITE_URL_GET_TASK, {
    employeeId,
  });
  return data ? (data.data as ITaskModel[]) : [];
};
