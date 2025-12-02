import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Hash, 
  Calendar, 
  Phone, 
  Save, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { User } from '../types';
import { authService } from '../services/authService';

interface UserProfileProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onBack: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ currentUser, onUpdateUser, onBack }) => {
  const [formData, setFormData] = useState<User>(currentUser);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (field: keyof User, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);

    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const updatedUser = authService.updateProfile(formData);
      onUpdateUser(updatedUser);
      setSuccessMessage("Perfil atualizado com sucesso!");
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-10 duration-500">
      
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-vet-muted hover:text-vet-brand transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar ao Menu
        </button>
      </div>

      <div className="bg-vet-card rounded-2xl shadow-xl border border-vet-border overflow-hidden max-w-2xl mx-auto">
        
        <div className="p-6 border-b border-vet-border bg-vet-bg/50">
          <h2 className="text-xl font-bold text-vet-title flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-vet-brand" />
            Meu Perfil
          </h2>
          <p className="text-vet-muted text-sm mt-1">Gerencie suas informações profissionais.</p>
        </div>

        <div className="p-6">
          {successMessage && (
            <div className="mb-6 bg-vet-success/10 border border-vet-success/30 p-4 rounded-xl flex items-center gap-3 text-vet-success animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Nome */}
            <div>
              <label className="block text-xs font-bold text-vet-muted uppercase tracking-wider mb-2 ml-1">
                Nome Completo
              </label>
              <div className="relative">
                <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-vet-disabled" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-vet-input border border-vet-border rounded-xl text-vet-title placeholder-vet-disabled focus:border-vet-brand focus:ring-1 focus:ring-vet-brand outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Email (Readonly) */}
            <div>
              <label className="block text-xs font-bold text-vet-muted uppercase tracking-wider mb-2 ml-1">
                Email (Login)
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-vet-disabled" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 bg-vet-bg border border-vet-border rounded-xl text-vet-disabled cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* CRMV */}
              <div>
                <label className="block text-xs font-bold text-vet-muted uppercase tracking-wider mb-2 ml-1">
                  CRMV / UF
                </label>
                <div className="relative">
                  <Hash className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-vet-disabled" />
                  <input
                    type="text"
                    value={formData.crmv || ''}
                    onChange={(e) => handleChange('crmv', e.target.value)}
                    placeholder="Ex: 12345/SP"
                    className="w-full pl-10 pr-4 py-3 bg-vet-input border border-vet-border rounded-xl text-vet-title placeholder-vet-disabled focus:border-vet-brand focus:ring-1 focus:ring-vet-brand outline-none transition-all"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-xs font-bold text-vet-muted uppercase tracking-wider mb-2 ml-1">
                  Telefone / Celular
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-vet-disabled" />
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full pl-10 pr-4 py-3 bg-vet-input border border-vet-border rounded-xl text-vet-title placeholder-vet-disabled focus:border-vet-brand focus:ring-1 focus:ring-vet-brand outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-xs font-bold text-vet-muted uppercase tracking-wider mb-2 ml-1">
                Data de Nascimento
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-vet-disabled" />
                <input
                  type="date"
                  value={formData.birthDate || ''}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-vet-input border border-vet-border rounded-xl text-vet-title placeholder-vet-disabled focus:border-vet-brand focus:ring-1 focus:ring-vet-brand outline-none transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-vet-brand hover:bg-vet-brand-hover active:bg-vet-brand-active text-white font-bold py-4 rounded-xl shadow-lg shadow-vet-brand/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                {!isSaving && <Save className="w-5 h-5" />}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};