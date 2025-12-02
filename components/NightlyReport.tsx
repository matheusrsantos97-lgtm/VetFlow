import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Moon, 
  Activity, 
  Utensils, 
  Droplets, 
  Cat, 
  Dog, 
  Send, 
  Edit3,
  ClipboardList,
  User as UserIcon,
  Sparkles,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  TrendingUp,
  Beef,
  ChevronDown,
  FileText,
  CreditCard,
  MessageCircle,
  FileSpreadsheet,
  Wind,
  Wand2,
  ArrowLeft
} from 'lucide-react';
import { 
  PatientInfo, 
  DailyReportData, 
  INITIAL_PATIENT_INFO, 
  INITIAL_REPORT_DATA, 
  Species, 
  Gender,
  ReportType,
  User
} from '../types';
import { 
  NIGHT_STATUS_OPTIONS, 
  GENERAL_STATE_OPTIONS, 
  APPETITE_OPTIONS, 
  WATER_INTAKE_OPTIONS, 
  URINE_OPTIONS, 
  FECES_OPTIONS,
  VOMIT_OPTIONS,
  RESPIRATORY_OPTIONS,
  EVOLUTION_OPTIONS,
  FOOD_TYPE_OPTIONS,
  BLOOD_EXAM_OPTIONS,
  IMAGING_EXAM_OPTIONS,
  HOSPITALIZATION_OPTIONS
} from '../constants';
import { OptionGroup } from './OptionGroup';
import { generateVeterinaryReport, refineVeterinaryReport } from '../services/geminiService';
import { LoadingOverlay } from './LoadingOverlay';

interface NightlyReportProps {
  onBack: () => void;
  currentUser: User;
}

