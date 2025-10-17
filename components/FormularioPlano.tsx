'use client';

import { useState } from 'react';
import { PlanoAulaInput } from '@/types';

interface Props {
  onPlanoGerado: (plano: any) => void;
}

export default function FormularioPlano({ onPlanoGerado }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recursos, setRecursos] = useState<string[]>([]);
  const [objetivos, setObjetivos] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    const disciplina = formData.get('disciplina') as string;
    const anoEscolar = formData.get('anoEscolar') as string;
    const tema = formData.get('tema') as string;
    const duracaoMinutos = parseInt(formData.get('duracaoMinutos') as string);
    const nivelTurma = formData.get('nivelTurma') as string;

    if (!disciplina || disciplina.length < 2) {
      setError('Disciplina deve ter pelo menos 2 caracteres');
      setLoading(false);
      return;
    }

    if (!anoEscolar || anoEscolar.length < 2) {
      setError('Ano escolar deve ter pelo menos 2 caracteres');
      setLoading(false);
      return;
    }

    if (!tema || tema.length < 3) {
      setError('Tema deve ter pelo menos 3 caracteres');
      setLoading(false);
      return;
    }

    if (!duracaoMinutos || duracaoMinutos < 10 || duracaoMinutos > 300) {
      setError('Duração deve estar entre 10 e 300 minutos');
      setLoading(false);
      return;
    }

    if (!nivelTurma) {
      setError('Selecione o nível da turma');
      setLoading(false);
      return;
    }

    const input: PlanoAulaInput = {
      disciplina,
      anoEscolar,
      tema,
      duracaoMinutos,
      nivelTurma: nivelTurma as 'inicial' | 'intermediario' | 'avancado',
      objetivosBncc: objetivos.length > 0 ? objetivos : undefined,
      recursosDisponiveis: recursos.length > 0 ? recursos : undefined,
      metodologiaPreferida: (formData.get('metodologiaPreferida') as string) || undefined,
      observacoesAdicionais: (formData.get('observacoesAdicionais') as string) || undefined,
    };

    try {
      const res = await fetch('/api/gerar-plano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao gerar plano');
      }

      onPlanoGerado(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function addRecurso(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !recursos.includes(value)) {
        setRecursos([...recursos, value]);
        e.currentTarget.value = '';
      }
    }
  }

  function addObjetivo(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !objetivos.includes(value)) {
        setObjetivos([...objetivos, value]);
        e.currentTarget.value = '';
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerador de Planos de Aula</h1>
        <p className="text-gray-600 mt-2">Preencha os campos para criar um plano personalizado</p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Disciplina *</label>
        <input
          type="text"
          name="disciplina"
          required
          minLength={2}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Matemática"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Ano Escolar *</label>
        <input
          type="text"
          name="anoEscolar"
          required
          minLength={2}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: 7º ano"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Tema *</label>
        <input
          type="text"
          name="tema"
          required
          minLength={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Equações do primeiro grau"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Duração (min) *</label>
          <input
            type="number"
            name="duracaoMinutos"
            required
            min="10"
            max="300"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Nível da Turma *</label>
          <select
            name="nivelTurma"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione</option>
            <option value="inicial">Inicial</option>
            <option value="intermediario">Intermediário</option>
            <option value="avancado">Avançado</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Objetivos BNCC</label>
        <input
          type="text"
          onKeyDown={addObjetivo}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite e pressione Enter (Ex: EF07MA15)"
        />
        {objetivos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {objetivos.map((obj, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {obj}
                <button
                  type="button"
                  onClick={() => setObjetivos(objetivos.filter((_, idx) => idx !== i))}
                  className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Recursos Disponíveis</label>
        <input
          type="text"
          onKeyDown={addRecurso}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite e pressione Enter (Ex: projetor)"
        />
        {recursos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {recursos.map((rec, i) => (
              <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {rec}
                <button
                  type="button"
                  onClick={() => setRecursos(recursos.filter((_, idx) => idx !== i))}
                  className="ml-2 text-green-600 hover:text-green-800 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Metodologia Preferida</label>
        <input
          type="text"
          name="metodologiaPreferida"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Aprendizagem ativa"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Observações Adicionais</label>
        <textarea
          name="observacoesAdicionais"
          maxLength={500}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Informações extras sobre a turma ou preferências"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
      >
        {loading ? 'Gerando plano...' : 'Gerar Plano de Aula'}
      </button>
    </form>
  );
}