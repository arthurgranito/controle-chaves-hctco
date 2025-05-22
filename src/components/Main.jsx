import React, { useEffect, useState } from "react";
import Cadastro from "./Cadastro";
import Tabela from "./Tabela";
import axios from "axios";

const Main = () => {
  const [chaves, setChaves] = useState([]);

  const buscarChaves = async () => {
    try {
      const response = await axios.get("http://localhost:8080/registros");
      const registros = response.data.map((chave) => {
        const dataJS = new Date(chave.dataRetirada);
        return {
          id: chave.id,
          chave: chave.chave,
          matricula: chave.matricula,
          dataFormatada: dataJS.toLocaleDateString("pt-BR"),
          horaFormatada: dataJS.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      });
      console.log(registros)
      setChaves(registros)
    } catch (error) {
      console.error("Erro ao buscar registros:", error);
    }
  };

  useEffect(() => {
    buscarChaves();
  }, []);

  return (
    <main className="px-10 py-5 flex gap-4 nav">
      <Cadastro onCadastroSucesso={buscarChaves} />

      <Tabela chaves={chaves} onAtualizarChaves={buscarChaves} />
    </main>
  );
};

export default Main;
