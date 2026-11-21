export type Podcast = {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl100: string;
  primaryGenreName: string;
  trackCount?: number;
  releaseDate?: string;
  collectionViewUrl?: string;
};

export type SortOrder = 'asc' | 'desc';

export type RootStackParamList = {
  AnaSekmeler: undefined;
  Detay: { podcast: Podcast };
};

export type TabParamList = {
  Podcastler: undefined;
  Kaydedilenler: undefined;
};
