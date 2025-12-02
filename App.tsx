import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sun, 
  BookOpen, 
  ChevronRight,
  Clock,
  LogOut,
  User as UserIcon,
  Stethoscope,
  Calendar,
  ScrollText,
  Calculator,
  Bed
} from 'lucide-react';
import { NightlyReport } from './components/NightlyReport';
import { HoursLog } from './components/HoursLog';
import { AuthScreen } from './components/AuthScreen';
import { UserProfile } from './components/UserProfile';
import { authService } from './services/authService';
import { User } from './types';
import { Logo } from './components/Logo';

type AppView = 'dashboard' | 'nightly-report' | 'hours-log' | 'profile';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  if (!currentUser) {
    return <AuthScreen onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-vet-bg pb-24 text-vet-text">
      
      {/* Header */}
      <header className="bg-vet-card border-b border-vet-border shadow-lg sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Lado Esquerdo: Marca (Home) */}
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
            title="Ir para o Painel Principal"
          >
            <div className="bg-vet-brand/10 p-2 rounded-lg border border-vet-brand/20 group-hover:border-vet-brand transition-colors">
              <Logo className="w-6 h-6 text-vet-brand" />
            </div>
            <h1 className="text-xl font-bold leading-tight text-vet-title tracking-tight">VetFlow</h1>
          </button>

          {/* Lado Direito: Perfil e Logout */}
          <div className="flex items-center gap-4">
            
            {/* Botão de Perfil */}
            <button 
              onClick={() => setCurrentView('profile')}
              className="flex items-center gap-3 group text-right pl-4 border-l border-transparent sm:border-vet-border/30"
              title="Meu Perfil"
            >
              <div className="hidden sm:block">
                 <p className="text-sm font-bold text-vet-title group-hover:text-vet-brand transition-colors">
                   {currentUser.name}
                 </p>
                 <p className="text-[10px] text-vet-muted uppercase tracking-wider">
                   {currentUser.crmv || 'Editar Perfil'}
                 </p>
              </div>
              <div className="bg-vet-input p-2 rounded-full border border-vet-border group-hover:border-vet-brand group-hover:bg-vet-brand/10 transition-all">
                <UserIcon className="w-5 h-5 text-vet-muted group-hover:text-vet-brand" />
              </div>
            </button>

            {/* Separador */}
            <div className="h-6 w-px bg-vet-border"></div>

            {/* Botão Sair */}
            <button 
              onClick={handleLogout}
              className="p-2 text-vet-muted hover:text-vet-error hover:bg-vet-error/10 rounded-full transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        
        {currentView === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 space-y-8">
            
            <div className="mb-6 mt-2">
              <h2 className="text-2xl font-bold text-vet-title">Olá, {currentUser.name.split(' ')[0]}</h2>
              <p className="text-vet-muted">Selecione uma ferramenta para começar.</p>
            </div>

            {/* SEÇÃO: ATENDIMENTO */}
            <div>
              <h3 className="text-xs font-bold text-vet-muted uppercase tracking-wider mb-4 border-b border-vet-border pb-2">
                Atendimento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 
                 {/* Card Consulta - FUTURO */}
                <div className="relative bg-vet-card/40 border border-vet-border/50 p-6 rounded-2xl opacity-60 cursor-not-allowed text-left hover:opacity-80 transition-all">
                  <div className="bg-vet-input p-3 rounded-xl w-fit mb-4">
                    <Stethoscope className="w-8 h-8 text-vet-disabled" />
                  </div>
                  <h3 className="text-lg font-bold text-vet-disabled mb-2 flex items-center justify-between">
                    Consulta
                    <span className="text-xs bg-vet-input px-2 py-1 rounded text-vet-disabled border border-vet-border">Em Breve</span>
                  </h3>
                  <p className="text-sm text-vet-disabled leading-relaxed">
                    Realize atendimentos, anamnese e prescrições digitais completas.
                  </p>
                </div>

                 {/* Card Receitas - FUTURO */}
                 <div className="relative bg-vet-card/40 border border-vet-border/50 p-6 rounded-2xl opacity-60 cursor-not-allowed text-left hover:opacity-80 transition-all">
                  <div className="bg-vet-input p-3 rounded-xl w-fit mb-4">
                    <ScrollText className="w-8 h-8 text-vet-disabled" />
                  </div>
                  <h3 className="text-lg font-bold text-vet-disabled mb-2 flex items-center justify-between">
                    Receitas
                    <span className="text-xs bg-vet-input px-2 py-1 rounded text-vet-disabled border border-vet-border">Em Breve</span>
                  </h3>
                  <p className="text-sm text-vet-disabled leading-relaxed">
                    Crie e imprima receituários simples e controlados.
                  </p>
                </div>
              </div>
            </div>

            {/* SEÇÃO: RELATÓRIOS */}
            <div>
              <h3 className="text-xs font-bold text-vet-muted uppercase tracking-wider mb-4 border-b border-vet-border pb-2">
                Relatórios e Documentos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Card Relatório Noturno - ATIVO */}
                <button 
                  onClick={() => setCurrentView('nightly-report')}
                  className="group relative bg-vet-card hover:bg-[#1A1E29] border border-vet-border hover:border-vet-brand/50 p-6 rounded-2xl shadow-xl transition-all duration-300 text-left"
                >
                  <div className="bg-vet-brand/10 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300 border border-vet-brand/20">
                    <Moon className="w-8 h-8 text-vet-brand" />
                  </div>
                  <h3 className="text-lg font-bold text-vet-title mb-2 flex items-center justify-between">
                    Relatório Noturno
                    <ChevronRight className="w-5 h-5 text-vet-muted group-hover:text-vet-brand transition-colors" />
                  </h3>
                  <p className="text-sm text-vet-muted leading-relaxed">
                    Gere boletins informativos de plantão noturno para tutores e evoluções clínicas.
                  </p>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-vet-brand/10 rounded-2xl pointer-events-none transition-all"></div>
                </button>

                 {/* Card Internamento - FUTURO */}
                 <div className="relative bg-vet-card/40 border border-vet-border/50 p-6 rounded-2xl opacity-60 cursor-not-allowed text-left hover:opacity-80 transition-all">
                  <div className="bg-vet-input p-3 rounded-xl w-fit mb-4">
                    <Bed className="w-8 h-8 text-vet-disabled" />
                  </div>
                  <h3 className="text-lg font-bold text-vet-disabled mb-2 flex items-center justify-between">
                    Ficha de Internamento
                    <span className="text-xs bg-vet-input px-2 py-1 rounded text-vet-disabled border border-vet-border">Em Breve</span>
                  </h3>
                  <p className="text-sm text-vet-disabled leading-relaxed">
                    Controle de parâmetros, medicações e evolução diária de pacientes.
                  </p>
                </div>

                 {/* Card Explicação Doenças - FUTURO */}
                 <div className="relative bg-vet-card/40 border border-vet-border/50 p-6 rounded-2xl opacity-60 cursor-not-allowed text-left hover:opacity-80 transition-all">
                  <div className="bg-vet-input p-3 rounded-xl w-fit mb-4">
                    <BookOpen className="w-8 h-8 text-vet-disabled" />
                  </div>
                  <h3 className="text-lg font-bold text-vet-disabled mb-2 flex items-center justify-between">
                    Explicação de Doenças
                    <span className="text-xs bg-vet-input px-2 py-1 rounded text-vet-disabled border border-vet-border">Em Breve</span>
                  </h3>
                  <p className="text-sm text-vet-disabled leading-relaxed">
                    Gere textos educativos e didáticos sobre patologias comuns.
                  </p>
                </div>
              </div>
            </div>

            {/* SEÇÃO: FUNCIONALIDADES */}
            <div>
              <h3 className="text-xs font-bold text-vet-muted uppercase tracking-wider mb-4 border-b border-vet-border pb-2">
                Funcionalidades
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Card Minhas Horas - ATIVO */}
                <button 
                  onClick={() => setCurrentView('hours-log')}
                  className="group relative bg-vet-card hover:bg-[#1A1E29] border border-vet-border hover:border-vet-brand/50 p-6 rounded-2xl shadow-xl transition-all duration-300 text-left"
                >
                  <div className="bg-vet-brand/10 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300 border border-vet-brand/20">
                    <Clock className="w-8 h-8 text-vet-brand" />
                  </div>
                  <h3 className="text-lg font-bold text-vet-title mb-2 flex items-center justify-between">
                    Minhas Horas
                    <ChevronRight className="w-5 h-5 text-vet-muted group-hover:text-vet-brand transition-colors" />
                  </h3>
                  <p className="text-sm text-vet-muted leading-relaxed">
                    Controle seu banco de horas, plantões comerciais e noturnos.
                  </p>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-vet-brand/10 rounded-2xl pointer-events-none transition-all"></div>
                </button>

                 {/* Card Escala - FUTURO */}
                 <div className="relative bg-vet-card/40 border border-vet-border/50 p-6 rounded-2xl opacity-60 cursor-not-allowed text-left hover:opacity-80 transition-all">
                  <div className="bg-vet-input p-3 rounded-xl w-fit mb-4">
                    <Calendar className="w-8 h-8 text-vet-disabled" />
                  </div>
                  <h3 className="text-lg font-bold text-vet-disabled mb-2 flex items-center justify-between">
                    Escala
                    <span className="text-xs bg-vet-input px-2 py-1 rounded text-vet-disabled border border-vet-border">Em Breve</span>
                  </h3>
                  <p className="text-sm text-vet-disabled leading-relaxed">
                    Visualize escalas de plantão e organize trocas de turno.
                  </p>
                </div>

                {/* Card Calculadora - FUTURO */}
                <div className="relative bg-vet-card/40 border border-vet-border/50 p-6 rounded-2xl opacity-60 cursor-not-allowed text-left hover:opacity-80 transition-all">
                  <div className="bg-vet-input p-3 rounded-xl w-fit mb-4">
                    <Calculator className="w-8 h-8 text-vet-disabled" />
                  </div>
                  <h3 className="text-lg font-bold text-vet-disabled mb-2 flex items-center justify-between">
                    Calculadora
                    <span className="text-xs bg-vet-input px-2 py-1 rounded text-vet-disabled border border-vet-border">Em Breve</span>
                  </h3>
                  <p className="text-sm text-vet-disabled leading-relaxed">
                    Doses de medicamentos e conversões de fluido.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

        {currentView === 'nightly-report' && (
          <NightlyReport onBack={() => setCurrentView('dashboard')} currentUser={currentUser} />
        )}

        {currentView === 'hours-log' && (
          <HoursLog onBack={() => setCurrentView('dashboard')} currentUser={currentUser} />
        )}

        {currentView === 'profile' && (
          <UserProfile 
            currentUser={currentUser} 
            onUpdateUser={handleUpdateUser}
            onBack={() => setCurrentView('dashboard')} 
          />
        )}

      </main>
    </div>
  );
};

export default App;