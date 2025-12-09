import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import App from "./App.tsx";
import { LocationProvider } from "./contexts/LocationContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LocationProvider>
          <App />
        </LocationProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
