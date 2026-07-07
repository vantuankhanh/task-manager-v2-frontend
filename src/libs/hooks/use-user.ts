import { jwtDecode } from "jwt-decode";
import { useMemo } from "react";
import { IRefreshTokenDecodeModel } from "@/libs/types/refresh-token-decode-model";

export const useUser = () => {
  const token = localStorage.getItem("refresh_token");

  return useMemo<IRefreshTokenDecodeModel | null>(
    () => (token ? jwtDecode(token) : null),
    [token]
  );
};

export const useRole = () => {
  const user = useUser();

  return useMemo(() => (user ? user.role : 0), [user]);
};
