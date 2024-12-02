import React, { useState, useEffect } from "react";
import "./CrudApp.css";

const CrudApp = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ id: null, name: "" });

  const apiUrl = "https://jsonplaceholder.typicode.com/users"; // API externa de ejemplo

  // Obtener datos
  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Crear o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.id) {
      // Actualizar
      try {
        const response = await fetch(`${apiUrl}/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (response.ok) {
          const updatedData = data.map((item) =>
            item.id === form.id ? form : item
          );
          setData(updatedData);
          setForm({ id: null, name: "" });
        }
      } catch (error) {
        console.error("Error updating data:", error);
      }
    } else {
      // Crear
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (response.ok) {
          const newItem = await response.json();
          setData([...data, newItem]);
          setForm({ id: null, name: "" });
        }
      } catch (error) {
        console.error("Error creating data:", error);
      }
    }
  };

  // Eliminar
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setData(data.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="crud-container">
      <h2>Gestión de Usuarios</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />
        <button type="submit">{form.id ? "Actualizar" : "Crear"}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>
                <button onClick={() => setForm(item)}>Editar</button>
                <button onClick={() => handleDelete(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrudApp;
