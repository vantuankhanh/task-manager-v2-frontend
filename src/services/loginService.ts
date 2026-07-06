import axios from "axios";
import { toast } from "react-toastify";

export const login = async (email: string, password: string) => {
  try {
    const request = {
      email,
      password,
    };

    const res = await axios.post(
      import.meta.env.VITE_BASE_URL + import.meta.env.VITE_URL_LOGIN,
      request
    );

    return res;
  } catch {
    toast.error("Failed to login");
    return false;
  }
};

export const sendVerifyCode = async (
  type: string,
  phoneNumber?: string,
  email?: string
) => {
  try {
    const res = await axios.post(
      import.meta.env.VITE_BASE_URL +
        import.meta.env.VITE_URL_SEND_VERIFY_CODE,
      {
        type,
        phoneNumber,
        email,
      }
    );
    return res;
  } catch {
    return false;
  }
};

export const submitVerifyCode = async (
  type: string,
  accessCode: string,
  phoneNumber?: string,
  email?: string
) => {
  try {
    const res = await axios.post(
      import.meta.env.VITE_BASE_URL + import.meta.env.VITE_URL_VALIDATE_CODE,
      {
        type,
        phoneNumber,
        email,
        accessCode,
      }
    );

    return res;
  } catch {
    return false;
  }
};
