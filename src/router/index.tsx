import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Protected } from '@/components/Protected';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import OrganizerDashboard from '@/pages/OrganizerDashboard';
import ParticipantDashboard from '@/pages/ParticipantDashboard';
import CreateQuiz from '@/pages/CreateQuiz';
import QuizExecution from '@/pages/QuizExecution';
import Results from '@/pages/Results';
import HomeRedirect from '@/components/HomeRedirect';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomeRedirect />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },

    // Organizer routes
    {
        path: '/organizer/dashboard',
        element: (
            <Protected role="organizer">
                <OrganizerDashboard />
            </Protected>
        ),
    },
    {
        path: '/organizer/create-quiz',
        element: (
            <Protected role="organizer">
                <CreateQuiz />
            </Protected>
        ),
    },
    {
        path: '/organizer/edit-quiz/:quizId',
        element: (
            <Protected role="organizer">
                <CreateQuiz />
            </Protected>
        ),
    },
    {
        path: '/organizer/launch-quiz/:quizId',
        element: (
            <Protected role="organizer">
                <CreateQuiz />
            </Protected>
        ),
    },
    {
        path: '/organizer/monitor-quiz/:quizId',
        element: (
            <Protected role="organizer">
                <Results />
            </Protected>
        ),
    },

    // Participant routes
    {
        path: '/participant/dashboard',
        element: (
            <Protected role="participant">
                <ParticipantDashboard />
            </Protected>
        ),
    },

    // Public
    {
        path: '/quiz/:roomCode',
        element: <QuizExecution />,
    },
    {
        path: '/results/:quizId',
        element: (
            <Protected>
                <Results />
            </Protected>
        ),
    },

    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
