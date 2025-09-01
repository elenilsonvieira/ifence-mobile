import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getFeedbacks, removeFeedback, clearFeedbacks, Feedback, getPendingFeedbacks, markFeedbackAsSynced } from '../../storage/feedbackStorage';
import { getHiddenIds, hideFeedback, hideMany } from '../../storage/feedbackHiddenStorage';
import api from '../../utils/api';
import { spacing, moderateScale } from '../../utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const Item: React.FC<{ item: Feedback; onDelete: (id: string) => void }> = ({ item, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.msg}>{item.mensagem}</Text>
        <View style={styles.rightCol}>
          {item.pendente ? (
            <View style={styles.pendingRow}>
              <ActivityIndicator size="small" color="#0EA5E9" />
              <Text style={styles.pendingText}>Processando</Text>
            </View>
          ) : (
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
          )}
          <TouchableOpacity onPress={() => onDelete(item.id)} accessibilityLabel="Excluir feedback" style={{ marginTop: 4 }}>
            <Ionicons name="trash-outline" size={20} color="#B00020" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.meta}>
        {item.nome ? `${item.nome} • ` : ''}
        {item.contato ? `${item.contato} • ` : ''}
        {new Date(item.criadoEm).toLocaleString()}
      </Text>
    </View>
  );
};

const FeedbacksScreen: React.FC = () => {
  const [lista, setLista] = useState<Feedback[]>([]);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState<'todas' | 'critica' | 'recomendacoes'>('todas');
  const processingRef = useRef<Set<string>>(new Set());

  const migrarCacheParaBackend = useCallback(async () => {
    // Tenta enviar apenas os pendentes cujo agendamento já venceu (scheduledAt <= agora)
    let houveMudanca = false;
    try {
      const locais = await getPendingFeedbacks();
      const agora = Date.now();
      const candidatos = locais.filter((f) => !f.scheduledAt || new Date(f.scheduledAt).getTime() <= agora);
      if (!candidatos.length) return false;

      for (const f of candidatos) {
        if (processingRef.current.has(f.id)) continue; // evita enviar duplicado
        processingRef.current.add(f.id);
        try {
          const resp = await api.post('/feedbacks', {
            name: f.nome,
            contact: f.contato,
            message: f.mensagem,
            messageCategory: f.categoria,
          });
          const serverId = String((resp as any)?.data?.id ?? '');
          await markFeedbackAsSynced(f.id, serverId || undefined);
          houveMudanca = true;
        } catch {
          // mantém no cache para próxima tentativa
        } finally {
          processingRef.current.delete(f.id);
        }
      }
    } catch {}
    return houveMudanca;
  }, []);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      // 1) Primeiro tenta migrar itens locais pendentes para o backend (quando online)
      await migrarCacheParaBackend();

      // 2) Tenta carregar do backend
      const { data } = await api.get('/feedbacks', {
        params: { page: 0, size: 200, sort: 'createdAt,desc' },
      });
      const content = Array.isArray((data as any)?.content) ? (data as any).content : [];
      const mapped: Feedback[] = content.map((r: any) => ({
        id: String(r.id),
        nome: r.name || undefined,
        contato: r.contact || undefined,
        mensagem: r.message,
        criadoEm: r.createdAt,
        categoria: r.messageCategory === 'critica' || r.messageCategory === 'recomendacoes' ? r.messageCategory : undefined,
      }));
      // acrescenta itens locais pendentes para aparecerem com status "Processando"
      const locais = await getFeedbacks();
      const pendentesLocais = locais.filter((f) => f.pendente);
      const currentHidden = await getHiddenIds();
      setHiddenIds(currentHidden);
      const combinada = [...pendentesLocais, ...mapped]
        .filter((f) => !currentHidden.includes(String(f.id)))
        .sort((a, b) => (a.criadoEm < b.criadoEm ? 1 : -1));
      setLista(combinada);
    } catch {
      // 3) Fallback: carrega do cache local
      const dados = await getFeedbacks();
      const currentHidden = await getHiddenIds();
      setHiddenIds(currentHidden);
      setLista(
        dados
          .filter((f) => !currentHidden.includes(String(f.id)))
          .sort((a, b) => (a.criadoEm < b.criadoEm ? 1 : -1))
      );
    } finally {
      setLoading(false);
    }
  }, [migrarCacheParaBackend]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Recarrega sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  // Loop leve que dispara a sincronização assim que o agendamento vencer
  useEffect(() => {
    const id = setInterval(async () => {
      const mudou = await migrarCacheParaBackend();
      if (mudou) {
        // Recarrega para refletir o novo estado (pendente -> sincronizado)
        carregar();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [migrarCacheParaBackend, carregar]);

  const onDelete = async (id: string) => {
    // Tenta excluir no backend primeiro
    try {
      await api.delete(`/feedbacks/${id}`);
    } catch {
      // Se falhar (offline/5xx), marca como oculto para não reaparecer
      await hideFeedback(id);
      setHiddenIds((prev) => Array.from(new Set([...prev, String(id)])));
    }
    // Remove local e atualiza a lista
    await removeFeedback(id);
    setLista((prev) => prev.filter((f) => String(f.id) !== String(id)));
  };

  const onClearAll = async () => {
    Alert.alert('Limpar tudo?', 'Isto removerá todos os feedbacks salvos neste dispositivo.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          // Esconde IDs atuais da lista (inclusive vindos do backend) para não reaparecerem
          await hideMany(lista.map((f) => String(f.id)));
          await clearFeedbacks();
          setHiddenIds((prev) => Array.from(new Set([...prev, ...lista.map((f) => String(f.id))])));
          setLista([]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Feedbacks</Text>
        <View style={styles.headerActions}>
          <View style={styles.filterBox}>
            <Picker
              selectedValue={filtro}
              onValueChange={(v) => setFiltro(v)}
              dropdownIconColor="#FFFFFF"
              style={{ color: '#FFFFFF', width: 170 }}
            >
              <Picker.Item label="todas" value="todas" />
              <Picker.Item label="críticas" value="critica" />
              <Picker.Item label="recomendações" value="recomendacoes" />
            </Picker>
          </View>
          {lista.length > 0 && (
            <TouchableOpacity onPress={onClearAll}>
              <Ionicons name="trash-bin-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {lista.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="chatbubble-ellipses-outline" size={48} color="#A7B4D0" />
          <Text style={styles.emptyText}>Nenhum feedback salvo ainda.</Text>
        </View>
      ) : (
        <FlatList
          data={lista.filter((f) => (filtro === 'todas' ? true : f.categoria === filtro)).filter((f) => !hiddenIds.includes(String(f.id)))}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Item item={item} onDelete={onDelete} />}
          contentContainerStyle={{ padding: spacing(2) }}
          ItemSeparatorComponent={() => <View style={{ height: spacing(1) }} />}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#003F88',
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  filterBox: {
    borderWidth: 1,
    borderColor: '#4C74B8',
    borderRadius: 6,
    overflow: 'hidden',
  },
  title: {
    color: '#FFFFFF',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: spacing(1.5),
    borderWidth: 1,
    borderColor: '#E3E8F0',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing(1),
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  msg: {
    flex: 1,
    color: '#0F172A',
    fontSize: moderateScale(15),
  },
  meta: {
    marginTop: spacing(0.5),
    color: '#64748B',
    fontSize: moderateScale(12),
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pendingText: {
    color: '#0EA5E9',
    fontSize: moderateScale(12),
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing(1),
  },
  emptyText: {
    color: '#64748B',
  },
});

export default FeedbacksScreen;
