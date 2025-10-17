'use client';

import { useState } from 'react';
import FormularioPlano from '@/components/FormularioPlano';
import PlanoGerado from '@/components/PlanoGerado';
import { LessonPlanDB } from '@/types';

export default function Home() {
  const [plano, setPlano] = useState<LessonPlanDB | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      {!plano ? (
        <FormularioPlano onPlanoGerado={setPlano} />
      ) : (
        <div className="space-y-6">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => setPlano(null)}
              className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 font-semibold shadow-md transition-colors"
            >
              ← Criar Novo Plano
            </button>
          </div>
          <PlanoGerado 
            plano={plano.plano_gerado} 
            tema={plano.tema} 
            disciplina={plano.disciplina} 
            anoEscolar={plano.ano_escolar} 
            duracao={plano.duracao_minutos} 
          />
        </div>
      )}
    </main>
  );
}