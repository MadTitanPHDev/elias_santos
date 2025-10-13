// Configurações do WhatsApp Button
export const WHATSAPP_CONFIG = {
  // Número do WhatsApp (formato: código do país + DDD + número)
  // Exemplo: 5511999999999 (Brasil: 55, São Paulo: 11, número: 999999999)
  phoneNumber: '5511999999999',
  
  // Mensagens personalizadas por página
  messages: {
    home: 'Olá! Gostaria de saber mais sobre as cicloviagens do Elias Santos.',
    sobre: 'Olá! Gostaria de conhecer melhor o Elias Santos e suas cicloviagens.',
    viagem: 'Olá! Gostaria de saber mais sobre esta viagem específica do Elias Santos.',
    default: 'Olá! Gostaria de saber mais sobre as cicloviagens do Elias Santos.'
  },
  
  // Configurações do botão
  button: {
    show: true, // true para mostrar, false para ocultar
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    size: 'medium', // small, medium, large
    showPulse: true, // animação de pulso
    showTooltip: true // tooltip no hover
  },
  
  // Horário de funcionamento (opcional)
  businessHours: {
    enabled: false, // true para ativar verificação de horário
    timezone: 'America/Sao_Paulo',
    workingDays: [1, 2, 3, 4, 5], // 1 = segunda, 7 = domingo
    startTime: '09:00',
    endTime: '18:00',
    messageWhenClosed: 'Olá! Estamos fora do horário de funcionamento, mas responderemos assim que possível!'
  }
};

// Função para verificar se está no horário de funcionamento
export const isBusinessHours = () => {
  if (!WHATSAPP_CONFIG.businessHours.enabled) {
    return true;
  }
  
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.toLocaleTimeString('pt-BR', { 
    timeZone: WHATSAPP_CONFIG.businessHours.timezone,
    hour12: false 
  });
  
  const isWorkingDay = WHATSAPP_CONFIG.businessHours.workingDays.includes(currentDay);
  const isWorkingTime = currentTime >= WHATSAPP_CONFIG.businessHours.startTime && 
                       currentTime <= WHATSAPP_CONFIG.businessHours.endTime;
  
  return isWorkingDay && isWorkingTime;
};

// Função para obter a mensagem apropriada
export const getWhatsAppMessage = (pathname) => {
  if (pathname === '/') return WHATSAPP_CONFIG.messages.home;
  if (pathname === '/sobre') return WHATSAPP_CONFIG.messages.sobre;
  if (pathname.startsWith('/viagem/')) return WHATSAPP_CONFIG.messages.viagem;
  
  // Verificar horário de funcionamento
  if (!isBusinessHours()) {
    return WHATSAPP_CONFIG.businessHours.messageWhenClosed;
  }
  
  return WHATSAPP_CONFIG.messages.default;
};










