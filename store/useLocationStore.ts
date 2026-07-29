import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationState {
  address: string;
  lat: number | null;
  lng: number | null;
  setAddress: (address: string) => void;
  setCoordinates: (lat: number, lng: number) => void;
  setLocation: (address: string, lat: number, lng: number) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      address: 'Delivery to Home',
      lat: null,
      lng: null,
      setAddress: (address) => set({ address }),
      setCoordinates: (lat, lng) => set({ lat, lng }),
      setLocation: (address, lat, lng) => set({ address, lat, lng }),
    }),
    {
      name: 'location-storage',
    }
  )
);
