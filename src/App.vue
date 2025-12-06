<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useLocale } from './composables/useLocale'
import { useOS } from './composables/useOS'
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
const { os, toggleOS, initOS } = useOS()

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

onMounted(() => {
  initOS()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-100 selection:text-indigo-700 dark:selection:bg-indigo-900 dark:selection:text-indigo-300 transition-colors duration-300">
    <header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <router-link to="/" class="text-xl font-bold tracking-tight text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          Adobe<span class="text-indigo-600 dark:text-indigo-400">Keys</span>
        </router-link>
        
        <div class="flex items-center gap-4">
          <!-- OS Toggle -->
          <button
            @click="toggleOS"
            class="p-2 rounded text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors focus:outline-none w-10 flex items-center justify-center"
            :aria-label="t.header.toggleOS"
            :title="os === 'win' ? t.header.currentWindows : t.header.currentMac"
          >
            <!-- Windows Icon -->
            <svg v-if="os === 'win'" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
            </svg>
            <!-- Apple Icon -->
            <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.66-1.6 2.87-2.63 3.81-2.5.08 1.71-1.05 3.47-2.56 4.05-.82.33-2.98.63-3.82-2.69-.02-.12.14 1.07 2.57 1.14"/>
            </svg>
          </button>

          <!-- Language Toggle -->
          <button
            @click="toggleLocale"
            class="p-2 rounded text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors focus:outline-none w-9 flex items-center justify-center"
            :aria-label="t.header.toggleLang"
            :title="t.header.toggleLang"
          >
            <span class="text-sm font-bold">{{ locale === 'zh' ? 'EN' : '中' }}</span>
          </button>

          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDark"
            class="p-2 rounded text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            :aria-label="t.header.toggleTheme"
            :title="t.header.toggleTheme"
          >
            <Sun v-if="!isDark" class="h-5 w-5" />
            <Moon v-else class="h-5 w-5" />
          </button>

          <!-- GitHub Icon Link -->
          <a href="https://github.com/TheSUNSRise/AdobeKeys" target="_blank"
             class="p-2 rounded text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors focus:outline-none"
             :aria-label="t.header.github"
             :title="t.header.github">
            <Github class="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
    <main class="container mx-auto px-4 py-10 max-w-5xl">
      <RouterView v-slot="{ Component }">
        <transition
          enter-active-class="transition-opacity duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>