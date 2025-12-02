import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Calendar,
  Sun,
  Moon,
  Info,
  FileDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { User } from '../types';

// --- Interfaces ---

interface WorkDay {
  date: string; // ISO string para ID
  dayNumber: number;
  weekday: string;
  entryTime: string;
  exitTime: string;
}

interface MonthRecord {
  id: string;
  label: string; // Ex: "Novembro 2023"
  year: number;
  monthIndex: number; // 0-11
  commercialDays: WorkDay[];
  nightDays: WorkDay[];
}

interface HoursLogProps {
  onBack: () => void;
  currentUser: User;
}

// --- Component ---

export const HoursLog: React.FC<HoursLogProps> = ({ onBack, currentUser }) => {
  // Key for this specific user
  const STORAGE_KEY = `animale_hours_data_${currentUser.id}`;

  // State: Only stores array of Months for the CURRENT user
  const [months, setMonths] = useState<MonthRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Erro ao carregar dados de horas:", e);
      return [];
    }
  });
  
  const [selectedMonthId, setSelectedMonthId] = useState<string | null>(null);
  const [activeSheet, setActiveSheet] = useState<'commercial' | 'night'>('commercial');
  
  // UI States for Modals/Inputs
  const [showAddMonth, setShowAddMonth] = useState(false);
  const [newMonthYear, setNewMonthYear] = useState(new Date().getFullYear());
  const [newMonthIndex, setNewMonthIndex] = useState(new Date().getMonth());

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(months));
  }, [months, STORAGE_KEY]);

  // Set default selection
  useEffect(() => {
    if (months.length > 0 && !selectedMonthId) {
      setSelectedMonthId(months[0].id);
    }
  }, [months, selectedMonthId]);

  // --- Actions ---

  const generateDays = (year: number, monthIndex: number): WorkDay[] => {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const days: WorkDay[] = [];
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, monthIndex, i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayNumber: i,
        weekday: weekdays[date.getDay()],
        entryTime: '',
        exitTime: ''
      });
    }
    return days;
  };

  const handleAddMonth = () => {
    const daysTemplate = generateDays(newMonthYear, newMonthIndex);
    
    // Clonagem profunda
    const commercialDays = JSON.parse(JSON.stringify(daysTemplate));
    const nightDays = JSON.parse(JSON.stringify(daysTemplate));

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const label = `${monthNames[newMonthIndex]} ${newMonthYear}`;

    const newMonth: MonthRecord = {
      id: `${newMonthYear}-${newMonthIndex}-${Date.now()}`,
      label,
      year: newMonthYear,
      monthIndex: newMonthIndex,
      commercialDays,
      nightDays
    };

    setMonths([...months, newMonth]);
    setSelectedMonthId(newMonth.id);
    setShowAddMonth(false);
    setActiveSheet('commercial');
  };

  const handleDeleteMonth = (monthId: string) => {
    if (confirm("Excluir esta planilha mensal?")) {
      const newMonths = months.filter(m => m.id !== monthId);
      setMonths(newMonths);
      if (selectedMonthId === monthId) setSelectedMonthId(null);
    }
  };

  const handleTimeChange = (monthId: string, dayDate: string, sheetType: 'commercial' | 'night', field: 'entryTime' | 'exitTime', value: string) => {
    const updatedMonths = months.map(month => {
      if (month.id === monthId) {
        // Seleciona qual array atualizar
        const targetArrayName = sheetType === 'commercial' ? 'commercialDays' : 'nightDays';
        const daysArray = month[targetArrayName];

        const updatedDays = daysArray.map(day => {
          if (day.date === dayDate) {
            return { ...day, [field]: value };
          }
          return day;
        });
        
        return { ...month, [targetArrayName]: updatedDays };
      }
      return month;
    });
    setMonths(updatedMonths);
  };

  // --- Calculations ---

  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    
    let startMin = startH * 60 + startM;
    let endMin = endH * 60 + endM;

    // Se o fim for menor que o início, assume que passou da meia noite (adiciona 24h)
    if (endMin < startMin) {
      endMin += 24 * 60;
    }

    return (endMin - startMin) / 60; // Retorna em horas decimais
  };

  const formatHours = (decimalHours: number) => {
    if (decimalHours === 0) return "-";
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  };

  const getSelectedMonth = () => months.find(m => m.id === selectedMonthId);

  const calculateMonthTotal = (days: WorkDay[]) => {
    return days.reduce((acc, day) => acc + calculateDuration(day.entryTime, day.exitTime), 0);
  };

  // --- PDF Export ---
  
  const handleExportPDF = () => {
    const month = getSelectedMonth();
    if (!month) return;

    const doc = new jsPDF();
    const totalCommercial = calculateMonthTotal(month.commercialDays);
    const totalNight = calculateMonthTotal(month.nightDays);
    const grandTotal = totalCommercial + totalNight;

    // Title Section
    doc.setFontSize(18);
    doc.text("Relatório de Horas - VetFlow", 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Veterinário(a): ${currentUser.name}`, 14, 30);
    doc.text(`Referência: ${month.label}`, 14, 38);

    // Helper for table data
    const generateTableData = (days: WorkDay[]) => {
      return days.map(day => {
        const hours = calculateDuration(day.entryTime, day.exitTime);
        const isNextDay = day.entryTime && day.exitTime && day.exitTime < day.entryTime;
        return [
          day.dayNumber,
          day.weekday,
          day.entryTime || "-",
          day.exitTime ? (isNextDay ? `${day.exitTime} (+1)` : day.exitTime) : "-",
          hours > 0 ? formatHours(hours) : "-"
        ];
      });
    };

    // --- TABLE 1: Commercial (Using Brand Orange) ---
    doc.setFontSize(14);
    doc.setTextColor(255, 106, 26); // Brand Orange #FF6A1A
    doc.text("Horário Comercial", 14, 50);
    
    autoTable(doc, {
      startY: 55,
      head: [['Dia', 'Sem', 'Entrada', 'Saída', 'Total']],
      body: generateTableData(month.commercialDays),
      theme: 'grid',
      headStyles: { fillColor: [255, 106, 26] }, // Brand Orange
      foot: [['', '', '', 'TOTAL PARCIAL:', formatHours(totalCommercial)]],
      footStyles: { fillColor: [255, 237, 213], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    // --- TABLE 2: Night (Using Info Blue) ---
    // Get Y position after first table
    let finalY = (doc as any).lastAutoTable.finalY || 150;
    
    // Check if we need a new page
    if (finalY > 200) {
      doc.addPage();
      finalY = 20;
    } else {
      finalY += 15;
    }

    doc.setFontSize(14);
    doc.setTextColor(62, 166, 255); // Info Blue #3EA6FF
    doc.text("Plantão Noturno", 14, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Dia', 'Sem', 'Entrada', 'Saída', 'Total']],
      body: generateTableData(month.nightDays),
      theme: 'grid',
      headStyles: { fillColor: [62, 166, 255] }, // Info Blue
      foot: [['', '', '', 'TOTAL PARCIAL:', formatHours(totalNight)]],
      footStyles: { fillColor: [224, 231, 255], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    // --- SUMMARY ---
    finalY = (doc as any).lastAutoTable.finalY + 20;
    
    if (finalY > 250) {
      doc.addPage();
      finalY = 20;
    }

    doc.setFillColor(248, 250, 252); // Slate 50
    doc.setDrawColor(203, 213, 225); // Slate 300
    doc.rect(14, finalY, 180, 40, 'FD');

    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text("Resumo Geral", 20, finalY + 12);

    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85); // Slate 700
    doc.text(`Total Comercial: ${formatHours(totalCommercial)}`, 20, finalY + 22);
    doc.text(`Total Noturno:   ${formatHours(totalNight)}`, 20, finalY + 30);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL DE HORAS: ${formatHours(grandTotal)}`, 120, finalY + 25);

    doc.save(`Relatorio_Horas_${currentUser.name.replace(/ /g, '_')}_${month.label.replace(/ /g, '_')}.pdf`);
  };

  // --- Render Helpers ---

  const renderMonthSelector = () => {
    if (months.length === 0 && !showAddMonth) {
      return (
        <div className="text-center py-10 bg-vet-card rounded-2xl border border-vet-border border-dashed">
          <Calendar className="w-12 h-12 text-vet-disabled mx-auto mb-3" />
          <h3 className="text-vet-text font-medium mb-2">Nenhum mês registrado</h3>
          <p className="text-vet-muted text-sm mb-4">Comece criando sua primeira planilha de ponto.</p>
          <button 
            onClick={() => setShowAddMonth(true)}
            className="px-5 py-2.5 bg-vet-brand hover:bg-vet-brand-hover text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-vet-brand/20"
          >
            Adicionar Mês
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="text-xs text-vet-muted font-bold uppercase tracking-wider mb-2 block">Selecione o Mês</label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-vet-border">
             <button
              onClick={() => setShowAddMonth(true)}
              className="flex items-center gap-1 px-4 py-2 bg-vet-input hover:bg-vet-border text-vet-brand border border-vet-brand/30 border-dashed rounded-lg whitespace-nowrap transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Novo Mês
            </button>
            {months.map(month => (
              <button
                key={month.id}
                onClick={() => setSelectedMonthId(month.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition-all ${
                  selectedMonthId === month.id
                    ? 'bg-vet-brand text-white border-vet-brand shadow-lg shadow-vet-brand/30'
                    : 'bg-vet-card text-vet-muted border-vet-border hover:border-vet-disabled hover:text-vet-text'
                }`}
              >
                {month.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- Main Render ---

  const selectedMonth = getSelectedMonth();
  const activeDays = selectedMonth 
    ? (activeSheet === 'commercial' ? selectedMonth.commercialDays : selectedMonth.nightDays)
    : [];

  return (
    <div className="animate-in fade-in slide-in-from-right-10 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-vet-muted hover:text-vet-brand transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar ao Menu
        </button>
      </div>

      <div className="bg-vet-card rounded-2xl shadow-xl border border-vet-border overflow-hidden">
        
        {/* User Info Bar */}
        <div className="p-4 border-b border-vet-border bg-vet-bg/50 flex justify-between items-center">
             <h2 className="text-sm font-bold text-vet-muted uppercase tracking-wide">
               Minhas Horas
             </h2>
             <span className="text-sm text-vet-brand font-medium">{currentUser.name}</span>
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6">
          
          {/* Month Management */}
          {renderMonthSelector()}

          {/* Add Month Form */}
          {showAddMonth && (
              <div className="mb-6 bg-vet-input p-5 rounded-xl border border-vet-border animate-in fade-in">
                <h3 className="text-sm font-bold text-vet-title mb-4">Adicionar Novo Mês</h3>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="text-xs text-vet-muted block mb-1">Mês</label>
                    <select 
                      value={newMonthIndex}
                      onChange={(e) => setNewMonthIndex(Number(e.target.value))}
                      className="w-full bg-vet-card border border-vet-border rounded-lg px-3 py-2 text-vet-text text-sm outline-none focus:border-vet-brand"
                    >
                      {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"].map((m, i) => (
                        <option key={i} value={i}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-vet-muted block mb-1">Ano</label>
                    <input 
                      type="number"
                      value={newMonthYear}
                      onChange={(e) => setNewMonthYear(Number(e.target.value))}
                      className="w-full bg-vet-card border border-vet-border rounded-lg px-3 py-2 text-vet-text text-sm outline-none focus:border-vet-brand"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowAddMonth(false)} className="px-4 py-2 text-vet-muted hover:text-vet-text text-sm">Cancelar</button>
                  <button onClick={handleAddMonth} className="px-4 py-2 bg-vet-brand hover:bg-vet-brand-hover text-white rounded-lg text-sm font-bold">Gerar Planilha</button>
                </div>
              </div>
          )}

          {/* Timesheet Table */}
          {selectedMonth && (
            <div className="animate-in slide-in-from-bottom-5">
                
                {/* Header & Tabs */}
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-lg font-bold text-vet-title flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-vet-brand" />
                        Planilha de {selectedMonth.label}
                      </h3>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={handleExportPDF}
                          className="text-xs bg-vet-input hover:bg-vet-border text-vet-text hover:text-white px-3 py-1.5 rounded border border-vet-border transition-colors flex items-center gap-1.5 font-medium"
                        >
                          <FileDown className="w-4 h-4 text-vet-success" /> Baixar PDF
                        </button>
                        <button 
                          onClick={() => selectedMonthId && handleDeleteMonth(selectedMonthId)}
                          className="text-xs bg-vet-error/10 hover:bg-vet-error/20 text-vet-error px-3 py-1.5 rounded border border-vet-error/20 transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3 h-3" /> Apagar Mês
                        </button>
                      </div>
                  </div>

                  {/* Sheet Type Tabs */}
                  <div className="bg-vet-bg p-1 rounded-lg border border-vet-border flex">
                    <button
                      onClick={() => setActiveSheet('commercial')}
                      className={`flex-1 py-2.5 px-3 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        activeSheet === 'commercial' 
                          ? 'bg-vet-brand text-white shadow' 
                          : 'text-vet-muted hover:bg-vet-card hover:text-vet-text'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      Horário Comercial
                    </button>
                    <button
                      onClick={() => setActiveSheet('night')}
                      className={`flex-1 py-2.5 px-3 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        activeSheet === 'night' 
                          ? 'bg-vet-info text-white shadow' 
                          : 'text-vet-muted hover:bg-vet-card hover:text-vet-text'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      Plantão Noturno
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-vet-border shadow-2xl">
                  <table className="w-full text-sm text-left text-vet-text">
                    <thead className="text-xs text-vet-muted uppercase bg-vet-input border-b border-vet-border">
                      <tr>
                        <th className="px-4 py-3 font-medium">Dia</th>
                        <th className="px-4 py-3 font-medium">Semana</th>
                        <th className={`px-4 py-3 font-medium ${activeSheet === 'commercial' ? 'text-vet-brand' : 'text-vet-info'}`}>Entrada</th>
                        <th className={`px-4 py-3 font-medium ${activeSheet === 'commercial' ? 'text-vet-brand' : 'text-vet-info'}`}>Saída</th>
                        <th className="px-4 py-3 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-vet-border bg-vet-card">
                      {activeDays.map((day) => {
                        const hours = calculateDuration(day.entryTime, day.exitTime);
                        const isWeekend = day.weekday === 'Sáb' || day.weekday === 'Dom';
                        const isNextDay = day.entryTime && day.exitTime && day.exitTime < day.entryTime;
                        
                        return (
                          <tr key={day.date} className={`hover:bg-vet-bg/50 transition-colors ${isWeekend ? 'bg-vet-bg/30' : ''}`}>
                            <td className="px-4 py-2 font-medium text-vet-title">{day.dayNumber}</td>
                            <td className={`px-4 py-2 ${isWeekend ? (activeSheet === 'commercial' ? 'text-vet-brand' : 'text-vet-info') + ' font-medium' : 'text-vet-muted'}`}>{day.weekday}</td>
                            <td className="px-4 py-2">
                              <input 
                                type="time" 
                                value={day.entryTime}
                                onChange={(e) => selectedMonthId && handleTimeChange(selectedMonthId, day.date, activeSheet, 'entryTime', e.target.value)}
                                className={`bg-vet-input border rounded px-2 py-1 text-vet-title text-xs w-24 outline-none transition-colors ${activeSheet === 'commercial' ? 'border-vet-border focus:border-vet-brand' : 'border-vet-border focus:border-vet-info'}`}
                              />
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <input 
                                  type="time" 
                                  value={day.exitTime}
                                  onChange={(e) => selectedMonthId && handleTimeChange(selectedMonthId, day.date, activeSheet, 'exitTime', e.target.value)}
                                  className={`bg-vet-input border rounded px-2 py-1 text-vet-title text-xs w-24 outline-none transition-colors ${activeSheet === 'commercial' ? 'border-vet-border focus:border-vet-brand' : 'border-vet-border focus:border-vet-info'}`}
                                />
                                {isNextDay && (
                                  <span className="text-[10px] font-bold text-vet-warning bg-vet-warning/10 px-1.5 py-0.5 rounded border border-vet-warning/20 whitespace-nowrap" title="Considerado dia seguinte">
                                    +1 dia
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-2 text-right font-mono font-medium text-vet-text">
                              {formatHours(hours)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-vet-input border-t border-vet-border font-bold text-vet-title">
                      <tr>
                        <td colSpan={5} className="px-4 py-2 bg-vet-bg/50 border-b border-vet-border text-xs text-vet-muted italic flex items-center gap-1.5">
                            <Info className="w-3 h-3" />
                            Nota: Se o horário de saída for menor que o de entrada (ex: 19h às 07h), o sistema adiciona 24h automaticamente (+1 dia).
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="px-4 py-4 text-right uppercase text-xs tracking-wider text-vet-muted">Total {activeSheet === 'commercial' ? 'Comercial' : 'Noturno'}</td>
                        <td className={`px-4 py-4 text-right text-base ${activeSheet === 'commercial' ? 'text-vet-brand' : 'text-vet-info'}`}>
                          {formatHours(calculateMonthTotal(activeDays))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};