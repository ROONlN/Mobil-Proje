import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PodcastCard } from '../components/PodcastCard';
import { colors } from '../constants/theme';
import { useFavorites } from '../context/FavoritesContext';
import { RootStackParamList } from '../types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function SavedScreen() {
  const navigation = useNavigation<Navigation>();
  const { favorites, hydrated } = useFavorites();

  if (!hydrated) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={[styles.content, favorites.length === 0 && styles.emptyContent]}
        data={favorites}
        keyExtractor={(item) => String(item.collectionId)}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons color={colors.primary} name="bookmark-outline" size={46} />
            </View>
            <Text style={styles.emptyTitle}>Henüz kayıt yok</Text>
            <Text style={styles.emptyText}>Beğendiğiniz podcast’i ayrıntı ekranından kaydedebilirsiniz.</Text>
          </View>
        }
        ListHeaderComponent={
          favorites.length > 0 ? (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Dinleme listeniz</Text>
              <Text style={styles.headerText}>{favorites.length} podcast kalıcı olarak saklanıyor.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <PodcastCard
            onPress={() => navigation.navigate('Detay', { podcast: item })}
            podcast={item}
            saved
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  center: { alignItems: 'center', backgroundColor: colors.background, flex: 1, justifyContent: 'center' },
  content: { padding: 18, paddingBottom: 28 },
  emptyContent: { flexGrow: 1 },
  header: { marginBottom: 17, marginTop: 4 },
  headerTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  headerText: { color: colors.muted, fontSize: 13, marginTop: 5 },
  empty: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  emptyIcon: { alignItems: 'center', backgroundColor: colors.chip, borderRadius: 37, height: 74, justifyContent: 'center', width: 74 },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: 17 },
  emptyText: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: 'center' },
});
