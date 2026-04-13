import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { TaskCatalog } from "./components/TaskCatalog";
import { TaskDetail } from "./components/TaskDetail";
import { SubmissionScreen } from "./components/SubmissionScreen";
import { CreateTaskUpload } from "./components/CreateTaskUpload";
import { CreateTaskMetrics } from "./components/CreateTaskMetrics";
import { Leaderboard } from "./components/Leaderboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: TaskCatalog },
      { path: "task/:id", Component: TaskDetail },
      { path: "submit/:id", Component: SubmissionScreen },
      { path: "create/upload", Component: CreateTaskUpload },
      { path: "create/metrics", Component: CreateTaskMetrics },
      { path: "leaderboard/:id", Component: Leaderboard },
    ],
  },
]);
