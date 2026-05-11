import { ref, computed } from 'vue';
import { collection, onSnapshot, addDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export function useTransactions() {
  const transactions = ref([]);

  // Fetch transactions in real-time
  const fetchTransactions = () => {
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const trans = [];
      querySnapshot.forEach((doc) => {
        trans.push({ id: doc.id, ...doc.data() });
      });
      transactions.value = trans;
    });

    // Return unsubscribe function in case the caller needs to stop listening
    return unsubscribe;
  };

  // Filter for the current month
  const isCurrentMonth = (date) => {
    // Check if the date is a Firestore Timestamp or a JS Date/string
    let jsDate;
    if (date && date.toDate) {
      jsDate = date.toDate();
    } else {
      jsDate = new Date(date);
    }

    const now = new Date();
    return jsDate.getMonth() === now.getMonth() && jsDate.getFullYear() === now.getFullYear();
  };

  const currentMonthTransactions = computed(() => {
    return transactions.value.filter(t => isCurrentMonth(t.date));
  });

  const totalIncome = computed(() => {
    return currentMonthTransactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  });

  const totalExpense = computed(() => {
    return currentMonthTransactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  });

  const totalBalance = computed(() => {
    return totalIncome.value - totalExpense.value;
  });

  const addTransaction = async (transactionData) => {
    try {
      // Ensure date is a Timestamp if it's not already
      let firestoreDate = transactionData.date;
      if (!(firestoreDate instanceof Timestamp)) {
        firestoreDate = Timestamp.fromDate(new Date(transactionData.date));
      }

      await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        amount: Number(transactionData.amount),
        date: firestoreDate
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  };

  return {
    transactions,
    currentMonthTransactions,
    totalBalance,
    totalIncome,
    totalExpense,
    fetchTransactions,
    addTransaction
  };
}
