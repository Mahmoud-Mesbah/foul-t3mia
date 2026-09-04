import { createSlice } from '@reduxjs/toolkit';
import { generateId } from '../../utils/helpers';

const initialState = {
  items: [],
  loaded: false,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    categoriesLoaded(state, action) {
      state.items = action.payload;
      state.loaded = true;
    },
    categoryAdded: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare({ name }) {
        return {
          payload: {
            id: generateId('cat'),
            name,
            order: 0,
            active: true,
            createdAt: Date.now(),
          },
        };
      },
    },
    categoryUpdated(state, action) {
      const { id, changes } = action.payload;
      const category = state.items.find((item) => item.id === id);
      if (category) Object.assign(category, changes);
    },
    categoryDeleted(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    categoryToggled(state, action) {
      const category = state.items.find((item) => item.id === action.payload);
      if (category) category.active = !category.active;
    },
    categoriesReordered(state, action) {
      // payload: array of ids in new order
      action.payload.forEach((id, index) => {
        const category = state.items.find((item) => item.id === id);
        if (category) category.order = index;
      });
    },
    categoriesReplaced(state, action) {
      state.items = action.payload;
    },
  },
});

export const {
  categoriesLoaded,
  categoryAdded,
  categoryUpdated,
  categoryDeleted,
  categoryToggled,
  categoriesReordered,
  categoriesReplaced,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;

export const selectAllCategories = (state) =>
  [...state.categories.items].sort((a, b) => a.order - b.order);
export const selectActiveCategories = (state) =>
  selectAllCategories(state).filter((c) => c.active);
export const selectCategoryById = (state, id) =>
  state.categories.items.find((c) => c.id === id);
