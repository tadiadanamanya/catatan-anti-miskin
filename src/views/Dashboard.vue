<template>
  <div class="p-8 bg-[#f0f0f0] min-h-screen font-sans">
    <div class="max-w-4xl mx-auto space-y-8">

      <!-- Header -->
      <div class="flex justify-between items-center border-b-4 border-black pb-4">
        <h1 class="text-4xl font-extrabold uppercase tracking-widest">Dashboard</h1>
        <button
          @click="openModal"
          class="px-6 py-3 bg-yellow-400 border-2 border-black font-bold text-lg hover:bg-yellow-500 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]">
          ✍️ Manual Input
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Balance Card -->
        <div class="bg-blue-300 border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 class="text-xl font-bold mb-2 uppercase">Total Balance</h2>
          <p class="text-3xl font-extrabold">{{ formatCurrency(totalBalance) }}</p>
        </div>

        <!-- Income Card -->
        <div class="bg-green-300 border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 class="text-xl font-bold mb-2 uppercase">Total Income</h2>
          <p class="text-3xl font-extrabold">{{ formatCurrency(totalIncome) }}</p>
        </div>

        <!-- Expense Card -->
        <div class="bg-red-300 border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 class="text-xl font-bold mb-2 uppercase">Total Expense</h2>
          <p class="text-3xl font-extrabold">{{ formatCurrency(totalExpense) }}</p>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 class="text-2xl font-bold mb-6 border-b-2 border-black pb-2 uppercase">Recent Transactions</h2>

        <div v-if="transactions.length === 0" class="text-center font-bold py-8 border-2 border-dashed border-black">
          No transactions yet. Start adding some!
        </div>

        <ul v-else class="space-y-4">
          <li v-for="t in transactions" :key="t.id"
              class="flex justify-between items-center border-2 border-black p-4 bg-gray-50 hover:bg-yellow-100 transition-colors">

            <div class="flex flex-col">
              <span class="font-bold text-lg">{{ t.category }}</span>
              <span class="text-sm font-semibold text-gray-600">
                {{ formatDate(t.date) }} <span v-if="t.note">- {{ t.note }}</span>
              </span>
            </div>

            <div :class="{'text-green-600': t.type === 'income', 'text-red-600': t.type === 'expense'}" class="font-extrabold text-xl">
              <span v-if="t.type === 'income'">+</span>
              <span v-else>-</span>
              {{ formatCurrency(t.amount) }}
            </div>

          </li>
        </ul>
      </div>

    </div>

    <!-- Transaction Modal -->
    <TransactionModal
      :isOpen="isModalOpen"
      @close="closeModal"
      @save="handleSaveTransaction"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useTransactions } from '../composables/useTransactions';
import TransactionModal from '../components/TransactionModal.vue';

const {
  transactions,
  totalBalance,
  totalIncome,
  totalExpense,
  fetchTransactions,
  addTransaction
} = useTransactions();

const isModalOpen = ref(false);
let unsubscribe = null;

onMounted(() => {
  unsubscribe = fetchTransactions();
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSaveTransaction = async (data) => {
  try {
    await addTransaction(data);
  } catch (error) {
    alert('Failed to save transaction. Please check console for details.');
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateInput) => {
  if (!dateInput) return '';
  let jsDate;
  if (dateInput.toDate) {
    jsDate = dateInput.toDate();
  } else {
    jsDate = new Date(dateInput);
  }
  return jsDate.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<style scoped>
/* Neobrutalism overrides or extra styles can go here */
</style>
