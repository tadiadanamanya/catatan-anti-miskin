<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-neo-cream border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold border-b-2 border-black pb-2 mb-4">Add Transaction</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">

        <!-- Type -->
        <div>
          <label class="block font-bold mb-1">Type</label>
          <div class="flex space-x-4">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" v-model="form.type" value="income" class="form-radio border-2 border-black h-5 w-5 text-black focus:ring-black" required>
              <span class="font-bold">Income</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" v-model="form.type" value="expense" class="form-radio border-2 border-black h-5 w-5 text-black focus:ring-black" required>
              <span class="font-bold">Expense</span>
            </label>
          </div>
        </div>

        <!-- Amount -->
        <div>
          <label class="block font-bold mb-1">Amount (IDR)</label>
          <input type="number" v-model.number="form.amount" class="w-full border-2 border-black rounded-none p-2 focus:outline-none focus:ring-2 focus:ring-black bg-white" required min="0">
        </div>

        <!-- Category -->
        <div>
          <label class="block font-bold mb-1">Category</label>
          <input type="text" v-model="form.category" class="w-full border-2 border-black rounded-none p-2 focus:outline-none focus:ring-2 focus:ring-black bg-white" required placeholder="e.g. Food, Salary">
        </div>

        <!-- Date -->
        <div>
          <label class="block font-bold mb-1">Date</label>
          <input type="date" v-model="form.date" class="w-full border-2 border-black rounded-none p-2 focus:outline-none focus:ring-2 focus:ring-black bg-white" required>
        </div>

        <!-- Note -->
        <div>
          <label class="block font-bold mb-1">Note (Optional)</label>
          <input type="text" v-model="form.note" class="w-full border-2 border-black rounded-none p-2 focus:outline-none focus:ring-2 focus:ring-black bg-white" placeholder="Extra details...">
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-4 pt-4 border-t-2 border-black mt-6">
          <button type="button" @click="closeModal" class="px-4 py-2 bg-white border-2 border-black font-bold hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-yellow-400 border-2 border-black font-bold hover:bg-yellow-500 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'save']);

const form = reactive({
  type: 'expense',
  amount: null,
  category: '',
  date: new Date().toISOString().split('T')[0], // Default to today
  note: ''
});

const closeModal = () => {
  emit('close');
};

const handleSubmit = () => {
  emit('save', { ...form });
  // Reset form
  form.type = 'expense';
  form.amount = null;
  form.category = '';
  form.date = new Date().toISOString().split('T')[0];
  form.note = '';
  closeModal();
};
</script>

<style scoped>
/* Added a custom color for bg-neo-cream if not in tailwind config */
.bg-neo-cream {
  background-color: #fdfbf7;
}
</style>
