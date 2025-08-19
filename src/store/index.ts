import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
    persistStore, persistReducer,
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import cancelFlow from "./cancelFlowSlice";

const rootReducer = combineReducers({ cancelFlow });
const persistConfig = { key: "mm.cancelFlow.v1", storage, whitelist: ["cancelFlow"] };
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore redux-persist action types…
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                // …and this field that carry a function on PERSIST
                ignoredActionPaths: ["register"],
            },
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
