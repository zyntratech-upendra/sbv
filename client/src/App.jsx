import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="flex-grow-1">
        <AppRouter />
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
