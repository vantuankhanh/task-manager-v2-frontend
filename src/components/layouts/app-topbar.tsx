import { useUser } from "@/libs/hooks/use-user";
import Logo from "@/assets/images/logo.png";

const AppTopbar = () => {
  const user = useUser();

  return (
    <div className="topbar">
      <div className="flex gap-7 items-center">
        <img className="h-10" src={Logo} alt="Logo" />
        <h1 className="text-3xl font-bold">TASK MANAGER</h1>
      </div>

      <div className="p-2 pr-3 flex gap-3 items-center cursor-pointer rounded-full bg-[#c9e6ff]">
        <div
          className="text-white rounded-full inline-flex items-center justify-center w-8 h-8"
          style={{ backgroundColor: "#2196F3" }}
        >
          <p>{user?.name[0].toUpperCase()}</p>
        </div>
        <p className="max-w-32 font-semibold text-sm text-[#0b2340] text-ellipsis whitespace-nowrap overflow-hidden capitalize">
          {user?.name}
        </p>
      </div>
    </div>
  );
};

export default AppTopbar;
