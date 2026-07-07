import { useMemo } from "react";
import {
  FaFolder as FolderFillIcon,
  FaCommentDots as Message,
  FaRightFromBracket as SignOut,
  FaUser as UserInfoIcon,
} from "react-icons/fa6";
import { useRole } from "@/libs/hooks/use-user";
import { IMenuModel } from "@/libs/types/menu-model";
import AppMenuitem from "@/components/layouts/app-menu-item";

const AppMenu = () => {
  const role = useRole();

  const page: IMenuModel[] = useMemo(() => {
    const temp = [
      {
        label: "Manage Employee",
        icon: <UserInfoIcon />,
        to: "/employee",
        visible: role !== 0,
      },
      {
        label: "Manage Task",
        icon: <FolderFillIcon />,
        to: "/tasks",
      },
      {
        label: "Message",
        icon: <Message />,
        to: "/messages",
      },
    ];
    return temp;
  }, [role]);

  return (
    <div className="sidebar-menu">
      <ul className="flex-1">
        {page.map((item, i) => {
          return <AppMenuitem {...item} key={i + item.label} />;
        })}
      </ul>

      <hr className="m-3" />

      <ul>
        <AppMenuitem label="Sign out" icon={<SignOut />} to="/auth/logout" />
      </ul>
    </div>
  );
};

export default AppMenu;
