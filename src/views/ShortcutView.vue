<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useLocale } from '../composables/useLocale';
import { useOS } from '../composables/useOS';
import { useFavorites } from '../composables/useFavorites';
import { LayoutGrid, List, Menu, ArrowUp, Star } from 'lucide-vue-next';
import type { Shortcut, ShortcutGroup } from '../types';

const route = useRoute();
const { locale, t } = useLocale();
const { formatKey, os } = useOS();
const { isFavorite, toggleFavorite, generateId } = useFavorites();

const shortcuts = ref<Shortcut[]>([]);
const loading = ref(true);
const showSkeleton = ref(false);
let skeletonTimer: ReturnType<typeof setTimeout> | null = null;
const error = ref<string | null>(null);
const searchQuery = ref('');
const debouncedQuery = ref('');
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(searchQuery, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = val;
  }, 150);
});

const viewModeStorageKey = 'adobe-keys-view-mode';
const getInitialViewMode = (): 'grid' | 'list' => {
  const stored = localStorage.getItem(viewModeStorageKey);
  if (stored === 'grid' || stored === 'list') {
    return stored;
  }
  return 'grid';
};
const viewMode = ref<'grid' | 'list'>(getInitialViewMode());
watch(viewMode, (val) => {
  localStorage.setItem(viewModeStorageKey, val);
});

const showToc = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);
const showBackToTop = ref(false);

const appId = computed(() => route.params.appId as string);

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.value?.focus();
  }
  if (e.key === 'Escape' && searchQuery.value) {
    searchQuery.value = '';
    debouncedQuery.value = '';
    searchInput.value?.blur();
  }
};

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const appName = computed(() => {
  const id = appId.value;
  const map: Record<string, string> = {
    ps: 'Photoshop',
    ai: 'Illustrator',
    ae: 'After Effects',
    pr: 'Premiere Pro',
    lr: 'Lightroom',
    au: 'Audition'
  };
  return map[id] || id.toUpperCase();
});

const searchPlaceholder = computed(() => {
  const shortcut = os.value === 'mac' ? 'Cmd+K' : 'Ctrl+K';
  return `${t.value.searchPlaceholder} (${shortcut})...`;
});

