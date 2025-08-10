import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FormSchema } from '../../types/formsTypes';

export interface FormItems {
    items: FormSchema[]
}


const loadFromLocalStorage = (): FormSchema[] => {
    try {
        const data = localStorage.getItem('savedForms');
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const saveToLocalStorage = (forms: FormSchema[]) => {
    try {
        localStorage.setItem('savedForms', JSON.stringify(forms));
    } catch (error) {
        console.error("Failed to save forms:", error);
    }
};

const initialState: FormItems = { items: loadFromLocalStorage() };

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        initialisation(state) {
            const data = JSON.parse(localStorage.getItem('savedForms') || '[]')
            state.items = data
            saveToLocalStorage(state.items);
        },
        addItem(state, action: PayloadAction<FormSchema>) {
            state.items.push(action.payload);
            saveToLocalStorage(state.items);
        },
        removeItem(state, action: PayloadAction<string>) {
            state.items = state.items.filter(item => item.id !== action.payload);
            saveToLocalStorage(state.items);
        },
        updateItem(state, action: PayloadAction<{ id: string, changes: FormSchema }>) {
            const { id, changes } = action.payload;
            const existing = state.items.find(item => item.id === id);
            if (existing) {
                Object.assign(existing, changes);
                saveToLocalStorage(state.items);
            }
        },
        clearAll(state) {
            state.items = [];
            saveToLocalStorage(state.items);
        }
    }
});

export const { addItem, removeItem, updateItem, initialisation, clearAll } = formSlice.actions;
export default formSlice.reducer;
