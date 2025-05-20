import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
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
import ReviewDetail from "../pages/ReviewDetail";
import Reviews from "../pages/Reviews";
import CreateList from "../pages/CreateList";
import ListDetails from "../pages/ListDetails";
import EditList from "../pages/EditList";

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
      },
      {
        path: "reviews/:id",
        element: <ReviewDetail />,
      },
      {
        path: "reviews",
        element: <Reviews />,
      },
      {
        path: "create-list",
        element: (
          <ProtectedRoute>
            <CreateList />
          </ProtectedRoute>
        ),
      },
      {
        path: "lists/:id",
        element: <ListDetails />,
      },
      {
        path: "lists/:id/edit",
        element: (
          <ProtectedRoute>
            <EditList />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
