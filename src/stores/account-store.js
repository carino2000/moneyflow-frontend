import { create } from "zustand";
import { persist } from "zustand/middleware";

//create 안에 persist 넣으면 새로고침해도 데이터 유지되게 해줌
export const useAccount = create(
  persist(
    (set) => ({
      account: null,
      clearAccount: () => set({ account: null }),
      setAccount: (newAccount) => set({ account: newAccount }),
    }),
    { name: "account-storage" }
  )
);

export const useToken = create(
  persist(
    (set) => ({
      token: null,
      clearToken: () => {
        set({ token: null });
      },
      setToken: function (newToken) {
        set({ token: newToken });
      },
    }),
    { name: "token-storage" }
  )
);
