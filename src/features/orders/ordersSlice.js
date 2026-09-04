import { createSlice } from '@reduxjs/toolkit';
import { generateId, generateOrderNumber, roundMoney } from '../../utils/helpers';

const initialState = {
  items: [],
  loaded: false,
  sequence: 1,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    ordersLoaded(state, action) {
      state.items = action.payload;
      state.loaded = true;
      state.sequence = action.payload.length + 1;
    },
    orderCompleted: {
      reducer(state, action) {
        state.items.unshift(action.payload);
        state.sequence += 1;
      },
      prepare({ items, subtotal, discount, total, paymentMethod, paidAmount, change }) {
        return {
          payload: {
            id: generateId('order'),
            orderNumber: generateOrderNumber(Date.now() % 10000),
            items,
            subtotal: roundMoney(subtotal),
            discount: roundMoney(discount),
            total: roundMoney(total),
            paymentMethod,
            paidAmount: roundMoney(paidAmount),
            change: roundMoney(change),
            status: 'مكتمل',
            createdAt: Date.now(),
          },
        };
      },
    },
    orderDeleted(state, action) {
      state.items = state.items.filter((o) => o.id !== action.payload);
    },
    ordersReplaced(state, action) {
      state.items = action.payload;
      state.sequence = action.payload.length + 1;
    },
  },
});

export const { ordersLoaded, orderCompleted, orderDeleted, ordersReplaced } =
  ordersSlice.actions;

export default ordersSlice.reducer;

export const selectAllOrders = (state) =>
  [...state.orders.items].sort((a, b) => b.createdAt - a.createdAt);
export const selectOrderById = (state, id) =>
  state.orders.items.find((o) => o.id === id);
