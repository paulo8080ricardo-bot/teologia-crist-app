import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import StudyMaterials from "./pages/StudyMaterials";

/**
 * Design: Sistema de Domínio em Teologia Cristã
 * - Tema: Light (padrão) com suporte a Dark Mode
 * - Paleta: Azul primário (confiança, sabedoria) com acentos em cores por área
 * - Tipografia: Sem Serif para corpo, Bold para títulos
 * - Layout: Dashboard com abas para organização clara
 */

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/study-materials"} component={StudyMaterials} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
