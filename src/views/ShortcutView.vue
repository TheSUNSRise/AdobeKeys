<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLocale } from '../composables/useLocale';

interface LocalizedString {
  en: string;
  zh: string;
}

interface Shortcut {
  key: string;
  description: LocalizedString;
  category: LocalizedString;
}

const route = useRoute();
const { locale, t } = useLocale();
const shortcuts = ref<Shortcut[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');

const appName = computed(() => {
  const id = route.params.appId as string;
  const map: Record<string, string> = {
    ps: 'Photoshop',
    ai: 'Illustrator',
    pr: 'Premiere Pro'
  };
  return map[id] || id.toUpperCase();
});

const filteredShortcuts = computed(() => {
  if (!searchQuery.value) return shortcuts.value;
  const query = searchQuery.value.toLowerCase();
  return shortcuts.value.filter(s => 
    s.description[locale.value].toLowerCase().includes(query) || 
    s.key.toLowerCase().includes(query) ||
    s.category[locale.value].toLowerCase().includes(query)
  );
});

const groupedShortcuts = computed(() => {
  const groups: Record<string, Shortcut[]> = {};
  filteredShortcuts.value.forEach(shortcut => {
    const cat = shortcut.category[locale.value];
    if (!groups[cat]) {
      groups[cat] = [];
    }
    groups[cat].push(shortcut);
  });
  return groups;
});

const fetchShortcuts = async (appId: string) => {
  loading.value = true;
  error.value = null;
  shortcuts.value = [];
  searchQuery.value = ''; 
  try {
    const data = await import(`../data/${appId}.json`);
    shortcuts.value = data.default;
  } catch (e) {
    console.error('Failed to load shortcuts:', e);
    error.value = t.value.error;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchShortcuts(route.params.appId as string);
});

watch(() => route.params.appId, (newAppId) => {
  if (newAppId) {
    fetchShortcuts(newAppId as string);
  }
});

// Helper to split keys like "Ctrl + S" into ["Ctrl", "S"] for better styling
const splitKeys = (keyString: string) => {
  return keyString.split('+').map(k => k.trim());
};
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header & Navigation -->
    <div class="flex items-center justify-between mb-8">
      <router-link to="/" class="group flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
        <span class="mr-2 transform group-hover:-translate-x-1 transition-transform">&larr;</span>
        {{ t.back }}
      </router-link>
      <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{{ appName }}</h1>
    </div>

    <!-- Search Bar -->
    <div class="relative mb-10">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-slate-400 dark:text-slate-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <input 
        v-model="searchQuery"
        type="text" 
        :placeholder="t.searchPlaceholder"
        class="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg"
      >
    </div>

    <!-- Loading / Error States -->
    <div v-if="loading" class="text-center py-12 text-slate-500 dark:text-slate-400 animate-pulse">{{ t.loading }}</div>
    <div v-else-if="error" class="text-center py-12 text-red-500 dark:text-red-400">{{ error }}</div>
    
    <!-- Empty Search State -->
    <div v-else-if="Object.keys(groupedShortcuts).length === 0" class="text-center py-12">
      <p class="text-slate-500 dark:text-slate-400 text-lg">{{ t.noResults }} "{{ searchQuery }}".</p>
      <button @click="searchQuery = ''" class="mt-4 text-indigo-600 dark:text-indigo-400 font-medium hover:underline">{{ t.clearSearch }}</button>
    </div>

    <!-- Content -->
    <div v-else class="space-y-10">
      <div v-for="(group, category) in groupedShortcuts" :key="category">
        <h2 class="text-lg font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center transition-colors">
          {{ category }}
          <span class="ml-3 h-px bg-slate-200 dark:bg-slate-700 flex-1 transition-colors"></span>
        </h2>
        
        <div class="grid grid-cols-1 gap-3">
          <div v-for="shortcut in group" :key="shortcut.key + shortcut.description[locale]"
            class="group flex items-center justify-between bg-white dark:bg-slate-800 px-5 py-4 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 hover:border-indigo-100 dark:hover:border-indigo-900/50">
            
            <span class="text-slate-700 dark:text-slate-300 font-medium transition-colors">{{ shortcut.description[locale] }}</span>
            
            <div class="flex items-center space-x-1">
              <kbd 
                v-for="(k, index) in splitKeys(shortcut.key)" 
                :key="index"
                class="min-w-[2rem] text-center px-2 py-1 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm font-mono text-slate-600 dark:text-slate-200 font-bold shadow-[0_2px_0_#cbd5e1] dark:shadow-[0_2px_0_#475569] transition-colors"
              >
                {{ k }}
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>