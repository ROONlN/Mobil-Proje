import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Podcast } from '../types';

const STORAGE_KEY = '@teknocast/favorites';

type FavoritesContextValue = {
  favorites: Podcast[];
  hydrated: boolean;
  isFavorite: (collectionId: number) => boolean;
  toggleFavorite: (podcast: Podcast) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [favorites, setFavorites] = useState<Podcast[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setFavorites(JSON.parse(stored) as Podcast[]);
      } catch (error) {
        console.warn('Kaydedilen podcastler okunamadı.', error);
      } finally {
        setHydrated(true);
      }
    }

    void loadFavorites();
  }, []);

  const isFavorite = useCallback(
    (collectionId: number) => favorites.some((item) => item.collectionId === collectionId),
    [favorites],
  );

  const toggleFavorite = useCallback(async (podcast: Podcast) => {
    const alreadySaved = favorites.some((item) => item.collectionId === podcast.collectionId);
    const nextFavorites = alreadySaved
      ? favorites.filter((item) => item.collectionId !== podcast.collectionId)
      : [podcast, ...favorites];

    setFavorites(nextFavorites);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
    } catch (error) {
      console.warn('Kaydedilen podcastler yazılamadı.', error);
    }
  }, [favorites]);

  const value = useMemo(
    () => ({ favorites, hydrated, isFavorite, toggleFavorite }),
    [favorites, hydrated, isFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites, FavoritesProvider içinde kullanılmalıdır.');
  return context;
}
