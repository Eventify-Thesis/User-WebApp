import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { AppRouter } from "./components/router/AppRouter";
import { useLanguage } from "./hooks/useLanguage";

function App() {
  const {language} = useLanguage();


  return <AppRouter>
}

export default App;
