# Botão Flutuante do WhatsApp

## ✅ Implementação Concluída

O botão flutuante do WhatsApp foi implementado com sucesso e está disponível em todas as páginas da aplicação.

### 🎯 Características

- **Posição Fixa**: Canto inferior direito (configurável)
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Acessível**: Suporte a navegação por teclado e screen readers
- **Personalizável**: Mensagens diferentes por página
- **Animado**: Efeito de pulso e hover
- **Tooltip**: Mensagem explicativa no hover

### 📱 Funcionalidades

1. **Mensagens Personalizadas**:
   - Página inicial: "Olá! Gostaria de saber mais sobre as cicloviagens do Elias Santos."
   - Página Sobre: "Olá! Gostaria de conhecer melhor o Elias Santos e suas cicloviagens."
   - Páginas de Viagem: "Olá! Gostaria de saber mais sobre esta viagem específica do Elias Santos."

2. **Configuração Flexível**:
   - Número do WhatsApp configurável
   - Posição do botão (4 opções)
   - Tamanho do botão (3 opções)
   - Animações liga/desliga
   - Tooltip liga/desliga

3. **Horário de Funcionamento** (opcional):
   - Verificação automática de horário
   - Mensagem personalizada fora do horário
   - Configuração de dias da semana

### ⚙️ Configuração

Para personalizar o botão, edite o arquivo `src/config/whatsapp.js`:

```javascript
export const WHATSAPP_CONFIG = {
  // Número do WhatsApp (formato: código do país + DDD + número)
  phoneNumber: '5511999999999',
  
  // Mensagens personalizadas
  messages: {
    home: 'Sua mensagem para a página inicial',
    sobre: 'Sua mensagem para a página sobre',
    viagem: 'Sua mensagem para páginas de viagem',
    default: 'Mensagem padrão'
  },
  
  // Configurações do botão
  button: {
    show: true, // true para mostrar, false para ocultar
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    size: 'medium', // small, medium, large
    showPulse: true, // animação de pulso
    showTooltip: true // tooltip no hover
  }
};
```

### 📋 Como Usar

1. **Alterar o Número**:
   ```javascript
   phoneNumber: '5511999999999' // Substitua pelo seu número
   ```

2. **Personalizar Mensagens**:
   ```javascript
   messages: {
     home: 'Sua mensagem personalizada para a página inicial'
   }
   ```

3. **Mudar Posição**:
   ```javascript
   position: 'bottom-left' // ou 'top-right', 'top-left'
   ```

4. **Alterar Tamanho**:
   ```javascript
   size: 'large' // ou 'small', 'medium'
   ```

5. **Desabilitar Animações**:
   ```javascript
   showPulse: false,
   showTooltip: false
   ```

### 🎨 Estilos CSS

O botão usa as seguintes classes CSS:
- `.whatsapp-button` - Classe principal
- `.whatsapp-button.small/medium/large` - Tamanhos
- `.whatsapp-button.bottom-right/bottom-left/top-right/top-left` - Posições
- `.whatsapp-tooltip` - Tooltip
- `.whatsapp-pulse` - Animação de pulso

### 📱 Responsividade

- **Desktop**: 60px x 60px
- **Tablet**: 55px x 55px
- **Mobile**: 50px x 50px

### ♿ Acessibilidade

- Suporte a navegação por teclado (Tab, Enter, Espaço)
- Atributos ARIA apropriados
- Texto alternativo descritivo
- Contraste adequado
- Respeita preferências de movimento reduzido

### 🔧 Manutenção

Para atualizar o botão:
1. Edite `src/config/whatsapp.js` para configurações
2. Edite `src/components/WhatsAppButton.css` para estilos
3. O botão aparece automaticamente em todas as páginas

### 📞 Formato do Número

Use o formato internacional:
- **Brasil**: 55 + DDD + número
- **Exemplo**: 5511999999999 (São Paulo)
- **Exemplo**: 5521987654321 (Rio de Janeiro)

### 🚀 Próximos Passos

1. **Configure seu número real** no arquivo de configuração
2. **Personalize as mensagens** conforme sua necessidade
3. **Teste em diferentes dispositivos** para garantir responsividade
4. **Configure horário de funcionamento** se necessário





