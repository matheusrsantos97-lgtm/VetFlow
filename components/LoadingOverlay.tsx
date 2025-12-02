import React from 'react';
import { Logo } from './Logo';

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-vet-bg/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-vet-card p-8 rounded-2xl shadow-2xl border border-vet-border flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <Logo className="w-16 h-16 text-vet-brand animate-pulse mb-6" />
        <p className="text-vet-title font-bold text-xl">Gerando relatório...</p>
        <p className="text-vet-muted text-sm mt-2">A inteligência artificial está trabalhando.</p>
      </div>
    </div>
  );
};