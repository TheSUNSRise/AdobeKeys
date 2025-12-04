import { ref, watch } from 'vue';

// Store favorites as a map: appId -> array of shortcut unique IDs
// Unique ID construction: `${category}-${key}` (simple enough for this dataset)
const storageKey = 'adobe-keys-favorites';
const favorites = ref<Record<string, string[]>>({});

// Initialize from localStorage
const initFavorites = () => {
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      favorites.value = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse favorites', e);
      favorites.value = {};
    }
  }
};

// Save to localStorage
watch(favorites, (val) => {
  localStorage.setItem(storageKey, JSON.stringify(val));
}, { deep: true });

initFavorites();

export function useFavorites() {
  
  const getFavorites = (appId: string) => {
    return favorites.value[appId] || [];
  };

  const isFavorite = (appId: string, uniqueId: string) => {
    return getFavorites(appId).includes(uniqueId);
  };

  const toggleFavorite = (appId: string, uniqueId: string) => {
    const current = getFavorites(appId);
    if (current.includes(uniqueId)) {
      favorites.value[appId] = current.filter(id => id !== uniqueId);
    } else {
      favorites.value[appId] = [...current, uniqueId];
    }
  };

  // Helper to generate a stable ID for a shortcut
  const generateId = (shortcut: any) => {
    // Using category.en and key to ensure uniqueness across languages
    return `${shortcut.category.en}-${shortcut.key}`;
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    generateId
  };
}
