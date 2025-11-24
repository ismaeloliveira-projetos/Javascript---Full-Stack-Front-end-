import { create } from 'zustand';

interface NotificationState {
  message: string;
  type: 'success' | 'error' | '';
  show: boolean;
  setNotification: (msg: string, type: 'success' | 'error') => void;
  clearNotification: () => void;
}

export const useNotification = create<NotificationState>((set) => ({
  message: '',
  type: '',
  show: false,
  setNotification: (msg, type) => set({ message: msg, type, show: true }),
  clearNotification: () => set({ message: '', type: '', show: false }),
}));
