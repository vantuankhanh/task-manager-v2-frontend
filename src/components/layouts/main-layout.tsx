import { ReactNode } from "react";
import { IChildrenProps } from "../../libs/types/children-props";
import AppFooter from "./app-footer";
import AppSidebar from "./app-sidebar";
import AppTopbar from "./app-topbar";

const LayoutWrap = ({ children }: IChildrenProps) => {
  return (
    <div className="wrapper">
      <AppTopbar />
      <div className="sidebar">
        <AppSidebar />
      </div>
      <div className="main-container">
        <div className="main-content">{children}</div>
        <AppFooter />
      </div>
    </div>
  );
};

const LayoutMain = ({ children }: { children: ReactNode }) => {
  return <LayoutWrap>{children}</LayoutWrap>;
};

export default LayoutMain;
