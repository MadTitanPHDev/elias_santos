# 🚴‍♂️ Elias Santos - Sistema de Cicloviagens

Sistema web completo para gerenciamento e visualização de viagens de bicicleta, desenvolvido com React no frontend e PHP no backend.

## 🏗️ Arquitetura

### **Frontend (React)**
- **Framework**: React 19.1.1 com React Router DOM
- **Autenticação**: JWT com localStorage
- **UI**: Componentes customizados responsivos
- **SEO**: React Helmet Async para meta tags

### **Backend (PHP)**
- **Linguagem**: PHP puro (sem frameworks)
- **Banco**: MySQL com PDO
- **Autenticação**: JWT customizado
- **Upload**: Sistema próprio de upload de imagens
- **API**: RESTful com roteamento manual

## 📁 Estrutura do Projeto

```
elias_santos/
├── backend-php/              # Backend PHP
│   ├── api/
│   │   └── index.php         # API principal
│   ├── config/               # Configurações
│   ├── middleware/           # Middleware de autenticação
│   ├── utils/                # Utilitários (upload)
│   ├── setup/                # Scripts de configuração
│   └── public/uploads/       # Imagens enviadas
├── src/                      # Frontend React
│   ├── components/           # Componentes reutilizáveis
│   ├── pages/                # Páginas da aplicação
│   ├── services/             # Serviços de API
│   ├── config/               # Configurações
│   └── utils/                # Utilitários
├── build/                    # Build de produção
├── public/                   # Arquivos públicos
└── node_modules/             # Dependências
```

## 🚀 Funcionalidades

### **Gerenciamento de Viagens**
- ✅ CRUD completo de viagens
- ✅ Upload de múltiplas imagens
- ✅ Sistema de imagem de capa
- ✅ Metadados (distância, duração, dificuldade, valor)
- ✅ Localização e data da viagem

### **Sistema de Usuários**
- ✅ Autenticação JWT com expiração
- ✅ Controle de permissões (gestor/usuário)
- ✅ Login/logout com persistência
- ✅ Proteção de rotas sensíveis

### **Interface do Usuário**
- ✅ Design responsivo e moderno
- ✅ Galeria de imagens interativa
- ✅ Navegação intuitiva com breadcrumbs
- ✅ Compartilhamento social
- ✅ SEO otimizado

### **Recursos Avançados**
- ✅ Lazy loading de imagens
- ✅ Acesso secreto (Ctrl+Alt+Shift+A)
- ✅ Botão WhatsApp flutuante
- ✅ Sistema de logs detalhado

## 🛠️ Instalação e Configuração

### **Pré-requisitos**
- Node.js 16+ 
- PHP 7.4+
- MySQL 5.7+
- Servidor web (Apache/Nginx)

### **Frontend**
```bash
# Instalar dependências
npm install

# Desenvolvimento
npm start

# Build para produção
npm run build
```

### **Backend**
1. **Configurar banco de dados** em `backend-php/config/database.php`
2. **Criar usuário admin**: Acesse `/backend-php/setup/create-admin.php`
3. **Configurar URLs** em `src/config/urls.js`

### **Credenciais Admin Padrão**
- **Email**: `admin@eliassantos.com`
- **Senha**: `admin@eliasSantos`

## 🌐 Deploy

### **Hospedagem Compartilhada**
1. Upload da pasta `backend-php/` para `public_html/backend-php/`
2. Upload do conteúdo da pasta `build/` para `public_html/`
3. Configurar banco de dados MySQL
4. Configurar URLs no frontend

### **URLs de Produção**
- **Site**: `https://khaki-alpaca-178991.hostingersite.com`
- **API**: `https://khaki-alpaca-178991.hostingersite.com/backend-php/api`

## 🔧 Configuração

### **Variáveis de Ambiente**
```bash
# .env.local
REACT_APP_API_URL=https://khaki-alpaca-178991.hostingersite.com/backend-php/api
REACT_APP_SITE_URL=https://khaki-alpaca-178991.hostingersite.com
```

### **Configuração do Banco**
```php
// backend-php/config/database.php
private $host = 'localhost';
private $dbname = 'seu_banco';
private $username = 'seu_usuario';
private $password = 'sua_senha';
```

## 📊 Endpoints da API

```
GET  /api/                    # Informações da API
GET  /api/health             # Status do servidor
POST /api/login              # Autenticação
GET  /api/verify             # Verificar token
GET  /api/viagens            # Listar viagens
GET  /api/viagens/:id        # Viagem específica
POST /api/viagens            # Criar viagem
PUT  /api/viagens/:id        # Atualizar viagem
DELETE /api/viagens/:id      # Excluir viagem
POST /api/upload             # Upload de imagem
```

## 🔐 Segurança

- ✅ Headers de segurança configurados
- ✅ Validação rigorosa de uploads
- ✅ Sanitização de dados
- ✅ JWT com expiração
- ✅ Prepared statements
- ✅ CORS configurado

## 📱 Responsividade

- ✅ Mobile-first design
- ✅ Touch gestures na galeria
- ✅ Menu responsivo
- ✅ Imagens otimizadas

## 🎯 SEO

- ✅ Meta tags dinâmicas
- ✅ Dados estruturados (JSON-LD)
- ✅ Sitemap automático
- ✅ URLs amigáveis
- ✅ Open Graph tags

## 🐛 Troubleshooting

### **Erro 500 no Backend**
- Verificar logs em `backend-php/logs/`
- Confirmar configurações do banco
- Verificar permissões dos diretórios

### **CORS Error**
- Editar `backend-php/config/cors.php`
- Adicionar domínio na lista permitida
- Verificar se está usando HTTPS

### **Upload não funciona**
- Verificar permissões: `chmod 755 uploads/`
- Confirmar limite PHP: `upload_max_filesize = 10M`
- Verificar se diretório existe

## 📞 Suporte

### **Logs Importantes**
- **Aplicação**: `backend-php/logs/app.log`
- **Erro PHP**: Via painel de hospedagem
- **Console**: F12 no navegador

### **Contatos**
- **Email**: contato@eliassantos.com
- **WhatsApp**: +55 11 99999-9999

---

## 📄 Licença

Este projeto é propriedade de Elias Santos. Todos os direitos reservados.

---

**🚴‍♂️ Desenvolvido com paixão por ciclismo e tecnologia!**