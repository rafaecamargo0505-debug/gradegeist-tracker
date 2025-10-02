import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { z } from "zod";

const alunoSchema = z.object({
  nome_completo: z.string().trim().min(1, { message: "Nome completo é obrigatório" }).max(100),
  matricula: z.string().trim().min(1, { message: "Matrícula é obrigatória" }).max(20),
  email: z.string().trim().email({ message: "Email inválido" }).max(255),
  curso: z.string().trim().min(1, { message: "Curso é obrigatório" }).max(100),
});

export default function NovoAluno() {
  const [formData, setFormData] = useState({
    nome_completo: "",
    matricula: "",
    email: "",
    curso: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    const validation = alunoSchema.safeParse(formData);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("alunos")
        .insert([{ ...formData, user_id: user?.id }]);

      if (error) {
        if (error.message.includes("unique")) {
          if (error.message.includes("matricula")) {
            toast.error("Matrícula já cadastrada");
          } else if (error.message.includes("email")) {
            toast.error("Email já cadastrado");
          } else {
            toast.error("Dados duplicados");
          }
        } else {
          throw error;
        }
      } else {
        toast.success("Aluno cadastrado com sucesso!");
        navigate("/alunos");
      }
    } catch (error: any) {
      toast.error("Erro ao cadastrar aluno");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Button
          variant="outline"
          onClick={() => navigate("/alunos")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Novo Aluno</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome_completo">Nome Completo *</Label>
                <Input
                  id="nome_completo"
                  name="nome_completo"
                  value={formData.nome_completo}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula *</Label>
                <Input
                  id="matricula"
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="curso">Curso *</Label>
                <Input
                  id="curso"
                  name="curso"
                  value={formData.curso}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  maxLength={100}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/alunos")}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
