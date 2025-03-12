<template>
  <div class="w-full audio-output-parent flex h-full bg-[#33393E] rounded-md">
    <div class="selected-option w-full h-full flex justify-between items-center" @click="toggleDropdown">
      <span class="device-label w-11/12 flex justify-start items-center font-semibold capitalize pl-2 mr-0">
        {{ selectedDevice.label || "Default Device" }}
      </span>
      <img
        class="mr-2"
        :style="{ transform: dropdownVisible ? 'rotate(0deg)' : 'rotate(180deg)' }"
        src="/img/icon/control-page-icons/arrow-up-1.png"
        alt="topDown"
      />
    </div>
    <ul
      v-if="dropdownVisible"
      class="dropdown-audio-output w-72 h-fit absolute z-50 bg-teal-600 text-wrap text-sm font-serif font-medium p-1 top-18 right-4 rounded-md text-[#e6e4e4]"
      @mouseleave="closeDropdown"
    >
      <li class="cursor-pointer mt-1 p-1 rounded-md" @click="selectDevice({ deviceId: 'default', label: 'Default Device' })">
        Default Device
      </li>

      <li
        v-for="device in audioOutputDevices"
        :key="device.deviceId"
        class="cursor-pointer mt-1 p-1 rounded-md"
        @click="selectDevice(device)"
      >
        {{ device.label || `Device ${device.deviceId.substring(0, 5)}...` }}
      </li>

      <li v-if="audioOutputDevices.length === 0 && !isLoading" class="mt-1 p-1 text-yellow-200">No audio output devices found</li>

      <li v-if="isLoading" class="mt-1 p-1">Loading devices...</li>

      <li v-if="errorMessage" class="mt-1 p-1 text-red-200">
        {{ errorMessage }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useLangStore } from "@/store/languages";

const langStore = useLangStore();

const audioOutputDevices = ref([]);
const selectedDevice = ref({ deviceId: "default", label: "Default Device" });
const dropdownVisible = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;

  if (dropdownVisible.value) {
    getAudioDevices();
  }
};

const closeDropdown = () => {
  dropdownVisible.value = false;
};

const selectDevice = (device) => {
  selectedDevice.value = device;
  langStore.selectedDeviceId = device.deviceId;

  closeDropdown();
};

onMounted(() => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.error("This browser doesn't support the Audio Output Devices API");
    errorMessage.value = "Your browser doesn't support audio device selection";
    return;
  }

  getAudioDevices();
});

const getAudioDevices = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();

    const outputDevices = devices.filter((device) => device.kind === "audiooutput");
    const hasLabels = outputDevices.some((device) => device.label);

    if (!hasLabels) {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const devicesWithLabels = await navigator.mediaDevices.enumerateDevices();
      audioOutputDevices.value = devicesWithLabels.filter((device) => device.kind === "audiooutput");
    } else {
      audioOutputDevices.value = outputDevices;
    }

    if (audioOutputDevices.value.length > 0 && !langStore.selectedDeviceId) {
      langStore.selectedDeviceId = audioOutputDevices.value[0].deviceId;
      selectedDevice.value = audioOutputDevices.value[0];
    }

    if (langStore.selectedDeviceId) {
      const storedDevice = audioOutputDevices.value.find((device) => device.deviceId === langStore.selectedDeviceId);

      if (storedDevice) {
        selectedDevice.value = storedDevice;
      }
    }
  } catch (error) {
    console.error("Error accessing media devices:", error);

    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      errorMessage.value = "Permission denied. Please allow microphone access.";
    } else if (error.name === "NotFoundError") {
      errorMessage.value = "No audio devices found.";
    } else {
      errorMessage.value = "Error accessing audio devices.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.selected-option {
  color: #eee;
}
.selected-option img {
  width: 15px;
  height: 15px;
  transition: 0.3s;
  transform: rotate(180deg);
}

.device-label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.75rem;
}

.dropdown-audio-output span:hover {
  background: #a1c1ad;
  cursor: pointer;
}
.dropdown-audio-output li:hover {
  background-color: #17a2b8;
  color: #000 !important;
}
</style>
