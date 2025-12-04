<script setup lang="ts">
import { useLocale } from '../composables/useLocale';

const { t } = useLocale();

const apps = [
  { 
    id: 'ps', 
    name: 'Photoshop', 
    color: 'border-blue-600 text-blue-700 dark:text-blue-400',
    logoBg: 'bg-[#001E36]',
    logoText: 'text-[#31A8FF]',
    bgHover: 'hover:shadow-blue-500/10'
  },
  { 
    id: 'ai', 
    name: 'Illustrator', 
    color: 'border-orange-500 text-orange-600 dark:text-orange-400',
    logoBg: 'bg-[#330000]',
    logoText: 'text-[#FF9A00]',
    bgHover: 'hover:shadow-orange-500/10'
  },
  { 
    id: 'pr', 
    name: 'Premiere Pro', 
    color: 'border-purple-600 text-purple-700 dark:text-purple-400',
    logoBg: 'bg-[#00005B]',
    logoText: 'text-[#9999FF]',
    bgHover: 'hover:shadow-purple-500/10'
  },
];
</script>

<template>
  <div>
    <div class="text-center mb-12">
      <h1 class="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">{{ t.title }}</h1>
      <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors">
        {{ t.subtitle }}
      </p>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link 
        v-for="app in apps" 
        :key="app.id" 
        :to="`/${app.id}`" 
        class="group bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 relative overflow-hidden flex flex-col h-full"
        :class="app.bgHover"
      >
        <!-- Top Accent Line -->
        <div class="absolute top-0 left-0 w-full h-1.5" :class="app.color.split(' ')[0].replace('text', 'bg').replace('border', 'bg')"></div>
        
        <div class="flex-grow">
           <!-- App Icon (Adobe Style) -->
           <div class="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shadow-md mb-6 transition-transform duration-300"
                :class="[app.logoBg, app.logoText]">
             {{ app.id.charAt(0).toUpperCase() + app.id.slice(1) }}
           </div>
           
           <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white transition-colors mb-2">
             {{ app.name }}
           </h2>
           <p class="text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">
             {{ t.apps[app.id as keyof typeof t.apps] }}
           </p>
        </div>
        
        <!-- Subtle Arrow Indicator on hover -->
        <div class="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300">
          <svg class="w-6 h-6 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </router-link>
    </div>
  </div>
</template>
