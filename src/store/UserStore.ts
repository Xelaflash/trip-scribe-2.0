import type { UserWithTrips } from '../types/user';
import { create } from 'zustand';

interface UserState {
  user: UserWithTrips | null;
  setUser: (user: UserWithTrips) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) =>
    set(() => {
      return { user };
    }),
}));
