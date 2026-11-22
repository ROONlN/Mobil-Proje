import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PodcastCard } from '../components/PodcastCard';
import { colors } from '../constants/theme';
import { useFavorites } from '../context/FavoritesContext';
import { Podcast, RootStackParamList, SortOrder } from '../types';

const API_URL = 'https://itunes.apple.com/search?limit=25&term=technology&entity=podcast';

type ApiResponse = { resultCount: number; results: Podcast[] };
type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function PodcastListScreen() {
  const navigation = useNavigation<Navigation>();
  const { isFavorite } = useFavorites();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Tümü');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPodcasts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Sunucu hatası: ${response.status}`);
      const data = (await response.json()) as ApiResponse;
      setPodcasts(data.results.filter((item) => item.collectionId && item.collectionName));
    } catch (requestError) {
      console.warn(requestError);
      setError('Podcast’ler yüklenemedi. İnternet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPodcasts();
  }, [fetchPodcasts]);

  const genres = useMemo(
    () => [
      'Tümü',
      ...Array.from(new Set(podcasts.map((item) => item.primaryGenreName).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b, 'tr'),
      ),
    ],
    [podcasts],
  );

  const visiblePodcasts = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase('tr-TR');
    return podcasts
      .filter((item) => selectedGenre === 'Tümü' || item.primaryGenreName === selectedGenre)
      .filter((item) =>
        `${item.collectionName} ${item.artistName}`.toLocaleLowerCase('tr-TR').includes(needle),
      )
      .sort((left, right) => {
        const comparison = left.collectionName.localeCompare(right.collectionName, 'tr');
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [podcasts, search, selectedGenre, sortOrder]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.statusText}>Teknoloji podcast’leri yükleniyor…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons color={colors.danger} name="cloud-offline-outline" size={52} />
        <Text style={styles.errorTitle}>Bağlantı kurulamadı</Text>
        <Text style={styles.statusText}>{error}</Text>
        <Pressable onPress={() => void fetchPodcasts()} style={styles.retryButton}>
          <Text style={styles.retryText}>Tekrar dene</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={visiblePodcasts}
        keyExtractor={(item) => String(item.collectionId)}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons color={colors.muted} name="search-outline" size={44} />
            <Text style={styles.emptyTitle}>Sonuç bulunamadı</Text>
            <Text style={styles.statusText}>Aramanızı veya tür seçiminizi değiştirin.</Text>
          </View>
        }
        ListHeaderComponent={
          <View>
            <View style={styles.hero}>
              <View style={styles.heroIcon}>
                <Ionicons color="#FFFFFF" name="radio" size={30} />
              </View>
              <View style={styles.heroText}>
                <Text style={styles.eyebrow}>G231210046 · K27-c</Text>
                <Text style={styles.heroTitle}>Teknolojinin sesini keşfet</Text>
                <Text style={styles.heroSubtitle}>iTunes Search üzerinden 25 güncel podcast</Text>
              </View>
            </View>

            <View style={styles.searchBox}>
              <Ionicons color={colors.muted} name="search" size={20} />
              <TextInput
                autoCapitalize="none"
                onChangeText={setSearch}
                placeholder="Podcast veya yayıncı ara"
                placeholderTextColor={colors.muted}
                style={styles.input}
                value={search}
              />
              {!!search && (
                <Pressable accessibilityLabel="Aramayı temizle" onPress={() => setSearch('')}>
                  <Ionicons color={colors.muted} name="close-circle" size={21} />
                </Pressable>
              )}
            </View>

            <ScrollView
              contentContainerStyle={styles.chips}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {genres.map((genre) => {
                const selected = genre === selectedGenre;
                return (
                  <Pressable
                    key={genre}
                    onPress={() => setSelectedGenre(genre)}
                    style={[styles.chip, selected && styles.selectedChip]}
                  >
                    <Text style={[styles.chipText, selected && styles.selectedChipText]}>{genre}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.resultRow}>
              <Text style={styles.resultCount}>{visiblePodcasts.length} podcast</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))}
                style={styles.sortButton}
              >
                <Ionicons color={colors.primary} name="swap-vertical" size={17} />
                <Text style={styles.sortText}>{sortOrder === 'asc' ? 'A → Z' : 'Z → A'}</Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <PodcastCard
            onPress={() => navigation.navigate('Detay', { podcast: item })}
            podcast={item}
            saved={isFavorite(item.collectionId)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  listContent: { paddingBottom: 24, paddingHorizontal: 18 },
  center: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  statusText: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 12, textAlign: 'center' },
  errorTitle: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 14 },
  retryButton: { backgroundColor: colors.primary, borderRadius: 13, marginTop: 20, paddingHorizontal: 22, paddingVertical: 12 },
  retryText: { color: '#FFFFFF', fontWeight: '800' },
  hero: {
    backgroundColor: colors.primaryDark,
    borderRadius: 24,
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 10,
    overflow: 'hidden',
    padding: 18,
  },
  heroIcon: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 17, height: 58, justifyContent: 'center', width: 58 },
  heroText: { flex: 1, marginLeft: 14 },
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: '800', letterSpacing: 0.7 },
  heroTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', lineHeight: 25, marginTop: 3 },
  heroSubtitle: { color: '#BFC9E7', fontSize: 12, marginTop: 5 },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 14,
  },
  input: { color: colors.text, flex: 1, fontSize: 15, paddingHorizontal: 10, paddingVertical: 14 },
  chips: { gap: 8, paddingVertical: 13 },
  chip: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 8 },
  selectedChip: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  selectedChipText: { color: '#FFFFFF' },
  resultRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  resultCount: { color: colors.text, fontSize: 14, fontWeight: '800' },
  sortButton: { alignItems: 'center', backgroundColor: colors.chip, borderRadius: 12, flexDirection: 'row', gap: 5, paddingHorizontal: 12, paddingVertical: 8 },
  sortText: { color: colors.primary, fontSize: 12, fontWeight: '900' },
  empty: { alignItems: 'center', paddingTop: 62 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 10 },
});
