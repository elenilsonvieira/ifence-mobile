import { useState, useEffect } from 'react';
import api, { authApi, initAuthTokenFromStorage } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Pulseira {
  id: number;
  nome: string;
  identificador?: string;
  cercas?: { id: number; nome: string }[]; // vínculo(s) de cerca retornados pelo backend
}

function toLocal(b: any): Pulseira {
  return {
    id: Number(b.id ?? b.braceletId ?? b.identifierId ?? 0),
    nome: b.name ?? b.nome ?? b.childName ?? '',
    identificador: b.identificador ?? b.identifier ?? b.deviceIdentifier ?? b.deviceId ?? undefined,
    cercas: (() => {
      const raw = Array.isArray(b.fences) ? b.fences : (Array.isArray(b.cercas) ? b.cercas : (Array.isArray(b.fenceList) ? b.fenceList : []));
      return raw
        .map((f: any) => ({ id: Number(f?.id ?? f), nome: f?.name ?? f?.nome ?? '' }))
        .filter((f: any) => !Number.isNaN(f.id));
    })(),
  };
}

function toServer(p: Omit<Pulseira, 'id'> | Partial<Pulseira>) {
  const payload: any = { name: p.nome };
  if (p.identificador !== undefined) payload.identifier = p.identificador;
  return payload;
}

export const usePulseiras = () => {
  const [pulseiras, setPulseiras] = useState<Pulseira[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPulseiras = async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await api.get('/bracelets', { params: { page: 0, size: 50 } });
      } catch (err: any) {
        if (err?.response?.status === 404) {
          res = await authApi.get('/bracelets', { params: { page: 0, size: 50 } });
        } else {
          throw err;
        }
      }
      const payload: any = res.data;
      const content: any[] = Array.isArray(payload) ? payload : payload?.content ?? [];
      const list = content.map(toLocal);
      setPulseiras(list);
    } catch (err) {
      console.error('Erro ao buscar pulseiras:', err);
    }
    setLoading(false);
  };

  const addPulseira = async (novaPulseira: Omit<Pulseira, 'id'>): Promise<Pulseira | null> => {
    try {
      let res;
      try {
        res = await api.post('/bracelets', toServer(novaPulseira));
      } catch (err: any) {
        if (err?.response?.status === 404) {
          res = await authApi.post('/bracelets', toServer(novaPulseira));
        } else {
          throw err;
        }
      }
      await fetchPulseiras();
      return res?.data ? toLocal(res.data) : null;
    } catch (err) {
      console.error('Erro ao adicionar pulseira:', err);
      return null;
    }
  };

  const updatePulseira = async (id: number, dadosAtualizados: Partial<Pulseira>) => {
    try {
      try {
        await api.put(`/bracelets/${id}`, toServer(dadosAtualizados));
      } catch (err: any) {
        if (err?.response?.status === 404) {
          await authApi.put(`/bracelets/${id}`, toServer(dadosAtualizados));
        } else {
          throw err;
        }
      }
      await fetchPulseiras();
    } catch (err) {
      console.error('Erro ao atualizar pulseira:', err);
    }
  };

  const deletePulseira = async (id: number) => {
    try {
      // Garante que o token esteja carregado em memória (mitiga 401 após hot reload)
      await initAuthTokenFromStorage();
      // 0) Tenta desvincular de todas as cercas conhecidas antes de excluir
      try {
        const alvo = pulseiras.find(p => p.id === id);
        let cercasVinculadas = alvo?.cercas ?? [];
        if ((!cercasVinculadas || cercasVinculadas.length === 0)) {
          // Buscar detalhes caso a lista resumida não tenha cercas
          try {
            let resDet;
            try {
              resDet = await api.get(`/bracelets/${id}`);
            } catch (errDet: any) {
              if (errDet?.response?.status === 404) {
                resDet = await authApi.get(`/bracelets/${id}`);
              } else {
                throw errDet;
              }
            }
            const det = toLocal(resDet?.data ?? {});
            cercasVinculadas = det.cercas ?? [];
          } catch {}
        }
        for (const c of cercasVinculadas) {
          try {
            await api.delete(`/fences/removeBracelet`, { params: { fence: Number(c.id), bracelet: id } });
          } catch (eUn: any) {
            if (eUn?.response?.status === 404) {
              await authApi.delete(`/fences/removeBracelet`, { params: { fence: Number(c.id), bracelet: id } });
            }
          }
        }
      } catch {}
      try {
        await api.delete(`/bracelets/${id}`);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404 || status === 401) {
          // tenta endpoint sem prefixo /api
          await authApi.delete(`/bracelets/${id}`);
        } else {
          const detail = err?.response?.data;
          if (detail && typeof detail === 'string' && /fence|cerca/i.test(detail)) {
            alert('Não foi possível excluir: a pulseira está vinculada a uma ou mais cercas.');
          }
          throw err;
        }
      }
      await fetchPulseiras();
    } catch (err) {
      const status = (err as any)?.response?.status;
      if (status === 401) {
        const token = await AsyncStorage.getItem('authToken');
        alert(token
          ? 'Não foi possível excluir (401). Verifique suas permissões ou tente novamente mais tarde.'
          : 'Sua sessão expirou. Faça login novamente e tente excluir de novo.'
        );
      } else if (status === 403) {
        alert('Você não tem permissão para excluir esta pulseira.');
      } else {
        console.error('Erro ao deletar pulseira:', err);
      }
    }
  };

  useEffect(() => {
    fetchPulseiras();
  }, []);

  const refresh = () => fetchPulseiras();

  return { pulseiras, loading, addPulseira, updatePulseira, deletePulseira, refresh };
};
