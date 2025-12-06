// Redux and redux toolkit
// 1. User logs in → dispatch(login(userData))
// 2. Redux updates global state
// 3. Navbar auto-updates with user name
// 4. Dashboard shows user stats
// 5. Profile page shows user data
// 6. Logout → dispatch(logout())
// 7. All components auto-clear user data
// ✅ User authentication state
// ✅ Shopping cart (e-commerce)
// ✅ Theme/Preferences  
// ✅ Notifications
// ✅ Multi-step forms
// ✅ Complex app state

// ❌ Simple local state (use useState)
// ❌ Form inputs (use local state)
// ❌ UI toggle states

import { configureStore,combineReducers } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import  useReducer  from "./reducer/userSlice";


const persistConfig = {
    key:"root",
    version:1,
    storage,
}
 const rootReducer = combineReducers({
    user:useReducer,
 });

 const persistedReducer = persistReducer(persistConfig,rootReducer);

 export const store= configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=>
         getDefaultMiddleware({
            serializableCheck:{
                ignoreActions:[
                    FLUSH,REHYDRATE,PAUSE,PERSIST,REGISTER
                ]
            }
         })
 });

 export const persistor= persistStore(store);