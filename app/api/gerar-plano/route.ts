import { NextRequest, NextResponse } from 'next/server';
import { PlanoAulaInputSchema } from '@/types';
import { gerarPlanoAula } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { ZodError } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    let input;
    try {
      input = PlanoAulaInputSchema.parse(body);
    } catch (e) {
      if (e instanceof ZodError) {
        return NextResponse.json(
          { error: 'Dados inválidos', details: e.issues },
          { status: 400 }
        );
      }
      throw e;
    }

    const planoGerado = await gerarPlanoAula(input);

    const { data, error } = await supabase
      .from('lesson_plans')
      .insert({
        user_id: null,
        disciplina: input.disciplina,
        ano_escolar: input.anoEscolar,
        tema: input.tema,
        duracao_minutos: input.duracaoMinutos,
        nivel_turma: input.nivelTurma,
        input_data: input,
        plano_gerado: planoGerado,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar no banco de dados' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('API error:', error);
    
    if (error.message?.includes('Gemini API')) {
      return NextResponse.json(
        { error: 'Erro na API de IA' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}