export const NightlyReport: React.FC<NightlyReportProps> = ({ onBack, currentUser }) => {
  const [patient, setPatient] = useState<PatientInfo>(INITIAL_PATIENT_INFO);
  const [clinicalData, setClinicalData] = useState<DailyReportData>({
    ...INITIAL_REPORT_DATA,
    vetName: currentUser.name // Pre-fill with logged user name
  });
  const [reportType, setReportType] = useState<ReportType>('tutor');
  const [generatedReport, setGeneratedReport] = useState<string>('');
  
  // States for generation and refinement
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Update Vet Name if user changes (though usually component remounts)
  useEffect(() => {
    if (clinicalData.vetName === '') {
        setClinicalData(prev => ({ ...prev, vetName: currentUser.name }));
    }
  }, [currentUser]);

  const handlePatientChange = (field: keyof PatientInfo, value: any) => {
    setPatient(prev => ({ ...prev, [field]: value }));
  };

  const handleDataChange = (field: keyof DailyReportData, value: string) => {
    setClinicalData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFoodTypeChange = (values: string[]) => {
    setClinicalData(prev => ({ ...prev, foodTypes: values }));
  };

  const handleArrayChange = (field: keyof DailyReportData, values: string[]) => {
    setClinicalData(prev => ({ ...prev, [field]: values }));
  };

  const isFormValid = () => {
    return patient.name.trim() !== '' && patient.tutorName.trim() !== '';
  };

  const handleGenerateReport = async () => {
    if (!isFormValid()) {
      setError("Por favor, preencha pelo menos o nome do paciente e do tutor.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);
    setError(null);
    setCopied(false);
    setRefineInstruction(''); // Limpa instrução anterior
    try {
      const report = await generateVeterinaryReport(patient, clinicalData, reportType);
      setGeneratedReport(report);
      // Scroll to result
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(`Erro: ${err.message || "Não foi possível gerar o relatório. Verifique sua conexão."}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineReport = async () => {
    if (!generatedReport || !refineInstruction.trim()) return;

    setIsRefining(true);
    try {
      const refinedReport = await refineVeterinaryReport(generatedReport, refineInstruction);
      setGeneratedReport(refinedReport);
      setRefineInstruction(''); // Clear input after success
    } catch (err: any) {
      console.error(err);
      alert("Não foi possível refinar o texto. Tente novamente.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!generatedReport) return;
    const encodedText = encodeURIComponent(generatedReport);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const handleCopy = () => {
    if (!generatedReport) return;
    navigator.clipboard.writeText(generatedReport).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReset = () => {
    if(confirm("Tem certeza que deseja limpar todos os campos?")) {
      setPatient(INITIAL_PATIENT_INFO);
      setClinicalData({ ...INITIAL_REPORT_DATA, vetName: currentUser.name });
      setGeneratedReport('');
      setRefineInstruction('');
      setError(null);
      setCopied(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-10 duration-500">
      {isLoading && <LoadingOverlay />}

      {/* Internal Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-vet-muted hover:text-vet-brand transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar ao Menu
        </button>
        <button 
            onClick={handleReset}
            className="p-2 hover:bg-vet-card rounded-full transition-colors text-vet-muted hover:text-vet-error"
            title="Limpar formulário"
          >
            <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Error Message */}
        {error && (
          <div className="bg-vet-error/10 border-l-4 border-vet-error p-4 rounded-md animate-in slide-in-from-top-2 fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-vet-error mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-vet-error">Ocorreu um erro</h3>
                <p className="text-vet-error/80 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Section 0: Vet Info */}
        <section className="bg-vet-card p-6 rounded-2xl shadow-lg border border-vet-border">
           <div className="flex items-center gap-2 mb-4 text-vet-brand">
            <Stethoscope className="w-5 h-5" />
            <h2 className="font-bold text-lg text-vet-title">Responsável</h2>
          </div>
          <div>
            <label className="block text-xs font-bold text-vet-muted uppercase tracking-wider mb-2">Veterinário(a) Plantonista</label>
            <input
              type="text"
              value={clinicalData.vetName}
              onChange={(e) => handleDataChange('vetName', e.target.value)}
              placeholder="Ex: Ana Silva"
              className="w-full px-4 py-3 rounded-xl bg-vet-input border border-vet-border text-vet-title placeholder-vet-disabled focus:ring-1 focus:ring-vet-brand focus:border-vet-brand outline-none transition-all"
            />
          </div>
        </section>

        {/* Section 1: Patient Info */}
        <section className="bg-vet-card p-6 rounded-2xl shadow-lg border border-vet-border">
          <div className="flex items-center gap-2 mb-4 text-vet-brand">
            <ClipboardList className="w-5 h-5" />
            <h2 className="font-bold text-lg text-vet-title">Identificação do Paciente</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-vet-muted uppercase tracking-wider mb-2">Nome do Paciente</label>
              <input
                type="text"
                value={patient.name}
                onChange={(e) => handlePatientChange('name', e.target.value)}
                placeholder="Ex: Bola"
                className="w-full px-4 py-3 rounded-xl bg-vet-input border border-vet-border text-vet-title placeholder-vet-disabled focus:ring-1 focus:ring-vet-brand focus:border-vet-brand outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-vet-muted uppercase tracking-wider mb-2">Nome do Tutor</label>
              <input
                type="text"
                value={patient.tutorName}
                onChange={(e) => handlePatientChange('tutorName', e.target.value)}
                placeholder="Ex: Claudia"
                className="w-full px-4 py-3 rounded-xl bg-vet-input border border-vet-border text-vet-title placeholder-vet-disabled focus:ring-1 focus:ring-vet-brand focus:border-vet-brand outline-none transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-vet-muted uppercase tracking-wider mb-2">Espécie</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePatientChange('species', Species.DOG)}
                    className={`flex-1 flex items-center justify-center gap-1 py-3 rounded-xl border transition-all ${patient.species === Species.DOG ? 'bg-vet-brand/20 border-vet-brand text-vet-brand font-medium' : 'bg-vet-input border-vet-border text-vet-muted hover:bg-vet-border'}`}
                  >
                    <Dog className="w-4 h-4" /> Cão
                  </button>
                  <button
                    onClick={() => handlePatientChange('species', Species.CAT)}
                    className={`flex-1 flex items-center justify-center gap-1 py-3 rounded-xl border transition-all ${patient.species === Species.CAT ? 'bg-vet-brand/20 border-vet-brand text-vet-brand font-medium' : 'bg-vet-input border-vet-border text-vet-muted hover:bg-vet-border'}`}
                  >
                    <Cat className="w-4 h-4" /> Gato
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-vet-muted uppercase tracking-wider mb-2">Sexo</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePatientChange('gender', Gender.MALE)}
                    className={`flex-1 py-3 rounded-xl border text-sm transition-all ${patient.gender === Gender.MALE ? 'bg-vet-brand/20 border-vet-brand text-vet-brand font-medium' : 'bg-vet-input border-vet-border text-vet-muted hover:bg-vet-border'}`}
                  >
                    Macho
                  </button>
                  <button
                    onClick={() => handlePatientChange('gender', Gender.FEMALE)}
                    className={`flex-1 py-3 rounded-xl border text-sm transition-all ${patient.gender === Gender.FEMALE ? 'bg-vet-brand/20 border-vet-brand text-vet-brand font-medium' : 'bg-vet-input border-vet-border text-vet-muted hover:bg-vet-border'}`}
                  >
                    Fêmea
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Clinical Parameters */}
        <div className="space-y-4">
          <h2 className="text-vet-muted font-bold text-sm uppercase tracking-wider ml-1 mt-6 mb-2">Monitoração Noturna</h2>
          
          <OptionGroup
            title="Como passou a noite?"
            icon={<Moon className="w-5 h-5" />}
            options={NIGHT_STATUS_OPTIONS}
            selectedOption={clinicalData.nightStatus}
            onSelect={(val) => handleDataChange('nightStatus', val)}
          />

          <OptionGroup
            title="Estado Geral (Manhã)"
            icon={<Activity className="w-5 h-5" />}
            options={GENERAL_STATE_OPTIONS}
            selectedOption={clinicalData.generalState}
            onSelect={(val) => handleDataChange('generalState', val)}
          />

          <OptionGroup
            title="Evolução Clínica / Prognóstico"
            icon={<TrendingUp className="w-5 h-5" />}
            options={EVOLUTION_OPTIONS}
            selectedOption={clinicalData.evolution}
            onSelect={(val) => handleDataChange('evolution', val)}
          />

          <OptionGroup
            title="Apetite"
            icon={<Utensils className="w-5 h-5" />}
            options={APPETITE_OPTIONS}
            selectedOption={clinicalData.appetite}
            onSelect={(val) => handleDataChange('appetite', val)}
          />

          {/* Sub-alternativa de Apetite */}
          <OptionGroup
            title="O que foi ofertado? (Selecione um ou mais)"
            icon={<Beef className="w-5 h-5" />}
            options={FOOD_TYPE_OPTIONS}
            selectedOption={clinicalData.foodTypes}
            onSelect={handleFoodTypeChange}
            multiSelect={true}
          />

          <OptionGroup
            title="Ingestão Hídrica"
            icon={<Droplets className="w-5 h-5" />}
            options={WATER_INTAKE_OPTIONS}
            selectedOption={clinicalData.waterIntake}
            onSelect={(val) => handleDataChange('waterIntake', val)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OptionGroup
              title="Vômito"
              options={VOMIT_OPTIONS}
              selectedOption={clinicalData.vomit}
              onSelect={(val) => handleDataChange('vomit', val)}
            />
            <OptionGroup
              title="Respiratório (Opcional)"
              icon={<Wind className="w-4 h-4" />}
              options={RESPIRATORY_OPTIONS}
              selectedOption={clinicalData.respiratory}
              onSelect={(val) => handleDataChange('respiratory', val)}
            />
             <OptionGroup
              title="Urina"
              options={URINE_OPTIONS}
              selectedOption={clinicalData.urine}
              onSelect={(val) => handleDataChange('urine', val)}
            />
            <OptionGroup
              title="Fezes"
              options={FECES_OPTIONS}
              selectedOption={clinicalData.feces}
              onSelect={(val) => handleDataChange('feces', val)}
            />
          </div>

          {/* Seção Discreta para Exames e Custos */}
          <details className="group bg-vet-card rounded-xl overflow-hidden border border-vet-border">
            <summary className="cursor-pointer p-5 flex items-center justify-between text-vet-muted hover:text-vet-text transition-colors bg-vet-card">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-vet-muted" />
                <span className="font-bold text-sm uppercase tracking-wide">Solicitações e Exames (Opcional)</span>
              </div>
              <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-200" />
            </summary>
            
            <div className="p-5 pt-0 space-y-4 border-t border-vet-border bg-vet-bg/30">
               <p className="text-xs text-vet-muted mt-4 mb-4 italic">
                 Selecione abaixo caso precise informar valores ou solicitar procedimentos. Se não marcar nada, esta seção não aparecerá no relatório.
               </p>

               <OptionGroup
                  title="Exame de Sangue"
                  icon={<FileText className="w-4 h-4" />}
                  options={BLOOD_EXAM_OPTIONS}
                  selectedOption={clinicalData.bloodExams}
                  onSelect={(val) => handleArrayChange('bloodExams', val)}
                  multiSelect={true}
                />

                <OptionGroup
                  title="Exames de Imagem"
                  icon={<FileText className="w-4 h-4" />}
                  options={IMAGING_EXAM_OPTIONS}
                  selectedOption={clinicalData.imagingExams}
                  onSelect={(val) => handleArrayChange('imagingExams', val)}
                  multiSelect={true}
                />

                <OptionGroup
                  title="Internamento"
                  icon={<FileText className="w-4 h-4" />}
                  options={HOSPITALIZATION_OPTIONS}
                  selectedOption={clinicalData.hospitalizationRequests}
                  onSelect={(val) => handleArrayChange('hospitalizationRequests', val)}
                  multiSelect={true}
                />
            </div>
          </details>

          <div className="bg-vet-card p-5 rounded-xl shadow-lg border border-vet-border">
            <div className="flex items-center gap-2 mb-3">
              <Edit3 className="w-5 h-5 text-vet-brand" />
              <h3 className="text-sm font-semibold text-vet-title uppercase tracking-wide">Observações Extras (Opcional)</h3>
            </div>
            <textarea
              value={clinicalData.notes}
              onChange={(e) => handleDataChange('notes', e.target.value)}
              placeholder="Digite aqui algo específico sobre medicações, exames realizados ou intercorrências..."
              className="w-full px-4 py-3 rounded-xl bg-vet-input border border-vet-border text-vet-title placeholder-vet-disabled focus:ring-1 focus:ring-vet-brand focus:border-vet-brand outline-none transition-all h-24 text-sm resize-none"
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-4 pb-8 space-y-4">
          
          {/* Report Type Selector */}
          <div className="bg-vet-card p-1.5 rounded-xl shadow-sm border border-vet-border flex">
            <button
              onClick={() => setReportType('tutor')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                reportType === 'tutor' 
                  ? 'bg-vet-brand text-white shadow-lg shadow-vet-brand/20' 
                  : 'text-vet-muted hover:bg-vet-border hover:text-vet-text'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Mensagem Tutor
            </button>
            <button
              onClick={() => setReportType('medical')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                reportType === 'medical' 
                  ? 'bg-vet-info text-white shadow-lg shadow-vet-info/20' 
                  : 'text-vet-muted hover:bg-vet-border hover:text-vet-text'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Prontuário (Sistema)
            </button>
          </div>

          <button
            onClick={handleGenerateReport}
            className={`w-full text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg ${
              reportType === 'tutor' 
                ? 'bg-vet-brand hover:bg-vet-brand-hover shadow-vet-brand/20' 
                : 'bg-vet-info hover:bg-blue-500 shadow-vet-info/20'
            }`}
          >
            <Sparkles className="w-6 h-6" />
            {reportType === 'tutor' ? 'Gerar Mensagem' : 'Gerar Texto Técnico'}
          </button>
        </div>

        {/* Result Section */}
        {generatedReport && (
          <section id="result-section" className="animate-in slide-in-from-bottom-10 fade-in duration-500 pb-10 space-y-4">
             <div className={`bg-vet-card rounded-2xl shadow-xl overflow-hidden border ${reportType === 'tutor' ? 'border-vet-brand/50' : 'border-vet-info/50'}`}>
                <div className={`${reportType === 'tutor' ? 'bg-vet-brand/10 border-vet-brand/30' : 'bg-vet-info/10 border-vet-info/30'} p-4 border-b flex items-center justify-between`}>
                  <h3 className={`font-bold ${reportType === 'tutor' ? 'text-vet-brand' : 'text-vet-info'} flex items-center gap-2`}>
                    {reportType === 'tutor' ? <MessageCircle className="w-5 h-5" /> : <FileSpreadsheet className="w-5 h-5" />}
                    {reportType === 'tutor' ? 'Prévia da Mensagem' : 'Evolução Clínica'}
                  </h3>
                </div>
                
                <div className="p-6 relative">
                   {isRefining && (
                     <div className="absolute inset-0 bg-vet-card/80 backdrop-blur-sm flex items-center justify-center z-10">
                       <div className="flex flex-col items-center">
                         <Wand2 className="w-8 h-8 text-vet-brand animate-spin mb-2" />
                         <span className="text-sm font-medium text-vet-brand">Refinando texto...</span>
                       </div>
                     </div>
                   )}
                  <textarea
                    value={generatedReport}
                    onChange={(e) => setGeneratedReport(e.target.value)}
                    className="w-full min-h-[400px] text-vet-text text-base leading-relaxed bg-transparent border-none focus:ring-0 outline-none resize-none font-mono text-sm"
                  />
                </div>

                <div className="p-4 bg-vet-bg/30 flex flex-col sm:flex-row gap-3 border-t border-vet-border">
                   <button
                    onClick={handleCopy}
                    className={`flex-1 font-bold py-3 px-6 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 border ${
                      copied 
                        ? 'bg-vet-success text-white border-vet-success' 
                        : 'bg-vet-input text-vet-text border-vet-border hover:bg-vet-border'
                    }`}
                   >
                     {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                     {copied ? 'Copiado!' : 'Copiar Texto'}
                   </button>
                   {reportType === 'tutor' && (
                     <button
                      onClick={handleShareWhatsApp}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-green-900/20 transition-colors flex items-center justify-center gap-2"
                     >
                       <Send className="w-5 h-5" />
                       Enviar no WhatsApp
                     </button>
                   )}
                </div>
             </div>

             {/* Refine / Chat Section */}
             <div className="bg-vet-card p-5 rounded-2xl shadow-lg border border-vet-border">
               <label className="block text-sm font-semibold text-vet-title mb-3 flex items-center gap-2">
                 <Wand2 className="w-4 h-4 text-purple-400" />
                 Precisa ajustar algo? Converse com a IA:
               </label>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={refineInstruction}
                   onChange={(e) => setRefineInstruction(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleRefineReport()}
                   placeholder="Ex: Troque a palavra 'vômito' por 'êmese'..."
                   className="flex-1 px-4 py-2 bg-vet-input border border-vet-border rounded-lg focus:ring-1 focus:ring-purple-500 outline-none text-sm text-vet-title placeholder-vet-disabled"
                   disabled={isRefining}
                 />
                 <button 
                   onClick={handleRefineReport}
                   disabled={isRefining || !refineInstruction.trim()}
                   className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/20 disabled:text-purple-300 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                 >
                   {isRefining ? '...' : 'Atualizar'}
                 </button>
               </div>
             </div>
          </section>
        )}
      </div>
    </div>
  );
};