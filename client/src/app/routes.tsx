import { createBrowserRouter } from 'react-router-dom'
import { CreateTaskMetrics } from './components/CreateTaskMetrics'
import { CreateTaskUpload } from './components/CreateTaskUpload'
import { Layout } from './components/Layout'
import { Leaderboard } from './components/Leaderboard'
import { SubmissionScreen } from './components/SubmissionScreen'
import { TaskCatalog } from './components/TaskCatalog'
import { TaskDetail } from './components/TaskDetail'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: TaskCatalog },
      { path: 'task/:id', Component: TaskDetail },
      { path: 'submit/:id', Component: SubmissionScreen },
      { path: 'create/upload', Component: CreateTaskUpload },
      { path: 'create/metrics', Component: CreateTaskMetrics },
      { path: 'leaderboard/:id', Component: Leaderboard },
    ],
  },
])
