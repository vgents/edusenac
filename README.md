# EduSenac - Aplicativo Acadêmico Mobile

Aplicativo mobile desenvolvido com **React Native + Expo** para gestão acadêmica, com dois perfis: **Aluno** e **Professor**.

## Credenciais de teste

- **Aluno:** `aluno@edusenac.com` / `123456`
- **Professor:** `professor@edusenac.com` / `123456`

## Stack tecnológica

- React Native + Expo
- React Navigation (Stack + Bottom Tabs)
- React Context API (Auth, Theme, Accessibility, Feedback)
- AsyncStorage (banco local mock)
- react-native-reanimated + moti (animações)
- @expo/vector-icons
- react-native-maps + expo-location (geolocalização)

## Estrutura do projeto

```
src/
├── components/
│   ├── ui/           # Button, Input
│   └── feedback/     # Toast, Snackbar, ModalError, Loader
├── screens/
│   ├── auth/         # Splash, Login, RecuperarSenha
│   ├── student/      # Home, Agenda, Presenças, Acadêmico, etc.
│   ├── teacher/      # Home, Aulas, Chamadas, etc.
│   └── common/       # Configurações
├── routes/           # auth.routes, app.routes, index
├── context/          # Auth, Theme, Accessibility, Feedback
├── services/         # database, mockData, api
├── styles/           # colors, typography, spacing, globalStyles
├── hooks/
├── utils/
└── assets/
```

## Funcionalidades

### Aluno
- Registrar presença por geolocalização
- Agenda de aulas
- Histórico de presenças
- Acadêmico (cursos, disciplinas, notas)
- Financeiro (boletos)
- Documentos
- Integrações
- Perfil e Configurações

### Professor
- Iniciar chamada de presença
- Acompanhamento em tempo real
- Histórico de chamadas
- Aulas e turmas

### Acessibilidade
- Modo escuro
- Alto contraste
- Tamanho da fonte (normal, grande, extra grande)
- Leitor de tela

## Como executar

```bash
npm install
npm start
```

Depois escaneie o QR Code com o app Expo Go ou pressione `i` para iOS / `a` para Android.
