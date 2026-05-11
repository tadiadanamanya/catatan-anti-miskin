<template>
  <div class="scanner-wrapper">
    <!-- Hidden file input triggered by button in parent -->
    <input
      type="file"
      accept="image/*"
      capture="environment"
      ref="fileInput"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Neobrutalism Loading Overlay -->
    <div v-if="isScanning" class="neo-overlay">
      <div class="neo-box scanning-box">
        <h2 class="scanning-title">SCANNING RECEIPT...</h2>
        <p class="scanning-subtitle">DO NOT CLOSE!</p>
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useOCR } from '../composables/useOCR';

const emit = defineEmits(['scanComplete']);

const fileInput = ref(null);
const { isScanning, scanImage, extractedAmount, extractedText, error } = useOCR();

// Method to be called by parent to trigger the camera/file picker
const triggerScan = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  await scanImage(file);

  if (!error.value) {
    // Emit the event to parent (Dashboard) to open TransactionModal
    emit('scanComplete', {
      amount: extractedAmount.value || 0,
      text: extractedText.value || 'No text recognized'
    });
  } else {
    alert(error.value);
  }

  // Reset input so the same file can be selected again if needed
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

defineExpose({
  triggerScan
});
</script>

<style scoped>
.hidden {
  display: none;
}

/* Neobrutalism UI for Loading Overlay */
.neo-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.neo-box {
  background-color: #facc15; /* Bright Yellow */
  border: 4px solid #000;
  box-shadow: 8px 8px 0px #000;
  padding: 2rem;
  text-align: center;
  max-width: 90%;
}

.scanning-title {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 900;
  font-size: 1.5rem;
  color: #000;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
}

.scanning-subtitle {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  font-size: 1rem;
  color: #000;
  margin: 0 0 1.5rem 0;
}

/* Simple Neobrutalism spinner: a spinning square */
.spinner {
  width: 40px;
  height: 40px;
  background-color: #fff;
  border: 4px solid #000;
  margin: 0 auto;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
