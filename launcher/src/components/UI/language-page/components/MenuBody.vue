<template>
  <div
    ref="scrollContainer"
    class="w-full h-full col-start-2 col-end-12 row-start-2 row-end-11 flex flex-col justify-start items-center"
    @scroll="handleScroll"
  >
    <!-- Search input (optional) -->
    <div class="w-full mb-4 grid grid-cols-12">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search language..."
        class="col-start-5 col-end-9 w-full h-8 px-4 py-2 text-gray-700 rounded-md border placeholder-gray-400 mx-auto self-center justify-self-center"
      />
    </div>

    <!-- Grid layout replacing swiper -->
    <div class="w-full h-full grid grid-cols-4 gap-4 px-2 overflow-y-auto">
      <div
        v-for="(lang, index) in filteredLanguages"
        :key="index"
        class="h-10 bg-gray-300 rounded-md flex justify-start items-center px-2 cursor-pointer space-x-2 lang-btn"
        :class="{
          selectedLanguage: lang.isSelected,
        }"
        @click="handleClick(lang, index)"
      >
        <img :src="lang.flag" :alt="`${lang.name} Flag`" class="w-6 h-6 rounded-full" />
        <span class="uppercase text-xs font-semibold">
          {{ lang.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from "vue";
import { useLangStore } from "@/store/languages";
import { useSoundStore } from "@/store/sound";
import ControlService from "@/store/ControlService";
import { useRouter } from "vue-router";
import i18n from "@/includes/i18n";

const langStore = useLangStore();
const router = useRouter();
const soundStore = useSoundStore();
const selectedLanguage = ref(null);
const searchQuery = ref("");

// Keep all the existing computed properties
const sortedLanguages = computed(() => {
  return [...langStore.langOptions].sort((a, b) => a.name.localeCompare(b.name));
});

// Add filtered languages based on search
const filteredLanguages = computed(() => {
  if (!searchQuery.value) return sortedLanguages.value;
  return sortedLanguages.value.filter((lang) => lang.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

// Keep all the existing lifecycle hooks
onBeforeMount(async () => {
  if (!langStore.settingPageIsVisible) {
    await checkSettings();
  } else {
    router.push("/");
  }
});

onMounted(async () => {
  await checkVolume();
});

// Keep all the existing methods
const checkSettings = async () => {
  try {
    const savedConfig = await ControlService.readConfig();

    // Handle language settings and routing
    const { savedLanguage, savedVolume } = savedConfig || {};

    if (savedLanguage?.flag && savedLanguage?.label) {
      router.push("/login");
    } else {
      router.push("/");
    }

    // Handle volume settings
    langStore.currentVolume = savedVolume?.volume ?? 0;
  } catch (error) {
    console.error("Failed to load saved settings:", error);
  }
};

const checkVolume = async () => {
  try {
    const savedConfig = await ControlService.readConfig();
    const { savedVolume } = savedConfig || {};
    langStore.currentVolume = savedVolume?.volume ?? 0;
  } catch (error) {
    console.error("Failed to load saved settings:", error);
  }
};

// Add empty handleScroll method since it's used in the template
const handleScroll = () => {};

const handleClick = (lang) => {
  playSoundBase(soundStore.click);
  selectItem(lang);
};

const selectItem = async (lang, playSound = true) => {
  if (playSound) {
    playSoundBase(soundStore.click);
  }
  langStore.langOptions.forEach((option) => (option.isSelected = false));
  lang.isSelected = true;
  selectedLanguage.value = lang;
  langStore.setSelectedLang(lang.label);
  i18n.global.locale.value = lang.label;
  await updateSettings(lang);
};

const playSoundBase = (base64Data) => {
  const audio = new Audio(base64Data);
  audio.volume = langStore.currentVolume;
  audio.play().catch((e) => console.error("Failed to play sound:", e));
};

const updateSettings = async (lang) => {
  try {
    const prevConf = await ControlService.readConfig();
    const conf = {
      ...prevConf,
      savedLanguage: { language: lang.name, flag: lang.flag, label: lang.label },
    };
    await ControlService.writeConfig(conf);
  } catch (error) {
    console.error("Failed to update settings:", error);
  }
};
</script>

<style scoped>
.lang-btn {
  transition: all 0.3s ease-in-out;
}

.lang-btn:hover {
  background: #212222;
  color: #92f4e7;
}
.selectedLanguage {
  background: #025656 !important;
  border: 1px solid #027474 !important;
  box-shadow: 0 0 10px 0 #272b2b !important;
  color: #aaf0e7;
  transform: scale(1.05);
}

/* Keep the scrollbar styles */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: transparent !important;
}

::-webkit-scrollbar {
  width: 12px;
  background-color: #d9dfdf;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #39d7d5;
}
</style>
