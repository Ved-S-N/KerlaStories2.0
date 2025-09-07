import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Schemes from "./pages/Schemes";
import Deals from "./pages/Deals";
import AddProduct from "./pages/AddProduct";
import Cart from "./pages/Cart";
import Chat from "./pages/Chat";
import Legal from "./pages/Legal";
import News from "./pages/News";
import Alerts from "./pages/Alerts";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/news" element={<News />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
