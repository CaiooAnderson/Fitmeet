import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "@/pages/Login/Login";
import Register from "@/pages/Register/Register";
import Menu from "@/pages/Menu/Menu";
import UserProfile from "@/pages/Profile/UserProfile";
import ActivityId from "@/pages/ActivityId/ActivityId";
import EditProfile from "@/pages/EditProfile/EditProfile";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/menu"
          element={
            <PrivateRoute>
              <Menu />
            </PrivateRoute>
          }
        />

        <Route
          path="/activities/:id"
          element={
            <PrivateRoute>
              <ActivityId />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
