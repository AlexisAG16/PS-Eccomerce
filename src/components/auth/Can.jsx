import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const Can = ({ perform, children, fallback = null }) => {
  const { can } = useContext(AuthContext);

  return can(perform) ? children : fallback;
};

export default Can;