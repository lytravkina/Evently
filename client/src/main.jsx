import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Header from "./Header/Header.jsx";
import Hero from "./Hero/Hero.jsx";

createRoot(document.getElementById("header")).render(
  <StrictMode>
    <Header />
  </StrictMode>,
);

createRoot(document.getElementById("hero")).render(
  <StrictMode>
    <Hero />
  </StrictMode>,
);
