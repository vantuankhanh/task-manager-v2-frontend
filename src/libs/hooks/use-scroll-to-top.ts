import { useEffect } from "react";
import usePathname from "@/libs/hooks/use-pathname";

const useScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default useScrollToTop;
