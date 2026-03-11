/**
 * Ícones diferenciados por disciplina/matéria
 * Mapeia nomes de disciplinas para ícones Ionicons
 */

const SUBJECT_ICON_MAP = [
  { keywords: ['mobile', 'programação mobile', 'react native', 'expo', 'app'], icon: 'phone-portrait-outline' },
  { keywords: ['banco de dados', 'dados', 'sql', 'nosql', 'modelagem'], icon: 'server-outline' },
  { keywords: ['web', 'desenvolvimento web', 'frontend', 'react', 'vue'], icon: 'globe-outline' },
  { keywords: ['algoritmos', 'programação', 'código', 'software', 'análise de sistemas'], icon: 'code-slash-outline' },
  { keywords: ['data science', 'ciência de dados', 'analytics', 'big data'], icon: 'analytics-outline' },
  { keywords: ['interface', 'ui', 'ux', 'design', 'acessibilidade'], icon: 'color-palette-outline' },
  { keywords: ['acessibilidade', 'inclusão'], icon: 'accessibility-outline' },
  { keywords: ['modelagem', 'modelo'], icon: 'layers-outline' },
  { keywords: ['matemática', 'cálculo', 'estatística'], icon: 'calculator-outline' },
  { keywords: ['gestão', 'administração', 'projeto', 'gestão de pessoas', 'contabilidade', 'marketing', 'logística empresarial'], icon: 'briefcase-outline' },
  { keywords: ['redes', 'infraestrutura', 'segurança da informação'], icon: 'git-branch-outline' },
  { keywords: ['enfermagem', 'anatomia', 'fisiologia', 'semiologia', 'semiotécnica'], icon: 'medkit-outline' },
  { keywords: ['estoques', 'transporte', 'distribuição', 'compras', 'suprimentos'], icon: 'cube-outline' },
  { keywords: ['estética', 'facial', 'corporal', 'cosmetologia'], icon: 'sparkles-outline' },
  { keywords: ['nutrição', 'dietética', 'clínica', 'higiene', 'segurança alimentar'], icon: 'nutrition-outline' },
  { keywords: ['recrutamento', 'seleção', 'treinamento', 'desenvolvimento', 'recursos humanos', 'legislação trabalhista'], icon: 'people-outline' },
  { keywords: ['segurança do trabalho', 'nrs', 'normas', 'ergonomia', 'prevenção', 'acidentes'], icon: 'shield-checkmark-outline' },
  { keywords: ['agronegócio', 'rural', 'agricultura', 'pecuária', 'comercialização agrícola'], icon: 'leaf-outline' },
  { keywords: ['farmácia', 'medicamentos', 'farmacologia', 'manipulação'], icon: 'flask-outline' },
];

const DEFAULT_ICON = 'book-outline';

/**
 * Retorna o ícone Ionicons para uma disciplina pelo nome
 * @param {string} subjectName - Nome da disciplina
 * @returns {string} Nome do ícone Ionicons
 */
export const getSubjectIcon = (subjectName) => {
  if (!subjectName || typeof subjectName !== 'string') return DEFAULT_ICON;
  const lower = subjectName.toLowerCase().trim();
  for (const { keywords, icon } of SUBJECT_ICON_MAP) {
    if (keywords.some((k) => lower.includes(k))) return icon;
  }
  return DEFAULT_ICON;
};
