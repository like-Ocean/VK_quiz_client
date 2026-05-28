import { createBrowserRouter, Navigate } from 'react-router-dom';
// import { Protected } from '@/components/Protected';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import CreateQuiz from '@/pages/CreateQuiz';
import QuizExecution from '@/pages/QuizExecution';
import Results from '@/pages/Results';
import Quizzes from '@/pages/Quizzes';
import QuizDetails from '@/pages/QuizDetails';


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />,
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/profile',
        element: <Profile />,
    },
    {
        path: '/quizzes',
        element: <Quizzes />,
    },
    {
        path: '/quizzes/:quizId',
        element: <QuizDetails />,
    },

    // Organizer flow (registered users)
    {
        path: '/quiz/new',
        element: <CreateQuiz />,
    },
    {
        path: '/quiz/:quizId/edit',
        element: <CreateQuiz />,
    },
    {
        path: '/quiz/:quizId/launch',
        element: <CreateQuiz />,
    },
    {
        path: '/quiz/:quizId/monitor',
        element: <Results />,
    },

    // Public
    {
        path: '/quiz/:roomCode',
        element: <QuizExecution />,
    },
    {
        path: '/results/:quizId',
        element: (
            // <Protected>
                <Results />
            // </Protected>
        ),
    },

    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
