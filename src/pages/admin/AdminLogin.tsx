import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // mark admin as logged in
    localStorage.setItem("admin-auth", "true");

    // go to dashboard
    navigate("/admin");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <h2>Admin Login</h2>

      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "6px",
        }}
      >
        Login as Admin
      </button>
    </div>
  );
}