<template>
    <div class="container">
      <h1 class="title">Expense Tracker</h1>
      <div class="row">

        <div class="col-md-4">
          <form @submit.prevent="addExpense">
            <div class="form-group">
              <label for="item">Item:</label>
              <input type="text" class="form-control" v-model="item" id="item">
            </div>
            <div class="form-group">
              <label for="category">Category:</label>
              <select class="form-control" v-model="category" id="category">
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div class="form-group">
              <label for="amount">Amount:</label>
              <input type="number" class="form-control" v-model="amount" id="amount">
            </div>
            <button type="submit" class="btn btn-pink mt-2">{{ buttonText }}</button>
          </form>
        </div>
    
        <div class="col-md-8">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="expense in expenses" :key="expense.id">
                  <td>{{ formatDateTime(expense.data.datetime) }}</td>
                  <td>{{ expense.data.item }}</td>
                  <td>{{ expense.data.category }}</td>
                  <td>{{ expense.data.amount }}</td>
                  <td class="btn-group">
                    <button @click="onEdit(expense.id)" class="btn btn-pink">Edit</button>
                    <button @click="onDelete(expense.id)" class="btn btn-del">Delete</button>
                  </td>

                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="footer">
        <table class="table">
          <tfoot>
            <tr>
              <td colspan="3"></td>
              <td><strong>Total:</strong></td>
              <td>{{ totalAmount }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { collection, onSnapshot, addDoc, deleteDoc, setDoc, doc } from 'firebase/firestore';
  import db from './firebase/config.js';
  import {onMounted, ref} from 'vue';
  import { computed } from 'vue';
  
  const expenses = ref([]);
  const item = ref('');
  const category = ref('');
  const amount = ref('');
  const Edit = ref(false);
  const editId = ref(null);
  
  const buttonText = computed(() => {
    return Edit.value ? 'Save Expense' : 'Add Expense';
  });
  
  const getExpenses = async () => {
    onSnapshot(collection(db, 'ExpenseTracker'), (querySnap) => {
      const tmp = [];
      querySnap.forEach((doc) => {
        const expense = {
          id: doc.id,
          data: doc.data()
        };
        tmp.push(expense);
      });
      expenses.value = tmp;
  
      expenses.value.sort((a, b) => a.data.datetime - b.data.datetime);
    });
  };
  
const addExpense = async () => {
    if (!item.value.trim() || !category.value.trim() || !amount.value.toString().trim()) {
      alert('Fill up all fields.');
      return;
    }
  
    const data = {
      datetime: new Date(),
      item: item.value,
      category: category.value,
      amount: amount.value
    };
  
    if (Edit.value) {
      await updateExpense(editId.value, data);
    } else {
      await addDoc(collection(db, 'ExpenseTracker'), data);
    }
  
    item.value = '';
    category.value = '';
    amount.value = '';
    Edit.value = false;
    editId.value = null;
  };
  
const onDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this?");
    if (confirmDelete) {
      await deleteDoc(doc(db, 'ExpenseTracker', id));
      expenses.value = expenses.value.filter((expense) => expense.id !== id);
    }
};
  
const onEdit = async (id) => {
    const expense = expenses.value.find((expense) => expense.id === id);
  
    item.value = expense.data.item;
    category.value = expense.data.category;
    amount.value = expense.data.amount;
    Edit.value = true;
    editId.value = id;
};
  
const updateExpense = async (id, data) => {
    await setDoc(doc(db, 'ExpenseTracker', id), data);
};
  
const formatDateTime = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
      return 'Invalid Date';
    }
  
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    return date.toLocaleString();
};
  
onMounted(() => {
    getExpenses();
});
  
const totalAmount = computed(() => {
    let sum = 0;
    for (const expense of expenses.value) {
      sum += parseFloat(expense.data.amount);
    }
    return sum.toFixed(2);
});
  </script>
  
  <style scoped>
  .title{
    color: rgb(255, 219, 247);
    text-shadow:2px 2px rgb(249, 81, 193);
  }
  .container {
    position: relative;
    height: 99vh;
  }
  
  .table-container {
    height: calc(110vh - 200px); 
    overflow-y: auto;
  }
  
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  .btn-pink{
    background-color: rgb(255, 181, 221);
    color: white;
  }

  .btn-del{
    background-color: rgb(255, 107, 188);
    color: white;
  }
  </style>
  