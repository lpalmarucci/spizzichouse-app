import { Navigate, Outlet, RouteObject } from "react-router-dom";
import Page from "../pages/Dashboard.page";
import Header from "../components/Header.component";
import DashboardPage from "../pages/Dashboard.page";
import PlayersPage from "../pages/Players.page";

export const ROUTES = {
  Dashboard: "/dashboard",
  Players: "/players",
  Matches: "/matches",
};

const commonRoutes: RouteObject[] = [
  {
    path: "",
    element: (
      <main className="w-full h-[100dvh] dark text-foreground bg-background flex flex-col items-center justify-start">
        <Header />
        <main className="relative w-full h-full">
          <Outlet />
        </main>
      </main>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="/dashboard" />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "players",
        element: <PlayersPage />,
      },
    ],
  },
  {
    path: "**",
    element: <h1>404 Not found</h1>,
  },
];

export default commonRoutes;
