import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollArriba = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);

  return null;
};

export default ScrollArriba;