import { LOGIN_STEPS } from "@/constants/loginSteps";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const initialState = {
  show: true,
  step: LOGIN_STEPS.LOGIN,
  phone: undefined,
};

export const useAuthStore = create()(
  persist(
    immer((set) => ({
      ...initialState,

      handleStep: (step) => {
        set((state) => {
          state.show = false;
        });

        setTimeout(() => {
          set((state) => {
            state.show = true;
            state.step = step;
          });
        }, 600);
      },
      handlePhone: (phone) =>
        set((state) => {
          state.phone = phone;
        }),

      reset: () => {
        set(() => initialState);
      },
    })),
    {
      name: "auth",

      // sessionStorage
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
