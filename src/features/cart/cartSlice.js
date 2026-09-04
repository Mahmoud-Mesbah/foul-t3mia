import { createSlice } from '@reduxjs/toolkit';
import { roundMoney } from '../../utils/helpers';

const initialState = {
  items: [], // { productId, name, price, quantity, note }
  discountType: 'fixed', // 'fixed' | 'percentage'
  discountValue: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    cartRestored(state, action) {
      return { ...initialState, ...action.payload };
    },
    itemAdded(state, action) {
      const { product } = action.payload;
      const existing = state.items.find((i) => i.productId === product.id && !i.note);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          note: '',
        });
      }
    },
    quantityIncreased(state, action) {
      const item = state.items[action.payload];
      if (item) item.quantity += 1;
    },
    quantityDecreased(state, action) {
      const item = state.items[action.payload];
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.items.splice(action.payload, 1);
        }
      }
    },
    itemRemoved(state, action) {
      state.items.splice(action.payload, 1);
    },
    itemNoteChanged(state, action) {
      const { index, note } = action.payload;
      const item = state.items[index];
      if (item) item.note = note;
    },
    discountChanged(state, action) {
      const { discountType, discountValue } = action.payload;
      state.discountType = discountType;
      state.discountValue = roundMoney(Math.max(0, Number(discountValue) || 0));
    },
    cartCleared() {
      return initialState;
    },
  },
});

export const {
  cartRestored,
  itemAdded,
  quantityIncreased,
  quantityDecreased,
  itemRemoved,
  itemNoteChanged,
  discountChanged,
  cartCleared,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors — keep derived money calculations here, not stored in state.
export const selectCartItems = (state) => state.cart.items;

export const selectCartSubtotal = (state) =>
  roundMoney(
    state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

export const selectCartTotalQuantity = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartDiscountAmount = (state) => {
  const subtotal = selectCartSubtotal(state);
  const { discountType, discountValue } = state.cart;
  if (discountType === 'percentage') {
    return roundMoney(Math.min(subtotal, subtotal * (discountValue / 100)));
  }
  return roundMoney(Math.min(subtotal, discountValue));
};

export const selectCartTotal = (state) => {
  const subtotal = selectCartSubtotal(state);
  const discount = selectCartDiscountAmount(state);
  return roundMoney(Math.max(0, subtotal - discount));
};
