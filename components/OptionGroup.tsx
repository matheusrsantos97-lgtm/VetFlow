import React from 'react';
import { Check, Square, CheckSquare } from 'lucide-react';
import { OptionItem } from '../types';

interface OptionGroupProps {
  title: string;
  icon?: React.ReactNode;
  options: OptionItem[];
  selectedOption: string | string[]; // Pode ser string única ou array de strings
  onSelect: (option: any) => void;
  multiSelect?: boolean; // Nova prop para ativar seleção múltipla
}

export const OptionGroup: React.FC<OptionGroupProps> = ({ 
  title, 
  icon, 
  options, 
  selectedOption, 
  onSelect,
  multiSelect = false
}) => {
  
  const isOptionSelected = (label: string): boolean => {
    if (multiSelect && Array.isArray(selectedOption)) {
      return selectedOption.includes(label);
    }
    return selectedOption === label;
  };

  const handleSelect = (label: string) => {
    if (multiSelect && Array.isArray(selectedOption)) {
      const currentSelection = [...selectedOption];
      if (currentSelection.includes(label)) {
        onSelect(currentSelection.filter(item => item !== label));
      } else {
        onSelect([...currentSelection, label]);
      }
    } else {
      onSelect(label);
    }
  };

  const getClasses = (sentiment: string, isSelected: boolean) => {
    // New Color Palette Logic
    
    // Positive (Success Green)
    if (sentiment === 'positive') {
      return isSelected 
        ? 'bg-[#4CC38A]/20 border-[#4CC38A] text-[#4CC38A] ring-1 ring-[#4CC38A] shadow-[0_0_15px_rgba(76,195,138,0.15)]' // Selected
        : 'bg-[#4CC38A]/5 border-[#4CC38A]/20 text-[#4CC38A]/80 hover:bg-[#4CC38A]/10 hover:border-[#4CC38A]/40'; // Unselected
    }
    
    // Negative (Error Red)
    if (sentiment === 'negative') {
      return isSelected
        ? 'bg-[#FF5C5C]/20 border-[#FF5C5C] text-[#FF5C5C] ring-1 ring-[#FF5C5C] shadow-[0_0_15px_rgba(255,92,92,0.15)]' // Selected
        : 'bg-[#FF5C5C]/5 border-[#FF5C5C]/20 text-[#FF5C5C]/80 hover:bg-[#FF5C5C]/10 hover:border-[#FF5C5C]/40'; // Unselected
    }

    // Neutral (VetFlow Brand/Default)
    return isSelected
      ? 'bg-vet-brand/20 border-vet-brand text-vet-brand ring-1 ring-vet-brand shadow-[0_0_15px_rgba(255,106,26,0.15)]' // Selected
      : 'bg-vet-input border-vet-border text-vet-muted hover:bg-vet-border hover:text-vet-text hover:border-vet-muted/50'; // Unselected
  };

  const getCheckColor = (sentiment: string) => {
    if (sentiment === 'positive') return 'text-vet-success';
    if (sentiment === 'negative') return 'text-vet-error';
    return 'text-vet-brand'; // Brand Orange for neutral
  };

  return (
    <div className="mb-6 bg-vet-card p-5 rounded-xl shadow-lg border border-vet-border">
      <div className="flex items-center gap-2 mb-4">
        {icon && <div className="text-vet-brand">{icon}</div>}
        <h3 className="text-sm font-semibold text-vet-title uppercase tracking-wide">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = isOptionSelected(option.label);
          const styleClasses = getClasses(option.sentiment, isSelected);

          return (
            <button
              type="button"
              key={option.label}
              onClick={() => handleSelect(option.label)}
              className={`
                relative text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center justify-between group
                ${styleClasses}
              `}
            >
              <span className="pr-6">{option.label}</span>
              {isSelected && !multiSelect && (
                <Check className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 ${getCheckColor(option.sentiment)}`} />
              )}
              {multiSelect && (
                 isSelected 
                 ? <CheckSquare className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 ${getCheckColor(option.sentiment)}`} />
                 : <Square className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-vet-disabled" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};