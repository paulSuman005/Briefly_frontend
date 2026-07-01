import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import BrieflyLoader from "./BrieflyLoader";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, authChecked } = useSelector((state) => state.auth);
  if (!authChecked) {
    return <BrieflyLoader />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return children ? children : <Outlet />;
}