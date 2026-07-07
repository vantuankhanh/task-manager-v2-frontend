import { AxiosError, AxiosRequestConfig, Method } from "axios";
import { toast } from "react-toastify";
import axiosCustom from "./http-client";

interface IAPIFunctionOptionProps {
  messageAPI?: boolean;
  messageSuccess?: string;
  messageFail?: string;
  configAPI?: AxiosRequestConfig<unknown>;
}

export const request = async (
  method: Method,
  url: string,
  data?: unknown,
  option?: IAPIFunctionOptionProps,
) => {
  try {
    const res = await axiosCustom.request({
      method,
      url,
      data,
      ...option?.configAPI,
    });

    if (option?.messageSuccess) {
      toast.success(option.messageSuccess);
    } else if (option?.messageAPI) {
      toast.success(res.data?.message);
    }

    return res.data;
  } catch (error) {
    const message = (error as AxiosError<{ message?: string }>).response?.data
      ?.message;
    toast.error(option?.messageFail || message || "Something went wrong");
    return false;
  }
};
