import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { FlowState } from '@/types/api_types/flowStateSchema'

import flowReducer from './flowSlice'
import nodeTypesReducer, { NodeTypesState } from './nodeTypesSlice'
import panelReducer from './panelSlice'
import userPreferencesReducer from './userPreferencesSlice'

// Define the RootState type
export interface RootState {
    flow: FlowState
    nodeTypes: NodeTypesState
    userPreferences: {
        hasSeenWelcome: boolean
    }
    panel: {
        isNodePanelExpanded: boolean
    }
}

// Define the persist config
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['nodes', 'edges', 'nodeTypes', 'userPreferences'],
}

const rootReducer = combineReducers({
    flow: flowReducer,
    nodeTypes: nodeTypesReducer,
    userPreferences: userPreferencesReducer,
    panel: panelReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})

// Define store types
export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store)
export default store
