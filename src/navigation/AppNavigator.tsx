import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '../constants/theme';
import { useFavorites } from '../context/FavoritesContext';
import { PodcastDetailScreen } from '../screens/PodcastDetailScreen';
import { PodcastListScreen } from '../screens/PodcastListScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { RootStackParamList, TabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function Tabs() {
  const { favorites } = useFavorites();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.primaryDark, fontWeight: '800' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: { borderTopColor: colors.border, height: 66, paddingBottom: 8, paddingTop: 6 },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            color={color}
            name={
              route.name === 'Podcastler'
                ? focused
                  ? 'headset'
                  : 'headset-outline'
                : focused
                  ? 'bookmark'
                  : 'bookmark-outline'
            }
            size={size}
          />
        ),
      })}
    >
      <Tab.Screen
        component={PodcastListScreen}
        name="Podcastler"
        options={{ headerTitle: 'Teknoloji Podcast’leri', tabBarLabel: 'Podcast’ler' }}
      />
      <Tab.Screen
        component={SavedScreen}
        name="Kaydedilenler"
        options={{
          tabBarBadge: favorites.length || undefined,
          tabBarBadgeStyle: { backgroundColor: colors.accent, color: colors.primaryDark },
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerBackTitle: 'Geri',
          headerShadowVisible: false,
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.primaryDark, fontWeight: '800' },
        }}
      >
        <Stack.Screen component={Tabs} name="AnaSekmeler" options={{ headerShown: false }} />
        <Stack.Screen
          component={PodcastDetailScreen}
          name="Detay"
          options={({ route }) => ({ title: route.params.podcast.collectionName })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
