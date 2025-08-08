import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Pulseira {
  id: number;
  nome: string;
  identificador: string;
}

export const usePulseiras = () => {
  const [pulseiras, setPulseiras] = useState<Pulseira[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPulseiras = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Pulseira[]>('/api/pulseiras');
      setPulseiras(res.data as Pulseira[]);
    } catch (err) {
      console.error('Erro ao buscar pulseiras:', err);
    }
    setLoading(false);
  };

  const addPulseira = async (novaPulseira: Omit<Pulseira, 'id'>) => {
    try {
      const res = await axios.post<Pulseira>('/api/pulseiras', novaPulseira);
      setPulseiras((prev) => [...prev, res.data as Pulseira]);
    } catch (err) {
      console.error('Erro ao adicionar pulseira:', err);
    }
  };

  const updatePulseira = async (id: number, dadosAtualizados: Partial<Pulseira>) => {
    try {
      const res = await axios.put<Pulseira>(`/api/pulseiras/${id}`, dadosAtualizados);
      setPulseiras((prev) => prev.map((pulseira) => (pulseira.id === id ? (res.data as Pulseira) : pulseira)));
    } catch (err) {
      console.error('Erro ao atualizar pulseira:', err);
    }
  };

  const deletePulseira = async (id: number) => {
    try {
      await axios.delete(`/api/pulseiras/${id}`);
      setPulseiras((prev) => prev.filter((pulseira) => pulseira.id !== id));
    } catch (err) {
      console.error('Erro ao deletar pulseira:', err);
    }
  };

  useEffect(() => {
    fetchPulseiras();
  }, []);

  return { pulseiras, loading, addPulseira, updatePulseira, deletePulseira };
};
