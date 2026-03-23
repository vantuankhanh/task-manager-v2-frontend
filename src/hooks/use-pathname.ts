import { useLocation } from "react-router";

const usePathname = () => {
  const { pathname } = useLocation();

  return pathname;
};

export default usePathname;
