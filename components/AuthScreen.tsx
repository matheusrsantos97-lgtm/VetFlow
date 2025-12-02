import React, { useState } from 'react';
import { ArrowRight, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { User } from '../types';
import { Logo } from './Logo';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Simulating network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      if (isLogin) {
        const user = authService.login(email, password);
        onLoginSuccess(user);
      } else {
        if (!name.trim()) throw new Error("Por favor, informe seu nome.");
        const user = authService.register(name, email, password);
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-vet-bg text-vet-text">
      
      {/* Brand */}
      <div className="mb-10 text-center animate-in fade-in zoom-in duration-700">
        <div className="bg-vet-brand/10 p-5 rounded-3xl border border-vet-brand/20 w-fit mx-auto mb-6 shadow-[0_0_40px_rgba(255,106,26,0.1)]">
          <Logo className="w-16 h-16 text-vet-brand" />
        </div>
        <h1 className="text-4xl font-bold text-vet-title mb-3 tracking-tight">VetFlow</h1>
        <p className="text-vet-muted text-lg">Sua plataforma clínica facilitadora.</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-vet-card p-8 rounded-3xl shadow-2xl border border-vet-border animate-in slide-in-from-bottom-10 duration-500">
        
        <div className="flex gap-4 mb-8 p-1.5 bg-vet-input rounded-xl border border-vet-border">
          <button
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-vet-brand text-white shadow-lg' : 'text-vet-muted hover:text-vet-text hover:bg-vet-card'}`}
          >
            Entrar
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-vet-brand text-white shadow-lg' : 'text-vet-muted hover:text-vet-text hover:bg-vet-card'}`}
          >
            Criar Conta
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-vet-error/10 border border-vet-error/30 p-4 rounded-xl flex items-center gap-3 text-vet-error text-sm animate-in shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-vet-muted uppercase tracking-wider ml-1">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Dra. Ana Silva"
                className="w-full bg-vet-input border border-vet-border rounded-xl px-4 py-3.5 text-vet-title placeholder-vet-disabled focus:border-vet-brand focus:ring-1 focus:ring-vet-brand outline-none transition-all"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-vet-muted uppercase tracking-wider ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-vet-input border border-vet-border rounded-xl px-4 py-3.5 text-vet-title placeholder-vet-disabled focus:border-vet-brand focus:ring-1 focus:ring-vet-brand outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-vet-muted uppercase tracking-wider ml-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-vet-input border border-vet-border rounded-xl px-4 py-3.5 text-vet-title placeholder-vet-disabled focus:border-vet-brand focus:ring-1 focus:ring-vet-brand outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-vet-brand hover:bg-vet-brand-hover active:bg-vet-brand-active text-white font-bold py-4 rounded-xl shadow-lg shadow-vet-brand/20 transition-all flex items-center justify-center gap-2 mt-8 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="animate-pulse">Processando...</span>
            ) : (
              <>
                {isLogin ? 'Acessar Sistema' : 'Cadastrar e Entrar'}
                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              </>
            )}
          </button>
        </form>
      </div>

      <p className="mt-8 text-vet-disabled text-sm">
        © 2024 VetFlow. Todos os direitos reservados.
      </p>
    </div>
  );
};