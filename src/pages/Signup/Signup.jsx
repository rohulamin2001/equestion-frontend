import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

export default function Signup() {
  const { openAuthDrawer } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    openAuthDrawer("register");
    navigate("/", { replace: true });
  }, [openAuthDrawer, navigate]);

  return null;
}
