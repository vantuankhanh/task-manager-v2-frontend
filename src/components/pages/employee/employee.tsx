import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { useRole } from "../../../libs/hooks/use-user";

const EmployeeAdmin = lazy(() => import("./employee-admin"));

const Employee = () => {
  const role = useRole();

  if (role !== 0) {
    return <EmployeeAdmin />;
  }
  return <Navigate to="/auth/403" />;
};

export default Employee;