const filteredShortcuts = computed(() => {
  if (!debouncedQuery.value) return shortcuts.value;
  const query = debouncedQuery.value.toLowerCase();
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
      name: locale.value === 'zh' ? '收藏' : 'Favorites',
      items: favItems,
      isFavorites: true
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
  debouncedQuery.value = '';

  // Delay showing skeleton to avoid flash for fast loads
  if (skeletonTimer) clearTimeout(skeletonTimer);
  skeletonTimer = setTimeout(() => {
    if (loading.value) {
      showSkeleton.value = true;
    }
  }, 150);

  try {
    const data = await import(`../data/${id}.json`);
    shortcuts.value = data.default;
  } catch (e) {
    console.error('Failed to load shortcuts:', e);
    error.value = t.value.error;
  } finally {
    loading.value = false;
    showSkeleton.value = false;
    if (skeletonTimer) {
      clearTimeout(skeletonTimer);
      skeletonTimer = null;
    }

    // Scroll to hash after DOM rendered
    await nextTick();
    setTimeout(scrollToHash, 50);
  }
};

onMounted(() => {
  fetchShortcuts(appId.value);
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('scroll', handleScroll);
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

const scrollToCategory = (name: string, updateHash = true) => {
  showToc.value = false;
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

    // Update URL hash
    if (updateHash) {
      const hash = encodeURIComponent(name);
      history.replaceState(null, '', `#${hash}`);
    }
  }
};

const scrollToHash = () => {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (hash) {
    // Find matching category
    const matchedGroup = groupedShortcuts.value.find(g => g.name === hash);
    if (matchedGroup) {
      scrollToCategory(matchedGroup.name, false);
    }
  }
};

const escapeHtml = (text: string) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const highlightText = (text: string) => {
  if (!debouncedQuery.value) return escapeHtml(text);
  const query = debouncedQuery.value;
  const escaped = escapeHtml(text);
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escaped.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-500/30 text-inherit rounded px-0.5">$1</mark>');
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
    <div class="flex gap-3 mb-10 items-center">
      <div class="relative flex-grow">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-slate-400 dark:text-slate-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full pl-12 pr-24 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-base"
        >
        <!-- Stats inside search box -->
        <div v-if="!loading" class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <span class="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
            <span v-if="debouncedQuery">{{ filteredShortcuts.length }}/</span>{{ shortcuts.length }}
          </span>
        </div>
      </div>

      <div class="flex items-center bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm flex-shrink-0">
        <button
          @click="viewMode = 'grid'"
          class="p-2 rounded-lg transition-all duration-200 focus:outline-none"
          :class="viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'"
          :aria-label="t.shortcuts.gridView"
          :title="t.shortcuts.gridView"
        >
          <LayoutGrid class="w-5 h-5" />
        </button>
        <button
          @click="viewMode = 'list'"
          class="p-2 rounded-lg transition-all duration-200 focus:outline-none"
          :class="viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'"
          :aria-label="t.shortcuts.listView"
          :title="t.shortcuts.listView"
        >
          <List class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div>
      <!-- Loading Skeleton -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showSkeleton" class="space-y-10">
          <div v-for="i in 3" :key="i">
            <div class="flex items-center mb-4">
              <div class="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div class="ml-3 h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
            </div>
            <div class="grid gap-3" :class="viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'">
              <div
                v-for="j in (viewMode === 'grid' ? 6 : 4)"
                :key="j"
                class="bg-white dark:bg-slate-800 px-5 py-4 rounded-lg shadow-sm"
                :class="{'flex flex-col gap-3': viewMode === 'grid', 'flex items-center justify-between': viewMode === 'list'}"
              >
                <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" :class="viewMode === 'grid' ? 'w-3/4' : 'w-1/3'"></div>
                <div class="flex gap-1" :class="{'mt-auto': viewMode === 'grid'}">
                  <div class="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div class="h-6 w-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div v-if="!loading && error" class="text-center py-12 text-red-500 dark:text-red-400">{{ error }}</div>

      <div v-else-if="!loading && !showSkeleton && groupedShortcuts.length === 0" class="text-center py-12">
        <p class="text-slate-500 dark:text-slate-400 text-lg">{{ t.noResults }} "{{ searchQuery }}".</p>
        <button @click="searchQuery = ''" class="mt-4 text-indigo-600 dark:text-indigo-400 font-medium hover:underline">{{ t.clearSearch }}</button>
      </div>

      <div v-else-if="!loading && !showSkeleton" class="space-y-10">
        <div v-for="group in groupedShortcuts" :key="group.name" :id="`cat-${group.name.replace(/\s+/g, '-')}`" class="scroll-mt-24">
          <h2 class="text-lg font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center transition-colors"
              :class="{'text-indigo-500 dark:text-indigo-400': group.isFavorites}">
            <Star v-if="group.isFavorites" class="w-5 h-5 mr-2 text-amber-400" fill="currentColor" :stroke-width="0" />
            {{ group.name }}
            <span class="ml-3 h-px bg-slate-200 dark:bg-slate-700 flex-1 transition-colors"></span>
          </h2>
          
          <div class="grid gap-3" :class="viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'">
          <div v-for="shortcut in group.items" :key="shortcut.key + shortcut.description[locale]"
            class="group flex items-center justify-between bg-white dark:bg-slate-800 px-5 py-4 rounded-lg shadow-sm relative
                   border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30
                   hover:shadow-md hover:-translate-y-0.5 hover:bg-slate-50/80 dark:hover:bg-slate-700/50
                   transition-all duration-200 cursor-default"
            :class="{'flex-col items-start gap-3': viewMode === 'grid', 'flex-row': viewMode === 'list'}"
          >
              <button
                @click.stop="toggleFavorite(appId, generateId(shortcut))"
                class="p-1.5 rounded-full flex-shrink-0 bg-transparent
                       outline-none border-none ring-0 appearance-none
                       focus:outline-none focus:ring-0 focus:border-none focus:bg-transparent
                       focus-visible:outline-none focus-visible:ring-0 focus-visible:bg-transparent
                       active:outline-none active:ring-0 active:bg-transparent
                       transition-[color,transform] duration-200
                       hover:scale-110 active:scale-95"
                :class="{
                  'absolute top-2 right-2': viewMode === 'grid',
                  'mr-4 relative': viewMode === 'list',
                  'text-amber-400 hover:text-amber-500': isFavorite(appId, generateId(shortcut)),
                  'text-slate-300 dark:text-slate-600 hover:text-amber-400 dark:hover:text-amber-400': !isFavorite(appId, generateId(shortcut))
                }"
                :title="t.shortcuts.toggleFavorite"
              >
                <Star
                  class="w-4 h-4 transition-all duration-200"
                  :fill="isFavorite(appId, generateId(shortcut)) ? 'currentColor' : 'none'"
                  :stroke-width="2"
                />
              </button>

              <span class="text-slate-700 dark:text-slate-300 font-medium transition-colors break-words"
                :class="{'text-base w-full pr-6': viewMode === 'grid', 'text-lg flex-grow': viewMode === 'list'}"
                v-html="highlightText(shortcut.description[locale])"
              ></span>
              
              <div class="flex items-center flex-wrap gap-1.5 flex-shrink-0" :class="{'w-full justify-end mt-auto': viewMode === 'grid', 'flex-nowrap': viewMode === 'list'}">
                <kbd
                  v-for="(k, index) in splitKeys(shortcut.key)"
                  :key="index"
                  class="min-w-[1.75rem] text-center px-2.5 py-1.5 rounded-md text-xs font-mono font-semibold whitespace-nowrap
                         bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-600 dark:to-slate-700
                         text-slate-700 dark:text-slate-200
                         border border-slate-200 dark:border-slate-500
                         shadow-[0_2px_0_0_rgb(203,213,225)] dark:shadow-[0_2px_0_0_rgb(71,85,105)]
                         hover:translate-y-0.5 hover:shadow-none
                         hover:from-slate-100 hover:to-slate-50 dark:hover:from-slate-700 dark:hover:to-slate-600
                         active:translate-y-0.5 active:shadow-none
                         transition-all duration-75 cursor-pointer"
                >
                  {{ k }}
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Buttons Container (Fixed Bottom Right) -->
    <div class="fixed bottom-8 right-8 z-50 flex items-center gap-3" v-if="groupedShortcuts.length > 0">
      <!-- Back to Top Button -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-x-4 opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-4 opacity-0"
      >
        <button
          v-if="showBackToTop"
          @click="scrollToTop"
          class="p-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-lg hover:bg-slate-300 dark:hover:bg-slate-600 hover:scale-105 transition-all duration-300 focus:outline-none"
          :aria-label="t.shortcuts.backToTop"
          :title="t.shortcuts.backToTop"
        >
          <ArrowUp class="w-6 h-6" />
        </button>
      </transition>

      <!-- TOC Button with Popover -->
      <div
        class="relative flex flex-col items-end"
        @mouseenter="showToc = true"
        @mouseleave="showToc = false"
      >
        <!-- TOC Menu (Popover) -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="translate-y-4 opacity-0 scale-95"
          enter-to-class="translate-y-0 opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0 opacity-100 scale-100"
          leave-to-class="translate-y-4 opacity-0 scale-95"
        >
          <div v-if="showToc" class="absolute bottom-full mb-4 right-0 w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden origin-bottom-right">
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
                    :class="{'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-900/20': group.isFavorites}"
                  >
                    <Star v-if="group.isFavorites" class="w-3.5 h-3.5 mr-2 text-amber-400 flex-shrink-0" fill="currentColor" :stroke-width="0" />
                    <span v-else class="w-1.5 h-1.5 rounded-full mr-2 transition-all duration-300 flex-shrink-0 bg-slate-300 dark:bg-slate-600 group-hover:bg-indigo-400 group-hover:scale-125"></span>
                    {{ group.name }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </transition>

        <!-- TOC FAB Button -->
        <button
          class="p-4 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-600/40 hover:scale-105 transition-all duration-300 focus:outline-none"
          :aria-label="t.shortcuts.toc"
          :title="t.shortcuts.toc"
        >
          <Menu class="w-6 h-6" />
        </button>
      </div>
    </div>

  </div>
</template>
