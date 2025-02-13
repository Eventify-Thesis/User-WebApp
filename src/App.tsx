import "./App.css";
import { AppRouter } from "./components/router/AppRouter";
import { useLanguage } from "./hooks/useLanguage";

function App() {
  const { language } = useLanguage();
  return <AppRouter />;
}

export default App;
