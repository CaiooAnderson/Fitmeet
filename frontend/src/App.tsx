import AppRoutes from "./routes/Router";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster richColors position="bottom-center" />
    </>
  );
}

export default App;
