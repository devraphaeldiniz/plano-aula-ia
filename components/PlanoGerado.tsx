'use client';

import { PlanoAulaOutput } from '@/types';

interface Props {
  plano: PlanoAulaOutput;
  tema: string;
  disciplina: string;
  anoEscolar: string;
  duracao: number;
}

export default function PlanoGerado({ plano, tema, disciplina, anoEscolar, duracao }: Props) {
  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8">
      <div className="border-b-2 border-blue-500 pb-6">
        <h1 className="text-4xl font-bold text-gray-900">{tema}</h1>
        <div className="flex gap-4 mt-3 text-gray-600">
          <span className="bg-blue-100 px-3 py-1 rounded-full text-sm font-medium">{disciplina}</span>
          <span className="bg-green-100 px-3 py-1 rounded-full text-sm font-medium">{anoEscolar}</span>
          <span className="bg-purple-100 px-3 py-1 rounded-full text-sm font-medium">{duracao} minutos</span>
        </div>
      </div>

      <section className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          🎯 Introdução Lúdica
        </h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{plano.introducao_ludica}</p>
      </section>

      <section className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          📚 Objetivos BNCC
        </h2>
        <ul className="list-disc list-inside space-y-2">
          {plano.objetivos_bncc.map((obj, i) => (
            <li key={i} className="text-gray-700 leading-relaxed">{obj}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📝 Passo a Passo
        </h2>
        <div className="space-y-4">
          {plano.passo_a_passo.map((passo, i) => (
            <div key={i} className="bg-gray-50 p-5 rounded-lg border-l-4 border-green-400 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold flex-shrink-0">
                  Etapa {passo.etapa}
                </span>
                <p className="text-gray-700 leading-relaxed">{passo.acao}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          ✅ Rubrica de Avaliação
        </h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b border-gray-300 p-4 text-left font-semibold text-gray-800">Critério</th>
                <th className="border-b border-gray-300 p-4 text-center font-semibold text-gray-800">Início</th>
                <th className="border-b border-gray-300 p-4 text-center font-semibold text-gray-800">Em Desenvolvimento</th>
                <th className="border-b border-gray-300 p-4 text-center font-semibold text-gray-800">Proficiente</th>
              </tr>
            </thead>
            <tbody>
              {plano.rubrica_avaliacao.map((rub, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border-b border-gray-200 p-4 font-medium text-gray-800">{rub.criterio}</td>
                  <td className="border-b border-gray-200 p-4 text-sm text-gray-700">{rub.inicio}</td>
                  <td className="border-b border-gray-200 p-4 text-sm text-gray-700">{rub.em_desenvolvimento}</td>
                  <td className="border-b border-gray-200 p-4 text-sm text-gray-700">{rub.proficiente}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-400">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          💡 Observações
        </h2>
        <p className="text-gray-700 leading-relaxed">{plano.observacoes}</p>
      </section>
    </div>
  );
}