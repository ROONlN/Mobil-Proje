import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Image, Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../constants/theme';
import { useFavorites } from '../context/FavoritesContext';
import { RootStackParamList } from '../types';
import { longDate, relativeDate } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'Detay'>;

export function PodcastDetailScreen({ route }: Props) {
  const { podcast } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(podcast.collectionId);
  const largeArtwork = podcast.artworkUrl100.replace('100x100bb', '600x600bb');

  async function openPodcast() {
    if (!podcast.collectionViewUrl) {
      Alert.alert('Bağlantı bulunamadı', 'Bu podcast için Apple Podcasts bağlantısı yok.');
      return;
    }

    try {
      await Linking.openURL(podcast.collectionViewUrl);
    } catch {
      Alert.alert('Bağlantı açılamadı', 'Apple Podcasts bağlantısı şu anda açılamıyor.');
    }
  }

  async function sharePodcast() {
    const message = [
      `${podcast.collectionName} - ${podcast.artistName}`,
      podcast.collectionViewUrl ?? 'Apple Podcasts bağlantısı bulunamadı.',
    ].join('\n');

    try {
      await Share.share({ message, title: podcast.collectionName });
    } catch {
      Alert.alert('Paylaşım açılamadı', 'Podcast paylaşım menüsü şu anda açılamıyor.');
    }
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.coverPanel}>
          <Image source={{ uri: largeArtwork }} style={styles.artwork} />
          <View style={styles.genreChip}>
            <Text style={styles.genreText}>{podcast.primaryGenreName || 'Podcast'}</Text>
          </View>
        </View>

        <Text style={styles.title}>{podcast.collectionName}</Text>
        <Text style={styles.artist}>{podcast.artistName}</Text>

        <View style={styles.actions}>
          <Pressable
            onPress={() => void toggleFavorite(podcast)}
            style={[styles.actionButton, saved && styles.savedButton]}
          >
            <Ionicons color={saved ? '#FFFFFF' : colors.primary} name={saved ? 'bookmark' : 'bookmark-outline'} size={20} />
            <Text style={[styles.actionText, saved && styles.savedText]}>
              {saved ? 'Kaydedilenlerden çıkar' : 'Kaydet'}
            </Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Podcast'i paylaş"
            onPress={() => void sharePodcast()}
            style={[styles.actionButton, styles.shareButton]}
          >
            <Ionicons color={colors.primary} name="share-social-outline" size={20} />
            <Text style={styles.actionText}>Paylaş</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Podcast bilgileri</Text>
        <View style={styles.infoCard}>
          <InfoRow icon="albums-outline" label="Bölüm sayısı" value={typeof podcast.trackCount === 'number' ? String(podcast.trackCount) : 'Bilinmiyor'} />
          <InfoRow icon="calendar-outline" label="Son bölüm" value={relativeDate(podcast.releaseDate)} />
          <InfoRow icon="time-outline" label="Yayın tarihi" value={longDate(podcast.releaseDate)} />
          <InfoRow icon="pricetag-outline" label="Tür" value={podcast.primaryGenreName || 'Bilinmiyor'} last />
        </View>

        <Pressable onPress={() => void openPodcast()} style={styles.appleButton}>
          <Ionicons color="#FFFFFF" name="logo-apple" size={21} />
          <Text style={styles.appleButtonText}>Apple Podcasts’ta aç</Text>
          <Ionicons color="#FFFFFF" name="open-outline" size={18} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
};

function InfoRow({ icon, label, value, last = false }: InfoRowProps) {
  return (
    <View style={[styles.infoRow, last && styles.lastInfoRow]}>
      <View style={styles.infoLabelGroup}>
        <Ionicons color={colors.primary} name={icon} size={19} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  content: { padding: 20, paddingBottom: 34 },
  coverPanel: { alignItems: 'center', backgroundColor: colors.chip, borderRadius: 28, padding: 24 },
  artwork: { backgroundColor: colors.surface, borderRadius: 26, height: 250, width: 250 },
  genreChip: { backgroundColor: colors.primaryDark, borderRadius: 12, bottom: 12, paddingHorizontal: 13, paddingVertical: 7, position: 'absolute' },
  genreText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  title: { color: colors.text, fontSize: 25, fontWeight: '900', lineHeight: 31, marginTop: 20, textAlign: 'center' },
  artist: { color: colors.muted, fontSize: 15, marginTop: 7, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 19 },
  actionButton: { alignItems: 'center', backgroundColor: colors.chip, borderColor: colors.primary, borderRadius: 15, borderWidth: 1, flex: 1, flexDirection: 'row', gap: 8, justifyContent: 'center', minHeight: 52, paddingHorizontal: 10, paddingVertical: 10 },
  shareButton: { backgroundColor: colors.surface },
  savedButton: { backgroundColor: colors.primary },
  actionText: { color: colors.primary, fontSize: 14, fontWeight: '800' },
  savedText: { color: '#FFFFFF' },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '900', marginBottom: 11, marginTop: 26 },
  infoCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, paddingHorizontal: 16 },
  infoRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 56 },
  lastInfoRow: { borderBottomWidth: 0 },
  infoLabelGroup: { alignItems: 'center', flexDirection: 'row', gap: 9 },
  infoLabel: { color: colors.muted, fontSize: 13 },
  infoValue: { color: colors.text, flex: 1, fontSize: 13, fontWeight: '800', marginLeft: 16, textAlign: 'right' },
  appleButton: { alignItems: 'center', backgroundColor: colors.primaryDark, borderRadius: 16, flexDirection: 'row', gap: 9, justifyContent: 'center', marginTop: 18, paddingVertical: 15 },
  appleButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
});
