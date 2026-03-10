/**
 * API Service - Camada de acesso aos dados
 * Simula chamadas de API usando o banco local
 */

import { database, KEYS } from './database';
import {
  initializeMockData,
  mockAulas,
  mockClasses,
  mockAttendance,
  mockDisciplinaStatus,
  mockDisciplinaDetalhes,
  mockTeachers,
  mockStudents,
  mockNotifications,
} from './mockData';

// Inicializar dados na primeira execução
let initialized = false;
export const ensureDataInitialized = async () => {
  if (!initialized) {
    const users = await database.getItem(KEYS.USERS);
    if (!users || users.length === 0) {
      await initializeMockData();
    } else {
      // Migração: atualizar aulas e turmas se o banco tiver dados antigos
      const storedAulas = await database.getItem(KEYS.AULAS) || [];
      const storedClasses = await database.getItem(KEYS.CLASSES) || [];
      const firstClass = storedClasses[0];
      const lat = firstClass?.location?.latitude;
      const precisaMigrar =
        lat === -23.5505 || lat === -15.7797 || lat === -15.8397;
      if (storedAulas.length < mockAulas.length || precisaMigrar) {
        await database.setItem(KEYS.AULAS, mockAulas);
      }
      if (storedClasses.length < mockClasses.length || precisaMigrar) {
        await database.setItem(KEYS.CLASSES, mockClasses);
      }
      const storedAttendance = await database.getItem(KEYS.ATTENDANCE) || [];
      if (storedAttendance.length < mockAttendance.length) {
        await database.setItem(KEYS.ATTENDANCE, mockAttendance);
      }
      const storedStatus = await database.getItem(KEYS.DISCIPLINA_STATUS) || [];
      if (storedStatus.length < mockDisciplinaStatus.length) {
        await database.setItem(KEYS.DISCIPLINA_STATUS, mockDisciplinaStatus);
      }
      const storedDetalhes = await database.getItem(KEYS.DISCIPLINA_DETALHES) || [];
      if (storedDetalhes.length < mockDisciplinaDetalhes.length) {
        await database.setItem(KEYS.DISCIPLINA_DETALHES, mockDisciplinaDetalhes);
      }
      const storedTeachers = await database.getItem(KEYS.TEACHERS) || [];
      const firstTeacher = storedTeachers[0];
      if (!firstTeacher?.formacao) {
        await database.setItem(KEYS.TEACHERS, mockTeachers);
      }
      const storedStudents = await database.getItem(KEYS.STUDENTS) || [];
      const student1 = storedStudents.find((s) => s.id === '1');
      if (student1 && !student1.photo) {
        const updated = storedStudents.map((s) =>
          s.id === '1' ? { ...s, photo: mockStudents[0].photo } : s
        );
        await database.setItem(KEYS.STUDENTS, updated);
      }
      const storedNotifications = await database.getItem(KEYS.NOTIFICATIONS) || [];
      if (storedNotifications.length < mockNotifications.length) {
        await database.setItem(KEYS.NOTIFICATIONS, mockNotifications);
      }
    }
    initialized = true;
  }
};

// Auth
export const login = async (email, password) => {
  await ensureDataInitialized();
  const users = await database.getItem(KEYS.USERS) || [];
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

// Students
export const getStudent = async (id) => {
  const students = await database.getItem(KEYS.STUDENTS) || [];
  return students.find((s) => s.id === id) || null;
};

// Courses
export const getCourseById = async (id) => {
  const courses = await database.getItem(KEYS.COURSES) || [];
  return courses.find((c) => c.id === id) || null;
};

// Teachers
export const getTeacher = async (id) => {
  const teachers = await database.getItem(KEYS.TEACHERS) || [];
  return teachers.find((t) => t.id === id) || null;
};

export const getTeachers = async () => {
  const teachers = await database.getItem(KEYS.TEACHERS) || [];
  return teachers;
};

export const getTeachersForStudent = async (studentId, semester = '2024.1') => {
  const classes = await getClassesForStudent(studentId, semester);
  const teacherIds = [...new Set(classes.map((c) => c.teacherId))];
  const teachers = await database.getItem(KEYS.TEACHERS) || [];
  return teachers.filter((t) => teacherIds.includes(t.id));
};

// Subjects
export const getSubjects = async (courseId) => {
  const subjects = await database.getItem(KEYS.SUBJECTS) || [];
  return courseId ? subjects.filter((s) => s.courseId === courseId) : subjects;
};

export const getSubjectById = async (id) => {
  const subjects = await database.getItem(KEYS.SUBJECTS) || [];
  return subjects.find((s) => s.id === id) || null;
};

// Classes
export const getClasses = async (filters = {}) => {
  const classes = await database.getItem(KEYS.CLASSES) || [];
  let result = [...classes];
  if (filters.teacherId) result = result.filter((c) => c.teacherId === filters.teacherId);
  if (filters.semester) result = result.filter((c) => c.semester === filters.semester);
  return result;
};

export const getClassById = async (id) => {
  const classes = await database.getItem(KEYS.CLASSES) || [];
  return classes.find((c) => c.id === id) || null;
};

// Aulas - organizadas por dia, hora e professor
export const getAulas = async (filters = {}) => {
  await ensureDataInitialized();
  const aulas = await database.getItem(KEYS.AULAS) || [];
  let result = [...aulas];
  if (filters.dayOfWeek !== undefined) {
    result = result.filter((a) => a.dayOfWeek === filters.dayOfWeek);
  }
  if (filters.dia) {
    result = result.filter((a) => a.dia === filters.dia);
  }
  if (filters.semester) {
    result = result.filter((a) => a.semester === filters.semester);
  }
  return result.sort((a, b) => {
    if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
    return a.hora.localeCompare(b.hora);
  });
};

export const getAulasPorDia = async () => {
  const aulas = await getAulas();
  return {
    segunda: aulas.filter((a) => a.dayOfWeek === 1),
    terca: aulas.filter((a) => a.dayOfWeek === 2),
    quarta: aulas.filter((a) => a.dayOfWeek === 3),
    quinta: aulas.filter((a) => a.dayOfWeek === 4),
    sexta: aulas.filter((a) => a.dayOfWeek === 5),
    sabado: aulas.filter((a) => a.dayOfWeek === 6),
    domingo: aulas.filter((a) => a.dayOfWeek === 0),
  };
};

export const getAulasByDate = async (date, semester = '2024.1') => {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  return getAulas({ dayOfWeek, semester });
};

export const getAttendanceByStudentAndDate = async (studentId, date) => {
  await ensureDataInitialized();
  const attendance = await database.getItem(KEYS.ATTENDANCE) || [];
  const dateStr = typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0];
  return attendance.filter(
    (a) => a.studentId === studentId && a.date === dateStr
  );
};

