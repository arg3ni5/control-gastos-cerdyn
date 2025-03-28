import { useEffect } from "react";
import styled from "styled-components";
import { Header, useUsuariosStore, useConexionesStore } from "../../index";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export function ConexionesTemplate() {
  const { datausuarios } = useUsuariosStore();
  const { mostrarConexiones, conexiones, eliminarConexion } = useConexionesStore();
  const navigate = useNavigate();

  const { isLoading, error } = useQuery({
    queryKey: ["mostrar conexiones", datausuarios?.id],
    queryFn: () => mostrarConexiones({ usuario_id: datausuarios.id }),
    enabled: !!datausuarios?.id,
  });

  const confirmarEliminacion = async (conexion) => {
    const result = await Swal.fire({
      title: "¿Eliminar esta conexión?",
      text: `@${conexion.canal_username || "sin username"} (${conexion.canal})`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await eliminarConexion({ id: conexion.id });
        Swal.fire("✅ Eliminado", "Conexión eliminada correctamente", "success");
      } catch (err) {
        Swal.fire("❌ Error", "No se pudo eliminar la conexión", "error");
      }
    }
  };

  return (
    <Container>
      <header className="header">
        <Header stateConfig={{ state: false, setState: () => {} }} />
      </header>
      <section className="main">
        <h2>Cuentas vinculadas</h2>

        {isLoading && <p>🔄 Cargando vinculaciones...</p>}
        {error && <p>❌ Error al cargar vinculaciones</p>}

        {conexiones?.length > 0 ? (
          <ListaCuentas>
            <ul>
              {conexiones.map((conexion) => (
                <li key={conexion.id}>
                  <span className="icono">🔗</span>
                  <strong>{conexion.canal}</strong> – @{conexion.canal_username || "sin username"} (ID: {conexion.canal_user_id})
                  <button className="btn-eliminar" onClick={() => confirmarEliminacion(conexion)} title="Eliminar">
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          </ListaCuentas>
        ) : (
          !isLoading && <p>No tenés cuentas vinculadas todavía.</p>
        )}
      </section>
    </Container>
  );
}


const Container = styled.div`
  min-height: 100vh;
  padding: 15px;
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" 100px
    "main" auto;

  .header {
    grid-area: header;
    display: flex;
    align-items: center;
  }

  .main {
    grid-area: main;
    padding-top: 2rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const ListaCuentas = styled.div`
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.04);
    padding: 0.5rem 1rem;
    border-radius: 8px;
  }

  .icono {
    font-size: 1.3rem;
  }

  .btn-eliminar {
    margin-left: auto;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    color: tomato;

    &:hover {
      color: red;
    }
  }
`;
