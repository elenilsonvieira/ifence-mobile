import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Cerca {
  id: number;
  nome: string;
  coordenadas: string;
}

export const useCercas = () => {
  const [cercas, setCercas] = useState<Cerca[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  const fetchCercas = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Cerca[]>('/api/cercas');
      setCercas(res.data as Cerca[]);
    } catch (err) {
      console.error('Erro ao buscar cercas:', err);
    }
    setLoading(false);
  };


  const addCerca = async (novaCerca: Omit<Cerca, 'id'>) => {
    try {
      const res = await axios.post<Cerca>('/api/cercas', novaCerca);
      setCercas((prev) => [...prev, res.data as Cerca]);
    } catch (err) {
      console.error('Erro ao adicionar cerca:', err);
    }
  };


  const updateCerca = async (id: number, dadosAtualizados: Partial<Cerca>) => {
    try {
      const res = await axios.put<Cerca>(`/api/cercas/${id}`, dadosAtualizados);
      setCercas((prev) => prev.map((cerca) => (cerca.id === id ? (res.data as Cerca) : cerca)));
    } catch (err) {
      console.error('Erro ao atualizar cerca:', err);
    }
  };

  const deleteCerca = async (id: number) => {
    try {
      await axios.delete(`/api/cercas/${id}`);
      setCercas((prev) => prev.filter((cerca) => cerca.id !== id));
    } catch (err) {
      console.error('Erro ao deletar cerca:', err);
    }
  };

  useEffect(() => {
    fetchCercas();
  }, []);

  return { cercas, loading, addCerca, updateCerca, deleteCerca };
};