// Classes para um aluno (baseado no curso)
export const getClassesForStudent = async (studentId, semester) => {
  const students = await database.getItem(KEYS.STUDENTS) || [];
  const student = students.find((s) => s.id === studentId);
  if (!student?.courseId) return [];

  const subjects = await database.getItem(KEYS.SUBJECTS) || [];
  const subjectIds = subjects
    .filter((s) => s.courseId === student.courseId)
    .map((s) => s.id);

  const classes = await database.getItem(KEYS.CLASSES) || [];
  let result = classes.filter((c) => subjectIds.includes(c.subjectId));
  if (semester) result = result.filter((c) => c.semester === semester);
  return result;
};

// Detalhes completos de uma disciplina (resumo, comentários, notas, frequência)
export const getDisciplinaDetalhe = async (subjectId, semester) => {
  await ensureDataInitialized();
  const detalhes = await database.getItem(KEYS.DISCIPLINA_DETALHES) || [];
  const rec = detalhes.find(
    (d) => d.subjectId === subjectId && d.semester === semester
  );
  return rec || null;
};

// Progresso geral do curso (aprovados / total) e previsão de conclusão
export const getAcademicProgress = async (studentId) => {
  await ensureDataInitialized();
  const student = await getStudent(studentId);
  if (!student?.courseId) return { approved: 0, total: 0, percent: 0, previsao: null };

  const subjects = await getSubjects(student.courseId);
  const total = subjects.length;
  if (total === 0) return { approved: 0, total: 0, percent: 0, previsao: null };

  const statusList = await database.getItem(KEYS.DISCIPLINA_STATUS) || [];
  const semesterValue = (sem) => {
    const [y, s] = sem.split('.').map(Number);
    return (y || 0) * 10 + (s || 0);
  };
  const semesterOrderDesc = (a, b) => semesterValue(b) - semesterValue(a);

  let approved = 0;
  for (const s of subjects) {
    const recs = statusList.filter((r) => r.subjectId === s.id).sort((a, b) => semesterOrderDesc(a.semester, b.semester));
    const latest = recs[0];
    if (latest?.status === 'aprovado') approved++;
  }

  const percent = Math.round((approved / total) * 100);
  const remaining = total - approved;

  let previsao = null;
  if (remaining > 0) {
    const classes = await getClasses({});
    const semesters = [...new Set(classes.map((c) => c.semester))].sort((a, b) => semesterValue(a) - semesterValue(b));
    const avgPerSemester = semesters.length ? Math.max(1, Math.round(subjects.length / semesters.length)) : 2;
    const semestersLeft = Math.ceil(remaining / avgPerSemester);
    const lastSem = semesters[semesters.length - 1] || '2024.1';
    const [y, s] = lastSem.split('.').map(Number);
    let ny = y;
    let ns = s;
    for (let i = 0; i < semestersLeft; i++) {
      ns++;
      if (ns > 2) {
        ns = 1;
        ny++;
      }
    }
    previsao = `${ns}º semestre de ${ny}`;
  } else {
    previsao = 'Concluído';
  }

  return { approved, total, percent, previsao };
};

