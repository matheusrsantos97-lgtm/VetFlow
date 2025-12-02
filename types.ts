export enum Species {
  DOG = 'Cão',
  CAT = 'Gato',
  OTHER = 'Outro'
}

export enum Gender {
  MALE = 'Macho',
  FEMALE = 'Fêmea'
}

export type ReportType = 'tutor' | 'medical';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Em um app real, isso seria hash/token
  crmv?: string;
  birthDate?: string;
  phone?: string;
}

export interface PatientInfo {
  name: string;
  tutorName: string;
  species: Species;
  gender: Gender;
}

export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface OptionItem {
  label: string;
  sentiment: Sentiment;
}

export interface DailyReportData {
  vetName: string;
  generalState: string;
  appetite: string;
  foodTypes: string[];
  waterIntake: string;
  urine: string;
  feces: string;
  vomit: string;
  respiratory: string; // Novo campo opcional
  nightStatus: string;
  evolution: string;
  notes: string;
  // Novos campos financeiros/exames
  bloodExams: string[];
  imagingExams: string[];
  hospitalizationRequests: string[];
}

export const INITIAL_PATIENT_INFO: PatientInfo = {
  name: '',
  tutorName: '',
  species: Species.DOG,
  gender: Gender.FEMALE
};

export const INITIAL_REPORT_DATA: DailyReportData = {
  vetName: '',
  generalState: '',
  appetite: '',
  foodTypes: [],
  waterIntake: '',
  urine: '',
  feces: '',
  vomit: '',
  respiratory: '', // Inicialização
  nightStatus: '',
  evolution: '',
  notes: '',
  bloodExams: [],
  imagingExams: [],
  hospitalizationRequests: []
};