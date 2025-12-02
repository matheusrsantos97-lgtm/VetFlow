import { GoogleGenAI } from "@google/genai";
import { PatientInfo, DailyReportData, ReportType } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please select a valid Google Cloud project.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateVeterinaryReport = async (
  patient: PatientInfo,
  data: DailyReportData,
  reportType: ReportType
): Promise<string> => {
  const ai = createClient();
  
  // Format helpers
  const foodOfferedStr = data.foodTypes && data.foodTypes.length > 0 
    ? data.foodTypes.join(", ") 
    : "Não especificado";

  const bloodExamsStr = data.bloodExams && data.bloodExams.length > 0
    ? data.bloodExams.join(", ")
    : "";

  const imagingExamsStr = data.imagingExams && data.imagingExams.length > 0
    ? data.imagingExams.join(", ")
    : "";
    
  const hospitalizationStr = data.hospitalizationRequests && data.hospitalizationRequests.length > 0
    ? data.hospitalizationRequests.join(", ")
    : "";

  let prompt = "";

  if (reportType === 'tutor') {
    // PROMPT PARA TUTOR (WhatsApp)
    prompt = `
      CONTEXTO: Você é um assistente virtual auxiliando um veterinário a escrever um relatório de plantão.
      
      INSTRUÇÃO DE FIDELIDADE: O relatório deve refletir fielmente as opções marcadas. Não generalize se a opção for específica.
      
      DADOS DO VETERINÁRIO:
      - Nome: ${data.vetName || "Veterinário Plantonista"}

      DADOS DO PACIENTE:
      - Nome: ${patient.name}
      - Tutor: ${patient.tutorName}
      - Espécie: ${patient.species}
      - Sexo: ${patient.gender}

      PARÂMETROS CLÍNICOS SELECIONADOS:
      1. Comportamento na Noite: "${data.nightStatus || "Não informado"}"
      2. Estado Geral (Manhã): "${data.generalState || "Não informado"}"
      3. Apetite: "${data.appetite || "Não informado"}"
      4. Alimentos Ofertados/Aceitos: "${foodOfferedStr}"
      5. Ingestão de Água: "${data.waterIntake || "Não informado"}"
      6. Vômito: "${data.vomit || "Não informado"}"
      7. Respiratório: "${data.respiratory || "Não informado"}"
      8. Urina (Cor/Aspecto): "${data.urine || "Não informado"}"
      9. Fezes: "${data.feces || "Não informado"}"
      10. Evolução Clínica (Prognóstico): "${data.evolution || "Não informado"}"
      11. Observações/Medicações: "${data.notes ? data.notes : "VAZIO_IGNORAR"}"

      SOLICITAÇÕES FINANCEIRAS E EXAMES (Se houver):
      - Exames de Sangue: "${bloodExamsStr}"
      - Exames de Imagem: "${imagingExamsStr}"
      - Internamento: "${hospitalizationStr}"

      ESTRUTURA OBRIGATÓRIA DA MENSAGEM:
      
      1. INÍCIO (Copie exatamente): 
         "Bom dia ${patient.tutorName} tudo bem ? Segue o boletim do plantão noturno do ${patient.name}"

      2. CORPO DO TEXTO (Clínico):
         - Transforme os parâmetros em texto corrido, natural e profissional.
         - Use emojis moderados.
         - Mencione sobre vômitos ou alterações respiratórias se houver.
         - Destaque a evolução clínica.
         - REGRA DE OBSERVAÇÕES: Se o campo "Observações/Medicações" acima estiver marcado como "VAZIO_IGNORAR", você está PROIBIDO de escrever frases como "Não houve observações extras" ou "Sem intercorrências". Simplesmente ignore este tópico.

      3. SOLICITAÇÕES/EXAMES (CRÍTICO):
         - SE houver itens listados em Exames de Sangue, Imagem ou Internamento, você deve usar EXATAMENTE esta frase padrão para apresentá-los:
           "A veterinária responsável recomendou a realização do [NOME DO EXAME/SOLICITAÇÃO] hoje. Você autoriza?"
         - Caso haja múltiplos itens, adapte ligeiramente para listar todos, mas mantendo a pergunta de autorização no final. Mantenha os valores visíveis se fornecidos.
         - SE NÃO houver solicitações, não escreva este parágrafo.

      4. FECHAMENTO (Copie exatamente antes da assinatura):
         "Se precisar de mais alguma informação, nos avise, e a veterinária responsável entrará em contato assim que possível."

      5. ASSINATURA:
         "Att, Veterinário(a) ${data.vetName || "Plantonista"}"
    `;
  } else {
    // PROMPT PARA PRONTUÁRIO MÉDICO (SIMPLIFICADO E LIMPO)
    prompt = `
      TAREFA: Preencher ficha clínica veterinária.
      
      IMPORTANTE SOBRE FORMATAÇÃO:
      - NÃO use colchetes [ ] na saída final.
      - NÃO use termos técnicos complexos (ex: Não use "Eupneico", use "Respiração normal". Não use "Êmese", use "Vômito").
      - Use linguagem simples e direta.
      - Se houver termos técnicos entre parênteses nos dados de entrada (ex: "Respiração Normal (Eupneico)"), REMOVA o que está nos parênteses e deixe apenas a parte simples.

      DADOS ENTRADA:
      - Noite: ${data.nightStatus}
      - Geral: ${data.generalState}
      - Apetite: ${data.appetite} (Oferta: ${foodOfferedStr})
      - Água: ${data.waterIntake}
      - Respiratório: ${data.respiratory}
      - Urina: ${data.urine}
      - Fezes: ${data.feces}
      - Vômito: ${data.vomit}
      - Extras: ${data.notes}
      - Exames: ${bloodExamsStr} ${imagingExamsStr} ${hospitalizationStr}

      SAÍDA ESPERADA (Preencha os campos com texto simples, sem colchetes):

      Como passou o período: Resuma "${data.nightStatus}" e "${data.generalState}" em linguagem simples.

      Ficou em pé, andou pela baia ou passeio: Baseado no estado geral (${data.generalState}), diga simplesmente se ficou em pé, andou ou ficou deitado.

      Comeu: ${data.appetite} - Oferta: ${foodOfferedStr}

      Bebeu: ${data.waterIntake}

      Urina: ${data.urine} (Remova termos técnicos se houver)

      Fezes: ${data.feces}

      Vômito: ${data.vomit} (Use "sem vômito" ou descreva o tipo simplesmente)

      Outras informações relevantes: ${data.respiratory ? "Respiratório: " + data.respiratory + ". " : ""} ${data.notes ? data.notes : "Sem observações adicionais."} ${bloodExamsStr || imagingExamsStr || hospitalizationStr ? "| Solicitado: " + bloodExamsStr + " " + imagingExamsStr + " " + hospitalizationStr : ""}

      Contato com o tutor: Boletim enviado via WhatsApp
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 2000,
        temperature: reportType === 'medical' ? 0.1 : 0.7,
        systemInstruction: "Você é um assistente veterinário profissional. O uso de terminologia médica, descrição de fluidos corporais (sangue, vômito, urina, fezes) e procedimentos clínicos é esperado e autorizado para fins de documentação técnica e comunicação com tutores. Não bloqueie conteúdo clínico.",
        safetySettings: [
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' }
        ]
      }
    });

    if (response.text) {
      return response.text;
    }

    // Diagnóstico detalhado de erro se não houver texto
    const candidate = response.candidates?.[0];
    if (candidate) {
        if (candidate.finishReason === 'SAFETY') {
            return "Erro: O conteúdo foi bloqueado pelo filtro de segurança da IA (provavelmente devido a termos médicos sensíveis). Tente reformular removendo detalhes gráficos.";
        }
        return `Erro: A IA parou de gerar o texto. Motivo técnico: ${candidate.finishReason}`;
    }

    return "Erro: A IA retornou uma resposta vazia. Verifique sua conexão ou tente novamente.";

  } catch (error: any) {
    console.error("Error generating report:", error);
    throw new Error(error.message || "Erro desconhecido ao gerar relatório.");
  }
};

export const refineVeterinaryReport = async (
  currentReport: string,
  instructions: string
): Promise<string> => {
  const ai = createClient();

  const prompt = `
    TEXTO ATUAL:
    """
    ${currentReport}
    """

    SOLICITAÇÃO DE ALTERAÇÃO:
    "${instructions}"

    TAREFA:
    Reescreva o texto atual aplicando as alterações. Mantenha o tom profissional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 2000,
        temperature: 0.7,
        systemInstruction: "Você é um assistente veterinário. Ajuste o texto conforme solicitado.",
        safetySettings: [
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' }
        ]
      }
    });

    return response.text || currentReport;
  } catch (error: any) {
    console.error("Error refining report:", error);
    throw new Error("Não foi possível refinar o relatório.");
  }
};
