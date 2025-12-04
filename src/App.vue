<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useLocale } from './composables/useLocale'
import { Github, Sun, Moon } from 'lucide-vue-next'

// specific logic to determine initial theme state
const getInitialTheme = () => {
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme) {
    return storedTheme === 'dark'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const isDark = ref(getInitialTheme())
const { locale, toggleLocale, t } = useLocale()

const toggleDark = () => {
  isDark.value = !isDark.value
}

watch(isDark, (val) => {
  if (val) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-100 selection:text-indigo-700 dark:selection:bg-indigo-900 dark:selection:text-indigo-300 transition-colors duration-300">
    <header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <router-link to="/" class="text-xl font-bold tracking-tight text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          Adobe<span class="text-indigo-600 dark:text-indigo-400">Keys</span>
        </router-link>
        
        <div class="flex items-center gap-4">
          <!-- GitHub Icon Link -->
          <a href="https://github.com/TheSUNSRise/AdobeKeys" target="_blank" 
             class="p-2 rounded text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors focus:outline-none"
             aria-label="GitHub Repository">
            <Github class="h-5 w-5" />
          </a>

          <!-- Language Toggle -->
          <button 
            @click="toggleLocale" 
            class="p-2 rounded text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors focus:outline-none w-10 flex items-center justify-center"
            aria-label="Toggle Language"
          >
            <span class="text-sm font-bold">{{ locale === 'zh' ? 'EN' : '中' }}</span>
          </button>
          
          <!-- Dark Mode Toggle -->
          <button 
            @click="toggleDark" 
            class="p-2 rounded text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            <Sun v-if="!isDark" class="h-5 w-5" />
            <Moon v-else class="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
    <main class="container mx-auto px-4 py-10 max-w-5xl">
      <RouterView />
    </main>
  </div>
</template>