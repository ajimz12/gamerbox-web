import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import ErrorPage from "../pages/ErrorPage";
import ProtectedRoute from "../components/ProtectedRoute";
import Register from "../pages/Register";
import EditProfile from "../pages/EditProfile";
import RootLayout from "../layout/rootlayout";
import UserProfile from "../pages/UserProfile";
import Users from "../pages/Users";
import Followers from "../pages/Followers";
import Following from "../pages/Following";
import Games from "../pages/Games";
import GameDetails from "../pages/GameDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/edit",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
      },
      {
          path: "user/:username",
          element: <UserProfile />,
      },
      {
          path: "users",
          element: <Users />,
      },
      {
        path: "user/:username/followers",
        element: <Followers />,
      },
      {
        path: "user/:username/following",
        element: <Following />,
      },
      {
        path: "games",
        element: <Games />,
      },
      {
        path: "games/:id",
        element: <GameDetails />,
      }
    ],
  },
]);

export default router;
