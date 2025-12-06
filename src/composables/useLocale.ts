import { ref, computed, watch } from 'vue';

const storageKey = 'adobe-keys-locale';

const getInitialLocale = (): 'zh' | 'en' => {
  const stored = localStorage.getItem(storageKey);
  if (stored === 'zh' || stored === 'en') {
    return stored;
  }
  return 'zh';
};

const locale = ref<'zh' | 'en'>(getInitialLocale());

watch(locale, (val) => {
  localStorage.setItem(storageKey, val);
});

const toggleLocale = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh';
};

// Simple translation dictionary for UI elements
const messages = {
  en: {
    title: 'Master Your Workflow',
    subtitle: 'Select an application to browse its keyboard shortcuts and boost your productivity.',
    back: 'Back',
    searchPlaceholder: 'Search',
    noResults: 'No shortcuts found matching',
    clearSearch: 'Clear search',
    loading: 'Loading...',
    error: 'Failed to load shortcuts.',
    apps: {
      ps: 'Image Editing & Composition',
      ai: 'Vector Graphics & Illustration',
      ae: 'Motion Graphics & Visual Effects',
      pr: 'Video Editing & Production',
      lr: 'Photo Management & Editing',
      au: 'Audio Recording & Mixing'
    },
    header: {
      toggleOS: 'Switch OS',
      currentWindows: 'Current: Windows',
      currentMac: 'Current: Mac',
      toggleLang: 'Switch Language',
      toggleTheme: 'Toggle Theme',
      github: 'GitHub Repository'
    },
    shortcuts: {
      gridView: 'Grid View',
      listView: 'List View',
      toc: 'Table of Contents',
      backToTop: 'Back to Top',
      toggleFavorite: 'Toggle Favorite'
    }
  },
  zh: {
    title: '掌握高效工作流',
    subtitle: '选择一款应用查看其快捷键，助你事半功倍。',
    back: '返回',
    searchPlaceholder: '搜索',
    noResults: '未找到匹配的快捷键',
    clearSearch: '清空搜索',
    loading: '加载中...',
    error: '加载快捷键失败。',
    apps: {
      ps: '图像编辑与合成',
      ai: '矢量图形与插画',
      ae: '动态图形与视觉特效',
      pr: '视频剪辑与制作',
      lr: '照片管理与编辑',
      au: '音频录制与混音'
    },
    header: {
      toggleOS: '切换系统',
      currentWindows: '当前：Windows',
      currentMac: '当前：Mac',
      toggleLang: '切换语言',
      toggleTheme: '切换主题',
      github: 'GitHub 仓库'
    },
    shortcuts: {
      gridView: '网格视图',
      listView: '列表视图',
      toc: '目录',
      backToTop: '回到顶部',
      toggleFavorite: '切换收藏'
    }
  }
};

export function useLocale() {
  const t = computed(() => messages[locale.value]);
  
  return {
    locale,
    toggleLocale,
    t
  };
}
