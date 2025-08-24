
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Role } from './types';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Feed } from './pages/Feed';
import { DiscoverDJs } from './pages/DiscoverDJs';
import { Gigs } from './pages/Gigs';
import { CreateGig } from './pages/CreateGig';
import { Profile } from './pages/Profile';
import { PageSpinner } from './components/Spinner';
import { BottomNav, SideNav } from './components/BottomNav';
import { Leaderboard } from './pages/Leaderboard';
import { Messages } from './pages/Messages';
import { Connections } from './pages/Connections';
import { ChatRoom } from './pages/ChatRoom';
import { Search } from './pages/Search';
import { Notifications } from './pages/Notifications';
import SplashCursor from './components/SplashCursor';
import { MyGigs } from './pages/MyGigs';
import { VenueGigs } from './pages/VenueGigs';
import { GigApplicants } from './pages/GigApplicants';
import { AIDJScout } from './pages/AIDJScout';
import { LiveStream } from './pages/LiveStream';
import { StreamSetup } from './pages/StreamSetup';
import { MediaManager } from './pages/MediaManager';
import { Settings } from './pages/Settings';
import { CreatePost } from './pages/CreatePost';
import { PostDetail } from './pages/PostDetail';
import { useMediaPlayer } from './contexts/MediaPlayerContext';
import { MediaPlayer } from './components/MediaPlayer';
import { EditGig } from './pages/EditGig';
import { usePersistence } from './hooks/usePersistence';
import { NotificationToast } from './components/NotificationToast';


interface AppContainerProps {
    children: React.ReactNode;
}

const AppContainer = ({ children }: AppContainerProps) => {
    const location = useLocation();
    const { currentTrack } = useMediaPlayer();
    const { isDirty, toast, hideToast } = usePersistence();
    const noNavRoutes = ['/login', '/signup', '/stream-setup'];
    const showNav = !noNavRoutes.includes(location.pathname) && !location.pathname.startsWith('/messages/') && !location.pathname.startsWith('/stream/');
    
    useEffect(() => {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        if (isDirty) {
          event.preventDefault();
          // This is required for Chrome
          event.returnValue = '';
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, [isDirty]);


    return (
        <div className="bg-[var(--background)] flex justify-center items-center min-h-screen p-0 md:p-4">
            <SplashCursor />
            {toast && <NotificationToast message={toast.message} type={toast.type} onClose={hideToast} />}
            <div className="w-full h-full md:max-w-6xl md:h-[95vh] md:max-h-[1000px] md:rounded-3xl bg-[var(--background)] overflow-hidden shadow-2xl shadow-lime-500/10 flex flex-col md:flex-row relative md:border-4 md:border-[var(--surface-2)]">
                {showNav && <SideNav />}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <main className="flex-1 overflow-y-auto relative">
                        {children}
                    </main>
                    {currentTrack && <MediaPlayer />}
                    {showNav && <BottomNav />}
                </div>
            </div>
        </div>
    )
}

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles: Role[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, role } = useAuth();
    
    if (isLoading) {
        return <PageSpinner />;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    if (!role || !roles.includes(role)) {
        return <Navigate to="/login" />; // Or a 'Not Authorized' page
    }
    
    return <>{children}</>;
};

const AuthenticatedRoute = ({ children } : { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return <PageSpinner />;

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    return <>{children}</>;
}

const DiscoverRouter = () => {
    // All roles that use discover will now see the DJ list.
    // Finding gigs for DJs has been moved to a new route.
    return <DiscoverDJs />;
};


const AppRoutes = () => {
    const { isAuthenticated, isLoading, role } = useAuth();

    if (isLoading) {
        return <PageSpinner />;
    }
    
    const getDefaultPath = () => {
        if (!isAuthenticated) return '/login';
        switch (role) {
            case Role.DJ: return '/feed';
            case Role.Business: return '/feed';
            case Role.Listener: return '/feed';
            default: return '/login';
        }
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Role Specific Routes */}
            <Route path="/feed" element={<ProtectedRoute roles={[Role.DJ, Role.Listener, Role.Business]}><Feed /></ProtectedRoute>} />
            <Route path="/gigs" element={<ProtectedRoute roles={[Role.DJ]}><MyGigs /></ProtectedRoute>} />
            <Route path="/find-gigs" element={<ProtectedRoute roles={[Role.DJ]}><Gigs /></ProtectedRoute>} />
            <Route path="/discover" element={<ProtectedRoute roles={[Role.DJ, Role.Business, Role.Listener]}><DiscoverRouter /></ProtectedRoute>} />
            <Route path="/create-gig" element={<ProtectedRoute roles={[Role.Business, Role.DJ]}><CreateGig /></ProtectedRoute>} />
            <Route path="/edit-gig/:gigId" element={<ProtectedRoute roles={[Role.Business]}><EditGig /></ProtectedRoute>} />
            <Route path="/create-post" element={<ProtectedRoute roles={[Role.Business, Role.DJ]}><CreatePost /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute roles={[Role.DJ, Role.Business]}><Messages /></ProtectedRoute>} />
            <Route path="/messages/:chatId" element={<ProtectedRoute roles={[Role.DJ, Role.Business]}><ChatRoom /></ProtectedRoute>} />
            <Route path="/venue/gigs" element={<ProtectedRoute roles={[Role.Business]}><VenueGigs /></ProtectedRoute>} />
            <Route path="/venue/gigs/:gigId/applicants" element={<ProtectedRoute roles={[Role.Business]}><GigApplicants /></ProtectedRoute>} />
            <Route path="/stream-setup" element={<ProtectedRoute roles={[Role.DJ]}><StreamSetup /></ProtectedRoute>} />
            <Route path="/media-manager" element={<ProtectedRoute roles={[Role.DJ]}><MediaManager /></ProtectedRoute>} />

            {/* Common Authenticated Routes */}
            <Route path="/leaderboard" element={<AuthenticatedRoute><Leaderboard /></AuthenticatedRoute>} />
            <Route path="/profile/:id/connections" element={<AuthenticatedRoute><Connections /></AuthenticatedRoute>} />
            <Route path="/profile/:id" element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>} />
            <Route path="/post/:postId" element={<AuthenticatedRoute><PostDetail /></AuthenticatedRoute>} />
            <Route path="/search" element={<AuthenticatedRoute><Search /></AuthenticatedRoute>} />
            <Route path="/notifications" element={<AuthenticatedRoute><Notifications /></AuthenticatedRoute>} />
            <Route path="/stream/:sessionId" element={<AuthenticatedRoute><LiveStream /></AuthenticatedRoute>} />
            <Route path="/settings" element={<AuthenticatedRoute><Settings /></AuthenticatedRoute>} />
            
            {/* Default redirect */}
            <Route
                path="*"
                element={<Navigate to={getDefaultPath()} />}
            />
        </Routes>
    );
};


const App = () => {
  return (
    <HashRouter>
        <AppContainer>
            <AppRoutes />
        </AppContainer>
    </HashRouter>
  );
};

export default App;
