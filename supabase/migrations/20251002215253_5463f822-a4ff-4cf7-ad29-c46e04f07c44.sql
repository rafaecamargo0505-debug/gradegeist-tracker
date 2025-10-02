-- Tabela de Alunos
CREATE TABLE public.alunos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_completo TEXT NOT NULL,
    matricula TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    curso TEXT NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Habilitar Row Level Security
ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: usuários só veem seus próprios alunos
CREATE POLICY "Usuários podem ver seus próprios alunos"
    ON public.alunos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios alunos"
    ON public.alunos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios alunos"
    ON public.alunos FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios alunos"
    ON public.alunos FOR DELETE
    USING (auth.uid() = user_id);

-- Índices para melhor performance
CREATE INDEX idx_alunos_user_id ON public.alunos(user_id);
CREATE INDEX idx_alunos_matricula ON public.alunos(matricula);
CREATE INDEX idx_alunos_email ON public.alunos(email);