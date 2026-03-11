/**
 * Índice de busca - Itens pesquisáveis do sistema
 * Cada item: { title, subtitle, path, screen, params, icon, keywords }
 * title = termo pesquisado / nome do item
 * subtitle = "O que é" + "local no sistema" (caminho em frase)
 */

export const SEARCH_INDEX = [
  // Acadêmico
  {
    title: 'Acadêmico',
    subtitle: 'Cursos, disciplinas, notas • Mais',
    path: 'Mais > Acadêmico',
    screen: 'Academico',
    icon: 'school',
    keywords: ['academico', 'acadêmico', 'curso', 'cursos', 'disciplina', 'disciplinas', 'nota', 'notas', 'frequencia', 'frequência', 'historico', 'histórico', 'progresso', 'semestre'],
  },
  {
    title: 'Banco de Dados',
    subtitle: 'Disciplina • Acadêmico',
    path: 'Mais > Acadêmico > Disciplinas',
    screen: 'Academico',
    icon: 'layers',
    keywords: ['dados', 'banco', 'bd', 'database', 'sql'],
  },
  {
    title: 'Programação Mobile',
    subtitle: 'Disciplina • Acadêmico',
    path: 'Mais > Acadêmico > Disciplinas',
    screen: 'Academico',
    icon: 'phone-portrait-outline',
    keywords: ['programacao', 'programação', 'mobile', 'react', 'app'],
  },
  {
    title: 'Desenvolvimento Web',
    subtitle: 'Disciplina • Acadêmico',
    path: 'Mais > Acadêmico > Disciplinas',
    screen: 'Academico',
    icon: 'globe-outline',
    keywords: ['desenvolvimento', 'web', 'frontend', 'site'],
  },
  {
    title: 'Técnico em Desenvolvimento de Sistemas',
    subtitle: 'Curso • Acadêmico',
    path: 'Mais > Acadêmico',
    screen: 'Academico',
    icon: 'school',
    keywords: ['desenvolvimento', 'sistemas', 'ti', 'programação', 'curso'],
  },
  {
    title: 'Técnico em Administração',
    subtitle: 'Curso • Acadêmico',
    path: 'Mais > Acadêmico',
    screen: 'Academico',
    icon: 'briefcase',
    keywords: ['administração', 'administracao', 'gestão', 'curso'],
  },
  {
    title: 'Técnico em Enfermagem',
    subtitle: 'Curso • Acadêmico',
    path: 'Mais > Acadêmico',
    screen: 'Academico',
    icon: 'medkit',
    keywords: ['enfermagem', 'saúde', 'saude', 'curso'],
  },
  {
    title: 'Técnico em Redes de Computadores',
    subtitle: 'Curso • Acadêmico',
    path: 'Mais > Acadêmico',
    screen: 'Academico',
    icon: 'git-branch',
    keywords: ['redes', 'computadores', 'ti', 'curso'],
  },
  {
    title: 'Técnico em Logística',
    subtitle: 'Curso • Acadêmico',
    path: 'Mais > Acadêmico',
    screen: 'Academico',
    icon: 'cube',
    keywords: ['logística', 'logistica', 'estoque', 'transporte', 'curso'],
  },
  {
    title: 'Técnico em Estética',
    subtitle: 'Curso • Acadêmico',
    path: 'Mais > Acadêmico',
    screen: 'Academico',
    icon: 'sparkles',
    keywords: ['estética', 'estetica', 'cosmetologia', 'curso'],
  },
  // Documentos
  {
    title: 'Documentos',
    subtitle: 'Diploma, certificados • Mais',
    path: 'Mais > Documentos',
    screen: 'Documentos',
    icon: 'document-text',
    keywords: ['documento', 'documentos', 'diploma', 'certificado', 'certificados', 'boletim', 'boletins'],
  },
  {
    title: 'Diploma',
    subtitle: 'Documento • Mais > Documentos',
    path: 'Mais > Documentos',
    screen: 'Documentos',
    icon: 'ribbon',
    keywords: ['diploma', 'conclusao', 'conclusão', 'formatura'],
  },
  {
    title: 'Certificado',
    subtitle: 'Documento • Mais > Documentos',
    path: 'Mais > Documentos',
    screen: 'Documentos',
    icon: 'document',
    keywords: ['certificado', 'certificados'],
  },
  {
    title: 'Boletim',
    subtitle: 'Documento • Mais > Documentos',
    path: 'Mais > Documentos',
    screen: 'Documentos',
    icon: 'document-text',
    keywords: ['boletim', 'boletins', 'notas', 'resultado'],
  },
  // Integrações
  {
    title: 'Integrações',
    subtitle: 'Sistemas externos • Mais',
    path: 'Mais > Integrações',
    screen: 'Integracoes',
    icon: 'link',
    keywords: ['integração', 'integracoes', 'sistema', 'sistemas', 'externo', 'biblioteca', 'email', 'ajuda'],
  },
  {
    title: 'Biblioteca',
    subtitle: 'Integração • Mais > Integrações',
    path: 'Mais > Integrações',
    screen: 'Integracoes',
    icon: 'library',
    keywords: ['biblioteca', 'livros', 'acervo'],
  },
  {
    title: 'Email institucional',
    subtitle: 'Integração • Mais > Integrações',
    path: 'Mais > Integrações',
    screen: 'Integracoes',
    icon: 'mail',
    keywords: ['email', 'e-mail', 'institucional', 'correio'],
  },
  {
    title: 'Central de ajuda',
    subtitle: 'Integração • Mais > Integrações',
    path: 'Mais > Integrações',
    screen: 'Integracoes',
    icon: 'help-circle',
    keywords: ['ajuda', 'suporte', 'central', 'dúvida', 'duvida'],
  },
  // Presenças
  {
    title: 'Presenças',
    subtitle: 'Registrar presença, frequência • Início',
    path: 'Presenças',
    screen: 'Presencas',
    isTab: true,
    icon: 'checkmark-circle',
    keywords: ['presença', 'presencas', 'frequencia', 'frequência', 'registrar', 'chamada', 'aula'],
  },
  {
    title: 'Registrar presença',
    subtitle: 'Ação • Presenças',
    path: 'Presenças',
    screen: 'Presencas',
    isTab: true,
    icon: 'location',
    keywords: ['registrar', 'presença', 'presenca', 'marcar', 'check-in'],
  },
  // Agenda
  {
    title: 'Agenda',
    subtitle: 'Calendário, aulas do dia • Início',
    path: 'Agenda',
    screen: 'Agenda',
    isTab: true,
    icon: 'calendar',
    keywords: ['agenda', 'calendário', 'calendario', 'aula', 'aulas', 'horário', 'horario'],
  },
  // Financeiro
  {
    title: 'Financeiro',
    subtitle: 'Pagamentos, mensalidades • Início',
    path: 'Financeiro',
    screen: 'Financeiro',
    isTab: true,
    icon: 'wallet',
    keywords: ['financeiro', 'pagamento', 'pagamentos', 'mensalidade', 'boleto', 'cobrança', 'cobranca'],
  },
  // Perfil
  {
    title: 'Perfil',
    subtitle: 'Dados pessoais, curso • Início',
    path: 'Perfil',
    screen: 'Perfil',
    icon: 'person',
    keywords: ['perfil', 'dados', 'pessoal', 'conta', 'avatar'],
  },
  {
    title: 'Alterar senha',
    subtitle: 'Configuração • Perfil',
    path: 'Perfil > Alterar senha',
    screen: 'Perfil',
    icon: 'lock-closed',
    keywords: ['senha', 'alterar', 'trocar', 'password'],
  },
  {
    title: 'Configurações',
    subtitle: 'Notificações, tema, termos • Perfil',
    path: 'Perfil > Configurações',
    screen: 'Configuracoes',
    icon: 'settings',
    keywords: ['configuração', 'configuracoes', 'config', 'tema', 'notificação', 'termos'],
  },
  {
    title: 'Notificações',
    subtitle: 'Alertas e avisos • Início',
    path: 'Notificações',
    screen: 'Notificacoes',
    icon: 'notifications',
    keywords: ['notificação', 'notificacoes', 'alerta', 'aviso', 'mensagem'],
  },
  // Mais
  {
    title: 'Mais',
    subtitle: 'Acadêmico, Documentos, Integrações • Menu',
    path: 'Mais',
    screen: 'Mais',
    isTab: true,
    icon: 'apps',
    keywords: ['mais', 'menu', 'opções', 'opcoes'],
  },
  // Início (aluno)
  {
    title: 'Início',
    subtitle: 'Home, dashboard • Menu',
    path: 'Início',
    screen: 'StudentHome',
    isTab: true,
    icon: 'home',
    keywords: ['início', 'inicio', 'home', 'principal', 'dashboard'],
    userType: 'student',
  },
  // Professor
  {
    title: 'Aulas',
    subtitle: 'Turmas do semestre • Menu',
    path: 'Aulas',
    screen: 'Aulas',
    isTab: true,
    icon: 'book',
    keywords: ['aula', 'aulas', 'turma', 'turmas', 'disciplina'],
    userType: 'teacher',
  },
  {
    title: 'Chamadas',
    subtitle: 'Histórico de chamadas • Menu',
    path: 'Chamadas',
    screen: 'Chamadas',
    isTab: true,
    icon: 'list',
    keywords: ['chamada', 'chamadas', 'lista', 'presença', 'presenca'],
    userType: 'teacher',
  },
  {
    title: 'Iniciar chamada',
    subtitle: 'Ação • Aulas',
    path: 'Aulas > Iniciar chamada',
    screen: 'IniciarChamada',
    icon: 'radio',
    keywords: ['iniciar', 'chamada', 'abrir', 'lista'],
    userType: 'teacher',
  },
  {
    title: 'Lista de presença',
    subtitle: 'Registrar alunos • Chamadas',
    path: 'Chamadas > Lista de presença',
    screen: 'ListaPresenca',
    icon: 'people',
    keywords: ['lista', 'presença', 'presenca', 'alunos', 'registrar'],
    userType: 'teacher',
  },
];

/**
 * Busca no índice por termo
 * @param {string} query - Termo de busca
 * @param {string} userType - 'student' | 'teacher'
 */
export const searchItems = (query, userType = 'student') => {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];

  const results = [];
  const seen = new Set();

  for (const item of SEARCH_INDEX) {
    if (item.userType && item.userType !== userType) continue;

    const matchTitle = item.title.toLowerCase().includes(q);
    const matchSubtitle = item.subtitle.toLowerCase().includes(q);
    const matchKeywords = item.keywords.some((k) => k.includes(q) || q.includes(k));

    if (matchTitle || matchSubtitle || matchKeywords) {
      const key = `${item.screen}-${item.title}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({ ...item });
      }
    }
  }

  return results;
};
