import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && !loading) {
      navigate("/signin");
    }
  }, [token, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>User ID:</strong> {user._id}</p>
    </div>
  );
};

export default Profile;
