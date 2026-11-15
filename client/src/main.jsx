import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EventsProvider } from "./Context/EventsContext";
import { RegistrationsProvider } from "./Context/RegistrationsContext";
import App from "./App";
import { PageProvider } from "./Context/PageContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EventsProvider>
      <RegistrationsProvider>
        <PageProvider>
          <App />
        </PageProvider>
      </RegistrationsProvider>
    </EventsProvider>
  </StrictMode>,
);
