<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLocale } from '../composables/useLocale';
import { useOS } from '../composables/useOS';
import { useFavorites } from '../composables/useFavorites';
import { LayoutGrid, List, Menu } from 'lucide-vue-next';

interface LocalizedString {
  en: string;
  zh: string;
}

interface Shortcut {
  key: string;
  description: LocalizedString;
  category: LocalizedString;
}

interface ShortcutGroup {
  name: string;
  items: Shortcut[];
}

const route = useRoute();
const { locale, t } = useLocale();
const { formatKey } = useOS();
const { isFavorite, toggleFavorite, generateId } = useFavorites();

const shortcuts = ref<Shortcut[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');
const viewMode = ref<'grid' | 'list'>('grid'); 
const showToc = ref(false);

const appId = computed(() => route.params.appId as string);

const appName = computed(() => {
  const id = appId.value;
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
  const groups: ShortcutGroup[] = [];
  const otherGroups: Record<string, Shortcut[]> = {};
  
  const favItems = filteredShortcuts.value.filter(s => isFavorite(appId.value, generateId(s)));
  if (favItems.length > 0) {
    groups.push({
      name: locale.value === 'zh' ? '⭐ 收藏' : '⭐ Favorites',
      items: favItems
    });
  }

  filteredShortcuts.value.forEach(shortcut => {
    const cat = shortcut.category[locale.value];
    if (!otherGroups[cat]) {
      otherGroups[cat] = [];
    }
    otherGroups[cat].push(shortcut);
  });

  for (const [name, items] of Object.entries(otherGroups)) {
    groups.push({ name, items });
  }

  return groups;
});

const fetchShortcuts = async (id: string) => {
  loading.value = true;
  error.value = null;
  shortcuts.value = [];
  searchQuery.value = ''; 
  try {
    const data = await import(`../data/${id}.json`);
    shortcuts.value = data.default;
  } catch (e) {
    console.error('Failed to load shortcuts:', e);
    error.value = t.value.error;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchShortcuts(appId.value);
});

watch(() => route.params.appId, (newAppId) => {
  if (newAppId) {
    fetchShortcuts(newAppId as string);
  }
});

const splitKeys = (keyString: string) => {
  return formatKey(keyString)
    .split('+')
    .map(k => k.trim())
    .map(k => k.replace('{{PLUS}}', '+'))
    .map(k => k.replace('{{MINUS}}', '-'))
    .map(k => k.replace('{{TILDE}}', '~'));
};

const scrollToCategory = (name: string) => {
  showToc.value = false; // Close menu on click
  const id = `cat-${name.replace(/\s+/g, '-')}`;
  const el = document.getElementById(id);
  if (el) {
    const headerOffset = 100; 
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};
</script>

<template>
  <div class="max-w-5xl mx-auto relative min-h-screen pb-20">
    <!-- Header & Navigation -->
    <div class="flex items-center justify-between mb-8">
      <router-link to="/" class="group flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
        <span class="mr-2 transform group-hover:-translate-x-1 transition-transform">&larr;</span>
        {{ t.back }}
      </router-link>
      <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{{ appName }}</h1>
    </div>

    <!-- Controls: Search + View Toggle -->
    <div class="flex flex-wrap gap-4 mb-10">
      <div class="relative flex-grow min-w-[200px]">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-slate-400 dark:text-slate-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          :placeholder="t.searchPlaceholder"
          class="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-base"
        >
      </div>

      <div class="flex items-center bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm flex-shrink-0">
        <button 
          @click="viewMode = 'grid'"
          class="p-2 rounded-lg transition-all duration-200 focus:outline-none"
          :class="viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'"
          aria-label="Grid View"
        >
          <LayoutGrid class="w-5 h-5" />
        </button>
        <button 
          @click="viewMode = 'list'"
          class="p-2 rounded-lg transition-all duration-200 focus:outline-none"
          :class="viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'"
          aria-label="List View"
        >
          <List class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div>
      <div v-if="loading" class="text-center py-12 text-slate-500 dark:text-slate-400 animate-pulse">{{ t.loading }}</div>
      <div v-else-if="error" class="text-center py-12 text-red-500 dark:text-red-400">{{ error }}</div>
      
      <div v-else-if="groupedShortcuts.length === 0" class="text-center py-12">
        <p class="text-slate-500 dark:text-slate-400 text-lg">{{ t.noResults }} "{{ searchQuery }}".</p>
        <button @click="searchQuery = ''" class="mt-4 text-indigo-600 dark:text-indigo-400 font-medium hover:underline">{{ t.clearSearch }}</button>
      </div>

      <div v-else class="space-y-10">
        <div v-for="group in groupedShortcuts" :key="group.name" :id="`cat-${group.name.replace(/\s+/g, '-')}`" class="scroll-mt-24">
          <h2 class="text-lg font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center transition-colors"
              :class="{'text-indigo-500 dark:text-indigo-400': group.name.includes('⭐')}">
            {{ group.name }}
            <span class="ml-3 h-px bg-slate-200 dark:bg-slate-700 flex-1 transition-colors"></span>
          </h2>
          
          <div class="grid gap-3" :class="viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'">
          <div v-for="shortcut in group.items" :key="shortcut.key + shortcut.description[locale]"
            class="group flex items-center justify-between bg-white dark:bg-slate-800 px-5 py-4 rounded-lg shadow-sm relative"
            :class="{'flex-col items-start gap-3': viewMode === 'grid', 'flex-row': viewMode === 'list'}"
          >
              <button 
                @click.stop="toggleFavorite(appId, generateId(shortcut))"
                class="p-1.5 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 bg-transparent border-none outline-none ring-0"
                :class="{
                  'absolute top-2 right-2': viewMode === 'grid',
                  'mr-4 relative': viewMode === 'list',
                  'text-pink-500': isFavorite(appId, generateId(shortcut)),
                  'text-slate-200 dark:text-slate-700': !isFavorite(appId, generateId(shortcut))
                }"
                title="Toggle Favorite"
              >
                <span class="text-sm leading-none flex items-center justify-center">{{ isFavorite(appId, generateId(shortcut)) ? '★' : '☆' }}</span>
              </button>

              <span class="text-slate-700 dark:text-slate-300 font-medium transition-colors break-words"
                :class="{'text-base w-full pr-6': viewMode === 'grid', 'text-lg flex-grow': viewMode === 'list'}"
              >{{ shortcut.description[locale] }}</span>
              
              <div class="flex items-center flex-wrap gap-1 flex-shrink-0" :class="{'w-full justify-end mt-auto': viewMode === 'grid', 'flex-nowrap': viewMode === 'list'}">
                <kbd 
                  v-for="(k, index) in splitKeys(shortcut.key)" 
                  :key="index"
                  class="min-w-[1.5rem] text-center px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-mono text-slate-600 dark:text-slate-200 font-bold shadow-sm transition-colors whitespace-nowrap"
                >
                  {{ k }}
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating TOC Container (Fixed Bottom Right) -->
    <div class="fixed bottom-8 right-8 z-50 flex flex-col items-end" v-if="groupedShortcuts.length > 0"
         @mouseenter="showToc = true"
         @mouseleave="showToc = false">
      
      <!-- TOC Menu (Popover) -->
      <transition 
        enter-active-class="transition duration-200 ease-out" 
        enter-from-class="translate-y-4 opacity-0 scale-95" 
        enter-to-class="translate-y-0 opacity-100 scale-100" 
        leave-active-class="transition duration-150 ease-in" 
        leave-from-class="translate-y-0 opacity-100 scale-100" 
        leave-to-class="translate-y-4 opacity-0 scale-95"
      >
        <div v-if="showToc" class="mb-4 w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden origin-bottom-right">
          <div class="max-h-[60vh] overflow-y-auto custom-scrollbar py-3">
            <div class="flex items-center justify-between px-5 py-2 sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-10 mb-2">
              <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {{ locale === 'zh' ? '目录' : 'Contents' }}
              </h3>
              <span class="text-[10px] font-medium text-slate-300 dark:text-slate-600 bg-slate-100 dark:bg-slate-700/50 px-1.5 py-0.5 rounded">{{ groupedShortcuts.length }}</span>
            </div>
            <ul class="px-2 space-y-0.5">
              <li v-for="group in groupedShortcuts" :key="group.name">
                <button 
                  @click="scrollToCategory(group.name)"
                  class="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 truncate group flex items-center"
                  :class="{'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-900/20': group.name.includes('⭐')}"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-2 transition-all duration-300" 
                        :class="group.name.includes('⭐') ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-indigo-400 group-hover:scale-125'"></span>
                  {{ group.name }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </transition>

      <!-- FAB Button -->
      <button 
        class="p-4 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-600/40 hover:scale-105 transition-all duration-300 focus:outline-none"
        aria-label="Table of Contents"
      >
        <Menu class="w-6 h-6" />
      </button>
    </div>

  </div>
</template>
