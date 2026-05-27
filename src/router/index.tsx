import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
// import { Protected } from '@/components/Protected';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import CreateQuiz from '@/pages/CreateQuiz';
import QuizExecution from '@/pages/QuizExecution';
import Results from '@/pages/Results';

function LegacyQuizRedirect({ to }: { to: (quizId: string) => string }) {
    const { quizId } = useParams<{ quizId: string }>();
    if (!quizId) return <Navigate to="/dashboard" replace />;
    return <Navigate to={to(quizId)} replace />;
}

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

    // Legacy role-based routes
    {
        path: '/organizer/dashboard',
        element: <Navigate to="/dashboard" replace />,
    },
    {
        path: '/participant/dashboard',
        element: <Navigate to="/dashboard" replace />,
    },
    {
        path: '/organizer/create-quiz',
        element: <Navigate to="/quiz/new" replace />,
    },
    {
        path: '/organizer/edit-quiz/:quizId',
        element: <LegacyQuizRedirect to={(id) => `/quiz/${id}/edit`} />,
    },
    {
        path: '/organizer/launch-quiz/:quizId',
        element: <LegacyQuizRedirect to={(id) => `/quiz/${id}/launch`} />,
    },
    {
        path: '/organizer/monitor-quiz/:quizId',
        element: <LegacyQuizRedirect to={(id) => `/quiz/${id}/monitor`} />,
    },

    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
