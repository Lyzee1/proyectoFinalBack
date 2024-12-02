import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import "./sesion.css";

interface Heroe {
  id?: number;
  alias: string;
  nombre: string;
  apellido: string;
  edad: number;
  ciudad: string;
  poderes: string;
}

function AppHeroes() {
  const [message, setMessage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [calls, setCalls] = useState<boolean>(true);
  const [heroes, setHeroes] = useState<Heroe[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [indiceEditar, setIndiceEditar] = useState<number | null>(null);
  const [nuevoHeroe, setNuevoHeroe] = useState<Heroe>({
    alias: "",
    nombre: "",
    apellido: "",
    edad: 0,
    ciudad: "",
    poderes: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/superheroes`
        );
        const result = await response.json();
        setHeroes(result);
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
      }
    };
    fetchData();
  }, [calls]);

  const alternarFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
    setIndiceEditar(null);
    setNuevoHeroe({
      alias: "",
      nombre: "",
      apellido: "",
      edad: 0,
      ciudad: "",
      poderes: "",
    });
  };

  const manejarCambio = (evento: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evento.target;
    setNuevoHeroe((prevHeroe) => ({
      ...prevHeroe,
      [name]: name === "edad" ? Number(value) : value,
    }));
  };

  const manejarEnvio = async (evento: FormEvent) => {
    evento.preventDefault();

    if (indiceEditar !== null) {
      const resUpdateHeroe = await fetch(
        `${process.env.REACT_APP_API_URL}/superheroes/${heroes[indiceEditar].id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoHeroe),
        }
      );

      if (resUpdateHeroe.status === 200) {
        setCalls((prev) => !prev);
      } else {
        alert("Error al actualizar el héroe.");
      }
    } else {
      const resNewHeroe = await fetch(
        `${process.env.REACT_APP_API_URL}/superheroes/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoHeroe),
        }
      );

      if (resNewHeroe.status === 201) {
        setCalls((prev) => !prev);
      } else {
        alert("Error al agregar el héroe.");
      }
    }

    setNuevoHeroe({
      alias: "",
      nombre: "",
      apellido: "",
      edad: 0,
      ciudad: "",
      poderes: "",
    });
    setMostrarFormulario(false);
    setIndiceEditar(null);
  };

  const eliminarHeroe = async (id: number) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/superheroes/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.status === 204) {
        setCalls((prev) => !prev);
      } else {
        alert("No se pudo eliminar el héroe.");
      }
    } catch (error) {
      console.error("Error al eliminar el héroe:", error);
      alert("Ocurrió un error al intentar eliminar el héroe.");
    }
  };

  const editarHeroe = (indice: number) => {
    setNuevoHeroe(heroes[indice]);
    setIndiceEditar(indice);
    setMostrarFormulario(true);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/logout`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        setMessage("Sesión cerrada exitosamente.");
        setIsLoggedIn(false);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        const errorText = await res.text();
        setMessage(`Error al cerrar sesión: ${errorText}`);
      }
    } catch (error) {
      console.error("Error al intentar cerrar sesión:", error);
      setMessage("Ocurrió un error al cerrar sesión.");
    }
  };

  return (
    <>
      <div className="contenedor-principal">
        <div className="seccion-lista">
          <h1 className="titulo">Super Héroes</h1>
          <table>
            <thead>
              <tr>
                <th>Alias</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Edad</th>
                <th>Ciudad</th>
                <th>Poderes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {heroes.map((heroe, indice) => (
                <tr key={heroe.id}>
                  <td>{heroe.alias}</td>
                  <td>{heroe.nombre}</td>
                  <td>{heroe.apellido}</td>
                  <td>{heroe.edad}</td>
                  <td>{heroe.ciudad}</td>
                  <td>{heroe.poderes}</td>
                  <td>
                    <button
                      className="boton-eliminar"
                      onClick={() => eliminarHeroe(heroe.id!)}
                    >
                      🗑️
                    </button>
                    <button
                      className="boton-editar"
                      onClick={() => editarHeroe(indice)}
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="boton-agregar" onClick={alternarFormulario}>
            +
          </button>
        </div>

        {mostrarFormulario && (
          <div className="seccion-formulario">
            <h2>{indiceEditar !== null ? "Editar Héroe" : "Agregar Héroe"}</h2>
            <form onSubmit={manejarEnvio}>
              <input
                type="text"
                name="alias"
                value={nuevoHeroe.alias}
                onChange={manejarCambio}
                placeholder="Alias"
                required
              />
              <input
                type="text"
                name="nombre"
                value={nuevoHeroe.nombre}
                onChange={manejarCambio}
                placeholder="Nombre"
                required
              />
              <input
                type="text"
                name="apellido"
                value={nuevoHeroe.apellido}
                onChange={manejarCambio}
                placeholder="Apellido"
                required
              />
              <input
                type="number"
                name="edad"
                value={nuevoHeroe.edad}
                onChange={manejarCambio}
                placeholder="Edad"
                required
              />
              <input
                type="text"
                name="ciudad"
                value={nuevoHeroe.ciudad}
                onChange={manejarCambio}
                placeholder="Ciudad"
                required
              />
              <input
                type="text"
                name="poderes"
                value={nuevoHeroe.poderes}
                onChange={manejarCambio}
                placeholder="Poderes"
                required
              />
              <button type="button" onClick={alternarFormulario}>
                Cancelar
              </button>
              <button type="submit">
                {indiceEditar !== null ? "Actualizar" : "Agregar"}
              </button>
            </form>
          </div>
        )}
        <button onClick={handleLogout} className="button">
          Logout
        </button>
      </div>
    </>
  );
}

export default AppHeroes;
