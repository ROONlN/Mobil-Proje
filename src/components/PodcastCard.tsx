import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';
import { Podcast } from '../types';

type Props = {
  podcast: Podcast;
  onPress: () => void;
  saved?: boolean;
};

export function PodcastCard({ podcast, onPress, saved = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${podcast.collectionName} ayrıntılarını aç${saved ? ', kaydedildi' : ''}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.artworkWrap}>
        <Image source={{ uri: podcast.artworkUrl100 }} style={styles.artwork} />
        {saved && (
          <View style={styles.savedBadge}>
            <Ionicons color="#FFFFFF" name="bookmark" size={13} />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {podcast.collectionName}
        </Text>
        <Text numberOfLines={1} style={styles.artist}>
          {podcast.artistName}
        </Text>
        <View style={styles.genreRow}>
          <Text numberOfLines={1} style={styles.genre}>
            {podcast.primaryGenreName || 'Podcast'}
          </Text>
          {typeof podcast.trackCount === 'number' && (
            <Text style={styles.episodeCount}>{podcast.trackCount} bölüm</Text>
          )}
        </View>
      </View>
      <Ionicons color={colors.primary} name="chevron-forward" size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 12,
    shadowColor: '#1B2B62',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  artworkWrap: { position: 'relative' },
  artwork: { borderRadius: 15, height: 82, width: 82, backgroundColor: colors.chip },
  savedBadge: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.surface,
    borderRadius: 13,
    borderWidth: 2,
    bottom: -4,
    height: 26,
    justifyContent: 'center',
    position: 'absolute',
    right: -4,
    width: 26,
  },
  content: { flex: 1, marginHorizontal: 13 },
  title: { color: colors.text, fontSize: 16, fontWeight: '800', lineHeight: 21 },
  artist: { color: colors.muted, fontSize: 13, marginTop: 4 },
  genreRow: { alignItems: 'center', flexDirection: 'row', marginTop: 9 },
  genre: {
    backgroundColor: colors.chip,
    borderRadius: 9,
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    maxWidth: '56%',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  episodeCount: { color: colors.muted, fontSize: 11, marginLeft: 8 },
});
