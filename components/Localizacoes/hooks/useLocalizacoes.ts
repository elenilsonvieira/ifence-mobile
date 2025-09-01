import { useCallback } from 'react';
import api, { authApi } from '@/utils/api';

export type Localizacao = {
  latitude: number;
  longitude: number;
  timestamp: string; // ISO
};

type FetchParams = {
  pulseiraId: number | string;
  cercaId?: number | string;
  limit?: number;
  from?: string; // ISO
  to?: string; // ISO
};

export const useLocalizacoes = () => {
  const mapArray = (data: any): Localizacao[] => {
    const content: any[] = Array.isArray(data)
      ? data
      : (Array.isArray(data?.content)
        ? data.content
        : (Array.isArray(data?.items)
          ? data.items
          : []));
    return content
      .map((x) => ({
        latitude: Number(x.latitude ?? x.lat ?? x.y ?? 0),
        longitude: Number(x.longitude ?? x.lon ?? x.x ?? 0),
        timestamp: String(
          x.timestamp
          ?? x.time
          ?? x.createdAt
          ?? x.created_at
          ?? x.dateTime
          ?? new Date().toISOString()
        ),
      }))
      .filter((l) => !Number.isNaN(l.latitude) && !Number.isNaN(l.longitude));
  };

  const fetchLocations = useCallback(async ({ pulseiraId, cercaId, limit, from, to }: FetchParams): Promise<Localizacao[]> => {
    try {
      let res;
      const paramsA = { braceletId: pulseiraId, fenceId: cercaId, limit, from, to };
      const paramsB = { bracelet: pulseiraId, fence: cercaId, limit, from, to };
      // /api > /root; /search > base; paramsA > paramsB
      try {
        res = await api.get('/locations/search', { params: paramsA });
      } catch (e1: any) {
        try {
          res = await api.get('/locations/search', { params: paramsB });
        } catch (e2: any) {
          try {
            res = await api.get('/locations', { params: paramsA });
          } catch (e3: any) {
            try {
              res = await api.get('/locations', { params: paramsB });
            } catch (err: any) {
              if (err?.response?.status === 404) {
                try {
                  res = await authApi.get('/locations/search', { params: paramsA });
                } catch (e4: any) {
                  try {
                    res = await authApi.get('/locations/search', { params: paramsB });
                  } catch (e5: any) {
                    try {
                      res = await authApi.get('/locations', { params: paramsA });
                    } catch (e6: any) {
                      res = await authApi.get('/locations', { params: paramsB });
                    }
                  }
                }
              } else {
                throw err;
              }
            }
          }
        }
      }
      return mapArray(res.data);
    } catch (e) {
      console.warn('Falha ao buscar localizações no backend:', e);
      return [];
    }
  }, []);

  const saveLocation = useCallback(async (data: { pulseiraId: number | string; cercaId?: number | string; latitude: number; longitude: number; timestamp: string; }): Promise<boolean> => {
    const payload = {
      braceletId: data.pulseiraId,
      fenceId: data.cercaId ?? null,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: data.timestamp,
    };
    try {
      try {
        await api.post('/locations', payload);
      } catch (err: any) {
        if (err?.response?.status === 404 || err?.response?.status === 405) {
          // tenta raiz
          await authApi.post('/locations', payload);
        } else {
          throw err;
        }
      }
      return true;
    } catch (e) {
      console.warn('Falha ao salvar localização no backend:', e);
      return false;
    }
  }, []);

  return { fetchLocations, saveLocation };
};
