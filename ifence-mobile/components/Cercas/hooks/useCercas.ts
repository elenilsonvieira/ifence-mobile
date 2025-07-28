import { useState, useEffect } from 'react';
import { showToast } from '@/utils/toastUtils';
import { obterCercas, salvarCerca, removerCercaStorage } from '@/storage/cercaStorage';

export interface Cerca {
  id: string | number;
  nome: string;
  latitude: string;
  longitude: string;
  raio: string;
  horarioInicio: string;
  horarioFim: string;
}

export const useCercas = () => {
  const [cercas, setCercas] = useState<Cerca[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  const fetchCercas = async () => {
    setLoading(true);
    try {
      const lista = await obterCercas();
      setCercas(lista);
    } catch (err) {
      console.error('Erro ao buscar cercas:', err);
    }
    setLoading(false);
  };


  const addCerca = async (novaCerca: Omit<Cerca, 'id'>) => {
    try {
      const raioNum = typeof novaCerca.raio === 'string' ? Number(novaCerca.raio) : novaCerca.raio;
      if (isNaN(raioNum) || raioNum <= 0) {
        throw new Error('O raio deve ser um número positivo.');
      }
      await salvarCerca({
        ...novaCerca,
        raio: raioNum,
      });
      await fetchCercas();
      showToast('success', 'Sucesso', 'Cerca cadastrada com sucesso!');
    } catch (err) {
      console.error('Erro ao adicionar cerca:', err);
      alert(err instanceof Error ? err.message : 'Erro ao adicionar cerca.');
    }
  };


  const updateCerca = async (id: number | string, dadosAtualizados: Partial<Cerca>) => {
    try {
      // Buscar a cerca atual para manter o valor de raio se não for informado
      const cercaAtual = cercas.find((c) => String(c.id) === String(id));
      if (!cercaAtual) throw new Error('Cerca não encontrada para atualização');
      const raioNum = dadosAtualizados.raio !== undefined ? Number(dadosAtualizados.raio) : Number(cercaAtual.raio);
      if (isNaN(raioNum) || raioNum <= 0) {
        throw new Error('O raio deve ser um número positivo.');
      }
      await salvarCerca({
        id: String(id),
        nome: dadosAtualizados.nome ?? cercaAtual.nome,
        latitude: dadosAtualizados.latitude ?? cercaAtual.latitude,
        longitude: dadosAtualizados.longitude ?? cercaAtual.longitude,
        raio: raioNum,
        horarioInicio: dadosAtualizados.horarioInicio ?? cercaAtual.horarioInicio,
        horarioFim: dadosAtualizados.horarioFim ?? cercaAtual.horarioFim,
      });
      await fetchCercas();
      showToast('success', 'Sucesso', 'Cerca editada com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar cerca:', err);
      alert(err instanceof Error ? err.message : 'Erro ao atualizar cerca.');
    }
  };

  const deleteCerca = async (id: number | string) => {
    try {
      await removerCercaStorage(String(id));
      await fetchCercas();
      showToast('success', 'Sucesso', 'Cerca excluída com sucesso!');
    } catch (err) {
      console.error('Erro ao deletar cerca:', err);
    }
  };

  useEffect(() => {
    fetchCercas();
  }, []);

  return { cercas, loading, addCerca, updateCerca, deleteCerca };
};
