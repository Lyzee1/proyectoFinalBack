import React, { useState, ChangeEvent } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

const App: React.FC = () => {
  const [usuario, setUsuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario, password }),
      });

      const text = await res.text();
      setMessage(text);
    } catch (error) {
      console.error(error);
      setMessage("Error en el registro.");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario, password }),
        credentials: "include",
      });

      let responseData;
      if (res.headers.get("Content-Type")?.includes("application/json")) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }

      console.log("Respuesta del servidor:", res.status, responseData);

      if (res.ok) {
        setMessage("Inicio de sesión exitoso");
        setIsLoggedIn(true);
        navigate("/sesion");
      } else {
        setMessage(responseData.message || "Credenciales incorrectas.");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setMessage("Error en el inicio de sesión.");
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h1 className="title">!Bienvenido!</h1>

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => handleInputChange(e, setUsuario)}
          className="input-field"
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => handleInputChange(e, setPassword)}
          className="input-field"
        />
        <br />

        <div className="button-container">
          {!isLoggedIn ? (
            <>
              <button onClick={handleRegister} className="button">
                Register
              </button>
              <button onClick={handleLogin} className="button">
                Login
              </button>
            </>
          ) : (
            <p>Ya has iniciado sesión</p>
          )}
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default App;
