import { OptionItem } from "./types";

export const NIGHT_STATUS_OPTIONS: OptionItem[] = [
  { label: "Passou a noite tranquila, dormindo a maior parte do tempo", sentiment: "positive" },
  { label: "Passou a noite em alerta, dormindo em pequenos períodos", sentiment: "neutral" },
  { label: "Passou a noite alerta e agitado", sentiment: "negative" },
  { label: "Passou a noite prostrado, com pouca responsividade", sentiment: "negative" }
];

export const GENERAL_STATE_OPTIONS: OptionItem[] = [
  { label: "Animado e responsivo", sentiment: "positive" },
  { label: "Calmo e tranquilo", sentiment: "positive" },
  { label: "Um pouco apático/quieto", sentiment: "neutral" },
  { label: "Prostrado", sentiment: "negative" },
  { label: "Reativo/Agressivo por medo", sentiment: "negative" }
];

export const APPETITE_OPTIONS: OptionItem[] = [
  { label: "Aceitou alimentação com apetite", sentiment: "positive" },
  { label: "Aceitou alimentação em pequena quantidade", sentiment: "neutral" },
  { label: "Não aceitou alimentação", sentiment: "negative" }
];

export const FOOD_TYPE_OPTIONS: OptionItem[] = [
  { label: "Ração Seca", sentiment: "neutral" },
  { label: "Sachês / Úmida", sentiment: "neutral" },
  { label: "Petiscos", sentiment: "neutral" }
];

export const WATER_INTAKE_OPTIONS: OptionItem[] = [
  { label: "Ingestão hídrica normal", sentiment: "positive" },
  { label: "Bebeu muita água", sentiment: "neutral" },
  { label: "Bebeu pouca água", sentiment: "neutral" },
  { label: "Não bebeu água", sentiment: "negative" },
  { label: "Hidratação apenas via fluidoterapia", sentiment: "neutral" }
];

export const VOMIT_OPTIONS: OptionItem[] = [
  { label: "Não apresentou vômito/êmese", sentiment: "positive" },
  { label: "Vômito alimentar", sentiment: "neutral" },
  { label: "Vômito líquido/biliar (amarelo)", sentiment: "neutral" },
  { label: "Vômito com sangue (Hematêmese)", sentiment: "negative" },
  { label: "Regurgitação", sentiment: "neutral" }
];

export const RESPIRATORY_OPTIONS: OptionItem[] = [
  { label: "Respiração Normal (Eupneico)", sentiment: "positive" },
  { label: "Ofegante", sentiment: "neutral" },
  { label: "Tosse seca", sentiment: "negative" },
  { label: "Tosse produtiva (catarro)", sentiment: "negative" },
  { label: "Espirros", sentiment: "neutral" },
  { label: "Cansaço respiratório (Dispneia)", sentiment: "negative" }
];

export const URINE_OPTIONS: OptionItem[] = [
  { label: "Urina Normal (Amarelo)", sentiment: "positive" },
  { label: "Urina Escura (Concentrada/Amarelo Intenso)", sentiment: "neutral" },
  { label: "Urina Avermelhada (Sangue/Hematúria)", sentiment: "negative" },
  { label: "Urina Alaranjada", sentiment: "neutral" },
  { label: "Urina Ausente na madrugada", sentiment: "negative" },
  { label: "Uso de sonda uretral (Sistema Fechado)", sentiment: "neutral" }
];

export const FECES_OPTIONS: OptionItem[] = [
  { label: "Fezes normais", sentiment: "positive" },
  { label: "Fezes pastosas", sentiment: "neutral" },
  { label: "Diarréia líquida", sentiment: "negative" },
  { label: "Diarréia com sangue", sentiment: "negative" },
  { label: "Ausência de fezes na madrugada", sentiment: "neutral" }
];

export const EVOLUTION_OPTIONS: OptionItem[] = [
  { label: "Melhora clínica evidente", sentiment: "positive" },
  { label: "Evolução positiva discreta", sentiment: "positive" },
  { label: "Quadro estável", sentiment: "neutral" },
  { label: "Piora do quadro clínico", sentiment: "negative" },
  { label: "Inalterado em relação a ontem", sentiment: "neutral" }
];

// NOVAS CONSTANTES PARA EXAMES E INTERNAMENTO

export const BLOOD_EXAM_OPTIONS: OptionItem[] = [
  { label: "Perfil Triagem (R$ 80,00)", sentiment: "neutral" },
  { label: "Perfil PO (R$ 100,00)", sentiment: "neutral" },
  { label: "Perfil Check-up (R$ 110,00)", sentiment: "neutral" },
  { label: "Hemograma (R$ 36,00)", sentiment: "neutral" },
  { label: "Creatinina (R$ 28,00)", sentiment: "neutral" }
];

export const IMAGING_EXAM_OPTIONS: OptionItem[] = [
  { label: "Radiografia (R$ 180,00)", sentiment: "neutral" },
  { label: "Ultrassonografia abdominal (R$ 180,00)", sentiment: "neutral" }
];

export const HOSPITALIZATION_OPTIONS: OptionItem[] = [
  { label: "Solicitar nova diária de internamento", sentiment: "neutral" }
];