// Disciplinas do semestre com status (aprovado, reprovado, recuperação)
export const getDisciplinasBySemester = async (studentId, semester) => {
  await ensureDataInitialized();
  const student = await getStudent(studentId);
  if (!student?.courseId) return [];

  const classes = await getClasses({ semester });
  const subjectIds = [...new Set(classes.map((c) => c.subjectId))];

  const subjects = await database.getItem(KEYS.SUBJECTS) || [];
  const statusList = await database.getItem(KEYS.DISCIPLINA_STATUS) || [];

  return subjectIds.map((subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    const statusRec = statusList.find(
      (s) => s.subjectId === subjectId && s.semester === semester
    );
    return {
      subjectId,
      name: subject?.name || 'Disciplina',
      status: statusRec?.status || 'aprovado',
    };
  });
};

// Attendance
export const getAttendanceByStudent = async (studentId, semester) => {
  const attendance = await database.getItem(KEYS.ATTENDANCE) || [];
  let result = attendance.filter((a) => a.studentId === studentId);
  if (semester) {
    const classes = await getClasses({ semester });
    const classIds = classes.map((c) => c.id);
    result = result.filter((a) => classIds.includes(a.classId));
  }
  return result;
};

export const getAttendanceByClassAndDate = async (classId, date) => {
  const attendance = await database.getItem(KEYS.ATTENDANCE) || [];
  const dateStr = typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0];
  return attendance.filter(
    (a) => a.classId === classId && a.date === dateStr
  );
};

export const addAttendance = async (data) => {
  const attendance = await database.getItem(KEYS.ATTENDANCE) || [];
  const newRecord = {
    id: String(Date.now()),
    ...data,
    timestamp: new Date().toISOString(),
  };
  attendance.push(newRecord);
  await database.setItem(KEYS.ATTENDANCE, attendance);
  return newRecord;
};

export const saveAttendanceList = async (classId, date, list) => {
  const attendance = await database.getItem(KEYS.ATTENDANCE) || [];
  const dateStr = typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0];
  const filtered = attendance.filter(
    (a) => !(a.classId === classId && a.date === dateStr)
  );
  const newRecords = list.map((item) => ({
    id: String(Date.now() + Math.random()),
    studentId: item.studentId,
    classId,
    date: dateStr,
    status: item.present ? 'present' : 'absent',
    observation: item.observation || null,
    viaGps: item.viaGps || false,
    timestamp: new Date().toISOString(),
  }));
  const updated = [...filtered, ...newRecords];
  await database.setItem(KEYS.ATTENDANCE, updated);
  return newRecords;
};

// Payments
export const getPaymentsByStudent = async (studentId) => {
  const payments = await database.getItem(KEYS.PAYMENTS) || [];
  return payments.filter((p) => p.studentId === studentId);
};

// Documents
export const getDocumentsByStudent = async (studentId) => {
  const documents = await database.getItem(KEYS.DOCUMENTS) || [];
  return documents.filter((d) => d.studentId === studentId);
};

// Notifications (por userId - user.id)
export const getNotifications = async (userId) => {
  await ensureDataInitialized();
  const list = await database.getItem(KEYS.NOTIFICATIONS) || [];
  return list
    .filter((n) => n.userId === String(userId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const hasUnreadNotifications = async (userId) => {
  const list = await getNotifications(userId);
  return list.some((n) => !n.read);
};

// Calls
export const getCallsByTeacher = async (teacherId, classId) => {
  const calls = await database.getItem(KEYS.CALLS) || [];
  let result = calls.filter((c) => c.teacherId === teacherId);
  if (classId) result = result.filter((c) => c.classId === classId);
  return result.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
};

export const getCallById = async (id) => {
  const calls = await database.getItem(KEYS.CALLS) || [];
  return calls.find((c) => c.id === id) || null;
};

export const getStudentsByClassId = async (classId) => {
  const classes = await database.getItem(KEYS.CLASSES) || [];
  const classData = classes.find((c) => c.id === classId);
  if (!classData?.subjectId) return [];
  const subjects = await database.getItem(KEYS.SUBJECTS) || [];
  const subject = subjects.find((s) => s.id === classData.subjectId);
  if (!subject?.courseId) return [];
  const students = await database.getItem(KEYS.STUDENTS) || [];
  return students.filter((s) => s.courseId === subject.courseId);
};

export const createCall = async (data) => {
  const calls = await database.getItem(KEYS.CALLS) || [];
  const newCall = {
    id: String(Date.now()),
    ...data,
    status: 'active',
    attendanceList: [],
  };
  calls.push(newCall);
  await database.setItem(KEYS.CALLS, calls);
  return newCall;
};

export const updateCall = async (id, updates) => {
  const calls = await database.getItem(KEYS.CALLS) || [];
  const index = calls.findIndex((c) => c.id === id);
  if (index >= 0) {
    calls[index] = { ...calls[index], ...updates };
    await database.setItem(KEYS.CALLS, calls);
    return calls[index];
  }
  return null;
};
