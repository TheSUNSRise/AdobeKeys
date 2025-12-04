import { ref, computed } from 'vue';

type OS = 'win' | 'mac';

const os = ref<OS>('win');

// Initialize OS based on user agent
const initOS = () => {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes('mac')) {
    os.value = 'mac';
  } else {
    os.value = 'win';
  }
};

const toggleOS = () => {
  os.value = os.value === 'win' ? 'mac' : 'win';
};

// Helper to format keys based on OS
const formatKey = (key: string) => {
  if (os.value === 'win') return key;
  
  // Mac replacements
  return key
    .replace(/Ctrl/g, 'Cmd')
    .replace(/Alt/g, 'Opt');
};

// Helper to get modifier symbols for visual display (optional)
const getKeySymbol = (keyPart: string) => {
  if (os.value === 'win') return keyPart;
  
  switch (keyPart.toLowerCase()) {
    case 'ctrl': return '⌘';
    case 'alt': return '⌥';
    case 'shift': return '⇧';
    case 'cmd': return '⌘';
    case 'opt': return '⌥';
    default: return keyPart;
  }
};

export function useOS() {
  return {
    os,
    initOS,
    toggleOS,
    formatKey,
    getKeySymbol
  };
}
