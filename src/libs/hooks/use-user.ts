import { jwtDecode } from "jwt-decode";
import { useMemo } from "react";
import { IRefreshTokenDecodeModel } from "../types/refresh-token-decode-model";

export const useUser = () => {
  const token = localStorage.getItem("refresh_token");
  let data: IRefreshTokenDecodeModel | null;
  if (token) {
    data = jwtDecode(token as string);
  } else {
    data = null;
  }

  return useMemo(() => data, [data]);
};

export const useRole = () => {
  const user = useUser();
  const role = user ? user.role : 0;

  return useMemo(() => role, [role]);
};
