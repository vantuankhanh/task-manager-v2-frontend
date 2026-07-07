import { request } from "../../libs/api/api-function";
import { IEmployeeModel } from "./employee.types";

export const getEmployee = async (id: string = "", role?: number) => {
  const data = await request(
    "post",
    import.meta.env.VITE_URL_GET_EMPLOYEE,
    { id, role },
    { messageFail: "Fetch employee failed" },
  );
  return data ? (data.data as IEmployeeModel[]) : [];
};

export const updateEmployee = async (item: IEmployeeModel) =>
  await request("post", import.meta.env.VITE_URL_UPDATE_EMPLOYEE, item, {
    messageSuccess: "Successfully updated employee",
  });

export const createPassword = async (password: string, id: string) =>
  await request("post", import.meta.env.VITE_URL_CREATE_PASSWORD, {
    password,
    id,
  });

export const createEmployee = async (item: IEmployeeModel) =>
  await request("post", import.meta.env.VITE_URL_CREATE_EMPLOYEE, item, {
    messageSuccess: "Successfully created employee",
  });

export const deleteEmployee = async (id: string) =>
  await request(
    "delete",
    import.meta.env.VITE_URL_GET_EMPLOYEE,
    { id },
    { messageSuccess: "Successfully deleted employee" },
  );

export const changeRoleEmployee = async (item: IEmployeeModel) => {
  if (item.role && item.role > 0) {
    const res = await request(
      "put",
      import.meta.env.VITE_URL_UPDATE_EMPLOYEE,
      { id: item.id, role: 0 },
      { messageSuccess: `Successfully change role to normal employee` },
    );
    return res;
  }
};
