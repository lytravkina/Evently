import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { EventsProvider } from "./Context/EventsContext";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <EventsProvider> */}
    <App />
    {/* </EventsProvider> */}
  </StrictMode>,
);
