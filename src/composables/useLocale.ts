import { ref, computed } from 'vue';

const locale = ref<'zh' | 'en'>('zh');

const toggleLocale = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh';
};

// Simple translation dictionary for UI elements
const messages = {
  en: {
    title: 'Master Your Workflow',
    subtitle: 'Select an application to browse its keyboard shortcuts and boost your productivity.',
    back: 'Back',
    searchPlaceholder: 'Search for a command (e.g., "Save", "Undo")...',
    noResults: 'No shortcuts found matching',
    clearSearch: 'Clear search',
    loading: 'Loading...',
    error: 'Failed to load shortcuts.',
    apps: {
      ps: 'Image Editing & Composition',
      ai: 'Vector Graphics & Illustration',
      pr: 'Video Editing & Production'
    }
  },
  zh: {
    title: '掌握高效工作流',
    subtitle: '选择一款应用查看其快捷键，助你事半功倍。',
    back: '返回',
    searchPlaceholder: '搜索功能（例如："保存", "撤销"）...',
    noResults: '未找到匹配的快捷键',
    clearSearch: '清空搜索',
    loading: '加载中...',
    error: '加载快捷键失败。',
    apps: {
      ps: '图像编辑与合成',
      ai: '矢量图形与插画',
      pr: '视频剪辑与制作'
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
