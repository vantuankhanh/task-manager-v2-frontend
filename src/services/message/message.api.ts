import { request } from "../../libs/api/api-function";
import { IMessageModel } from "./message.types";

export const getMessage = async (from: string, to: string) => {
  const data = await request("post", import.meta.env.VITE_URL_GET_MESSAGE, {
    from,
    to,
  });
  return data ? (data.data as IMessageModel[]) : [];
};

export const createMessage = async (
  from: string,
  to: string,
  message: string,
) =>
  await request(
    "post",
    import.meta.env.VITE_URL_CREATE_MESSAGE,
    { from, to, message },
    {
      messageFail: "Create message failed",
    },
  );
