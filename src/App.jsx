import { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Publish from "./components/Publish";
import Home from "./components/Home";
import PostPage from "./components/PostPage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen grid md:grid-cols-4 grid-cols-1">
      <Sidebar user={user} setUser={setUser} />
      <div className="md:col-span-3 h-full">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/publish"
            element={
              <ProtectedRoute user={user}>
                <Publish user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="/post/:id" element={<PostPage user={user} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;