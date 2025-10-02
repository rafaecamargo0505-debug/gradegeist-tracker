import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { GraduationCap, Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate("/alunos");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-soft">
            <GraduationCap className="w-16 h-16 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Sistema de Gerenciamento de Alunos
        </h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Gerencie seus alunos de forma simples e eficiente
        </p>
        <Button 
          onClick={() => navigate("/login")}
          size="lg"
          className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-soft"
        >
          Acessar Sistema
        </Button>
      </div>
    </div>
  );
};

export default Index;
