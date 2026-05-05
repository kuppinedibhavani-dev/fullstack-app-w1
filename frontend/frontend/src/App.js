import React, { useState } from "react";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [error, setError] = useState("");

  // LOGIN
  const login = () => {
    setError("");

    fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.token) {
          setError(data.message || "Login failed");
          return;
        }

        setToken(data.token);

        const payload = JSON.parse(atob(data.token.split(".")[1]));
        setUser(payload.username);
      })
      .catch(() => setError("Server error"));
  };

  // SIGNUP
  const signup = () => {
    setError("");

    fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message !== "User created") {
          setError(data.message || "Signup failed");
          return;
        }

        alert("Signup successful! Please login.");
        setIsLogin(true);
      })
      .catch(() => setError("Server error"));
  };

  // AUTH UI
  if (!token) {
    return (
      <div className="container">
        <div className="card">
          <h2>{isLogin ? "🔐 Login" : "📝 Signup"}</h2>

          <input
            placeholder="Username"
            onChange={e => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />

          <button onClick={isLogin ? login : signup}>
            {isLogin ? "Login" : "Signup"}
          </button>

          {/* Toggle */}
          <p
            style={{ marginTop: "10px", cursor: "pointer", color: "#4f46e5" }}
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin
              ? "Don't have an account? Signup"
              : "Already have an account? Login"}
          </p>

          {/* Error */}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    );
  }

  // AFTER LOGIN
  return (
    <div className="container">
      <div className="card">
        <h1>🎉 Welcome {user} 👋</h1>

        <button
          onClick={() => {
            setToken("");
            setUser("");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;