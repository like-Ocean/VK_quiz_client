import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import CreateQuiz from "@/pages/CreateQuiz";
import QuizExecution from "@/pages/QuizExecution";
import Results from "@/pages/Results";
import Quizzes from "@/pages/Quizzes";
import RoomLobby from "@/pages/RoomLobby";
import LaunchRoom from "@/pages/LaunchRoom";
import JoinRoom from "@/pages/JoinRoom";
import { RoomSocketWrapper } from "@/router/RoomSocketWrapper";

export const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/profile", element: <Profile /> },
  { path: "/quizzes", element: <Quizzes /> },

  { path: "/quiz/new", element: <CreateQuiz /> },
  { path: "/quiz/:quizId/edit", element: <CreateQuiz /> },
  { path: "/quiz/:quizId/launch", element: <LaunchRoom /> },
  { path: "/quiz/:quizId/monitor", element: <Results /> },

  { path: "/join", element: <JoinRoom /> },
  { path: "/join/:joinCode", element: <JoinRoom /> },

  {
    path: "/room/:roomId",
    element: <RoomSocketWrapper />,
    children: [
      { path: "lobby", element: <RoomLobby /> },
      { path: "play", element: <QuizExecution /> },
    ],
  },

  { path: "/results/:roomId", element: <Results /> },

  { path: "*", element: <Navigate to="/" replace /> },
]);