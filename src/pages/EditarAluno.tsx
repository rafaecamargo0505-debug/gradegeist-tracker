import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function EditarAluno() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nome_completo: "",
    matricula: "",
    email: "",
    curso: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAluno();
  }, [id]);

  const fetchAluno = async () => {
    try {
      const { data, error } = await supabase
        .from("alunos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setFormData({
        nome_completo: data.nome_completo,
        matricula: data.matricula,
        email: data.email,
        curso: data.curso,
      });
    } catch (error: any) {
      toast.error("Erro ao carregar aluno");
      console.error(error);
      navigate("/alunos");
    } finally {
      setLoading(false);
    }
  };

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

    setSaving(true);

    try {
      const { error } = await supabase
        .from("alunos")
        .update(formData)
        .eq("id", id);

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
        toast.success("Aluno atualizado com sucesso!");
        navigate("/alunos");
      }
    } catch (error: any) {
      toast.error("Erro ao atualizar aluno");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <CardTitle className="text-2xl font-bold">Editar Aluno</CardTitle>
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
                  disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
                  maxLength={100}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/alunos")}
                  disabled={saving}
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
