import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSession } from "./context/SessionContext";
import NavBar from "./components/NavBar";

// Pages
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import Dashboard from "./pages/main/Dashboard";
import Users from "./pages/main/Users";
import Profile from "./pages/main/Profile";

const App = () => {
  const { session, loading } = useSession();

  // Loader while session is being fetched
  if (loading) return <div>Loading...</div>;

  // Wrapper for protected routes
  const ProtectedOutlet = () => {
    if (!session?.user) return <Navigate to="/login" replace />;
    return (
      <div className="flex h-screen overflow-hidden">
        <NavBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    );
  };

  // Optionally redirect logged-in users away from login page
  const LoginRedirect = () => {
    if (session?.user) return <Navigate to="/" replace />;
    return <Login />;
  };

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginRedirect />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* Protected routes */}
      <Route element={<ProtectedOutlet />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<Profile />} />
        {/* Add more protected pages here */}
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default App;
