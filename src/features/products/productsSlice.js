import { createSlice } from '@reduxjs/toolkit';
import { generateId } from '../../utils/helpers';

const initialState = {
  items: [],
  loaded: false,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    productsLoaded(state, action) {
      state.items = action.payload;
      state.loaded = true;
    },
    productAdded: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare({ name, price, categoryId, description, available }) {
        const now = Date.now();
        return {
          payload: {
            id: generateId('prod'),
            name,
            price,
            categoryId,
            description: description || '',
            available: available !== undefined ? available : true,
            createdAt: now,
            updatedAt: now,
          },
        };
      },
    },
    productUpdated(state, action) {
      const { id, changes } = action.payload;
      const product = state.items.find((item) => item.id === id);
      if (product) {
        Object.assign(product, changes, { updatedAt: Date.now() });
      }
    },
    productDeleted(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    productAvailabilityToggled(state, action) {
      const product = state.items.find((item) => item.id === action.payload);
      if (product) {
        product.available = !product.available;
        product.updatedAt = Date.now();
      }
    },
    productsReplaced(state, action) {
      state.items = action.payload;
    },
  },
});

export const {
  productsLoaded,
  productAdded,
  productUpdated,
  productDeleted,
  productAvailabilityToggled,
  productsReplaced,
} = productsSlice.actions;

export default productsSlice.reducer;

// Selectors
export const selectAllProducts = (state) => state.products.items;
export const selectAvailableProducts = (state) =>
  state.products.items.filter((p) => p.available);
export const selectProductsByCategory = (state, categoryId) =>
  state.products.items.filter((p) => p.categoryId === categoryId);
export const selectProductById = (state, id) =>
  state.products.items.find((p) => p.id === id);
