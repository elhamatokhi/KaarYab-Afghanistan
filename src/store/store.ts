import { configureStore } from "@reduxjs/toolkit";
import savedOpportunitiesReducer from "@/features/saved/saved-opportunities-slice";

export function makeStore() {
  return configureStore({
    reducer: {
      savedOpportunities: savedOpportunitiesReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
