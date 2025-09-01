import { useState, useEffect } from 'react';
import { obterCercas, salvarCerca, removerCercaStorage, type Cerca as StorageCerca } from '@/storage/cercaStorage';
import api from '@/utils/api';

export type Cerca = StorageCerca;

export const useCercas = () => {
  const [cercas, setCercas] = useState<Cerca[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Tipos mínimos do backend (DTO) para mapear ao tipo local
  type FenceResponse = {
    id: number | string;
    name?: string;
    coordinate?: { latitude?: number | string; longitude?: number | string } | null;
    radius?: number | string | null;
    startTime?: string | null;
    finishTime?: string | null;
  };

  const toLocal = (f: FenceResponse): Cerca => ({
    id: String(f.id),
    nome: f.name ?? '',
    latitude:
      f.coordinate?.latitude !== undefined && f.coordinate?.latitude !== null
        ? String(f.coordinate.latitude)
        : '',
    longitude:
      f.coordinate?.longitude !== undefined && f.coordinate?.longitude !== null
        ? String(f.coordinate.longitude)
        : '',
    raio: f.radius == null ? 0 : Number(f.radius),
    horarioInicio: f.startTime ?? '',
    horarioFim: f.finishTime ?? '',
    pulseiraId: null,
  });

  const fetchCercas = async () => {
    setLoading(true);
    try {
      // Buscar do backend: GET /api/fences retorna Page<FenceResponse>
  const { data } = await api.get('/fences', { params: { page: 0, size: 50 } });
  const payload: any = data as any;
  const content: FenceResponse[] = Array.isArray(payload) ? payload : payload?.content ?? [];
      const lista = content.map(toLocal);
      setCercas(lista);
      // Sincronizar storage como cache offline leve
      try {
        for (const c of lista) await salvarCerca(c);
      } catch {}
    } catch (err) {
      console.warn('Falha ao buscar cercas no backend, usando cache local:', err);
      const lista = await obterCercas();
      setCercas(lista);
    }
    setLoading(false);
  };


  const addCerca = async (
    novaCerca: {
      nome: string;
      latitude: string;
      longitude: string;
      raio: number | string;
      horarioInicio: string;
      horarioFim: string;
    }
  ) => {
    try {
      const raioNum = typeof novaCerca.raio === 'string' ? Number(novaCerca.raio) : novaCerca.raio;
      if (isNaN(raioNum) || raioNum <= 0) {
        throw new Error('O raio deve ser um número positivo.');
      }
      // 1) Tenta criar no backend primeiro
      try {
        const { data } = await api.post('/fences', {
          name: novaCerca.nome,
          coordinate: { latitude: Number(novaCerca.latitude), longitude: Number(novaCerca.longitude) },
          startTime: novaCerca.horarioInicio || null,
          finishTime: novaCerca.horarioFim || null,
          radius: raioNum,
        });
        // Atualiza lista a partir do backend
        await fetchCercas();
        return data;
      } catch (e) {
        // 2) Fallback: persistir localmente
        const salvo = await salvarCerca({
          ...novaCerca,
          raio: raioNum,
        });
        await fetchCercas();
        return salvo;
      }
    } catch (err) {
      console.error('Erro ao adicionar cerca:', err);
      alert(err instanceof Error ? err.message : 'Erro ao adicionar cerca.');
    }
  };


  const updateCerca = async (
    id: string | number,
    dadosAtualizados: Partial<Omit<Cerca, 'raio'>> & { raio?: number | string }
  ) => {
    try {
      const cercaAtual = cercas.find((c) => String(c.id) === String(id));
      if (!cercaAtual) throw new Error('Cerca não encontrada para atualização');
      const raioNum = dadosAtualizados.raio !== undefined ? Number(dadosAtualizados.raio) : Number(cercaAtual.raio);
      if (isNaN(raioNum) || raioNum <= 0) {
        throw new Error('O raio deve ser um número positivo.');
      }

      const atualizada: Cerca = {
        id: String(id),
        nome: dadosAtualizados.nome ?? cercaAtual.nome,
        latitude: dadosAtualizados.latitude ?? cercaAtual.latitude,
        longitude: dadosAtualizados.longitude ?? cercaAtual.longitude,
        raio: raioNum,
        horarioInicio: dadosAtualizados.horarioInicio ?? cercaAtual.horarioInicio,
        horarioFim: dadosAtualizados.horarioFim ?? cercaAtual.horarioFim,
        pulseiraId: cercaAtual.pulseiraId ?? null,
      };
      // 1) Tenta atualizar tudo no backend
      try {
        await api.put(`/fences/${id}`,
          {
            name: atualizada.nome,
            coordinate: { latitude: Number(atualizada.latitude), longitude: Number(atualizada.longitude) },
            radius: raioNum,
            startTime: atualizada.horarioInicio || null,
            finishTime: atualizada.horarioFim || null,
          }
        );
      } catch (e) {
        // 2) Se falhar, tenta ao menos atualizar as coordenadas
        const mudouCoord =
          Number(atualizada.latitude) !== Number(cercaAtual.latitude) ||
          Number(atualizada.longitude) !== Number(cercaAtual.longitude);
        if (mudouCoord) {
          try {
            await api.put(`/fences/${id}/coordinates`, {
              latitude: Number(atualizada.latitude),
              longitude: Number(atualizada.longitude),
            });
          } catch {}
        }
        // 3) Fallback: salvar no storage
        await salvarCerca(atualizada);
      }

      await fetchCercas();
    } catch (err) {
      console.error('Erro ao atualizar cerca:', err);
      alert(err instanceof Error ? err.message : 'Erro ao atualizar cerca.');
    }
  };

  const deleteCerca = async (id: string | number) => {
    try {
      // 1) Tentar remover do backend
      try {
        await api.delete(`/fences/${id}`);
      } catch {}
      // 2) Remover do storage (mantém cache limpo)
      try { await removerCercaStorage(String(id)); } catch {}
      await fetchCercas();
    } catch (err) {
      console.error('Erro ao deletar cerca:', err);
    }
  };

  useEffect(() => {
    fetchCercas();
  }, []);

  return { cercas, loading, addCerca, updateCerca, deleteCerca };
};
