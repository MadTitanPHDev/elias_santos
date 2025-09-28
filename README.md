# Elias Santos 

Aplicação web para cadastro, visualização e gerenciamento de viagens de bicicleta, com autenticação de usuários e upload de imagens. Desenvolvida em React no frontend e Node.js/Express no backend, utilizando MySQL para persistência dos dados.

## Funcionalidades

- **Listagem de Viagens:** Página inicial exibe todas as viagens cadastradas, com resumo, imagem de capa, distância, duração e dificuldade.
- **Detalhes da Viagem:** Página detalhada com informações completas, galeria de imagens, resumo, descrição, dados adicionais e datas de criação/atualização.
- **Cadastro de Nova Viagem:** Usuários do tipo gestor podem cadastrar novas viagens, incluindo upload de múltiplas imagens (a primeira é usada como capa).
- **Autenticação:** Login de usuários, com persistência de token JWT e dados do usuário no localStorage. Proteção de rotas para ações restritas a gestores.
- **Upload de Imagens:** Suporte a upload de imagens para cada viagem, com armazenamento local e associação à viagem no banco de dados.
- **Galeria Interativa:** Visualização das imagens da viagem em galeria, com modal para navegação entre fotos.
- **Logout e Controle de Sessão:** Logout automático em caso de token inválido/expirado, e botão de sair no menu.

## Estrutura de Pastas
backend/ # Backend Node.js/Express config/ database.js # Configuração do MySQL create-admin.js # Script para criar usuário admin server.js # API principal

public/ # Arquivos estáticos do frontend src/ # Frontend React components/ # Componentes reutilizáveis (Header, ViagemCard, ViagemGaleria, ProtectedRoute) pages/ # Páginas principais (Home, Login, NovaViagem, ViagemDetalhes) services/ # Serviços de API e autenticação App.js # Componente principal

## Backend

- **Express** para rotas REST.
- **MySQL** para persistência.
- **JWT** para autenticação.
- **Multer** para upload de imagens.
- **bcryptjs** para hash de senhas.
- Rotas protegidas para cadastro de viagens e upload de imagens.
- Script para criação de usuário admin ([backend/create-admin.js](backend/create-admin.js)).

## Frontend

- **React** com React Router para navegação.
- **Axios** para requisições à API.
- **Autenticação** via token JWT, com interceptors automáticos.
- **Proteção de rotas** para páginas restritas.
- **Componentização** para reuso e organização do código.
- **Estilização** com CSS customizado para cada página/componente.

## Como rodar

### Backend

1. Instale dependências:
   ```sh
   cd backend
   npm install

2. Configure o banco MySQL e crie o banco elias_santosdb.

3. Execute o script de admin:
    node create-admin.js

4. Inicie o servido:
    node server.js    

### Frontend

1. Instale dependencias:
    npm install

2. Inicie o app:
    npm start

3. Acesse http://localhost:3000.

Usuário de Teste
Email: admin@eliassantos.com
Senha: admin@eliasSantos
Tipo: gestor
Principais Arquivos
src/App.js: Componente principal, define rotas e integra autenticação.
src/pages/Home.js: Listagem de viagens.
src/pages/ViagemDetalhes.js: Detalhes completos de uma viagem.
src/pages/NovaViagem.js: Cadastro de nova viagem (restrito a gestores).
src/pages/Login.js: Tela de login.
src/services/api.js: Serviço de integração com API de viagens.
src/services/auth.js: Serviço de autenticação e controle de sessão.
src/components/Header.js: Cabeçalho com navegação e controle de login/logout.
src/components/ProtectedRoute.js: Proteção de rotas para autenticação e permissão de gestor.
Observações
O backend serve imagens via /uploads.
O frontend espera a API rodando em http://localhost:5000.
O sistema foi projetado para fácil expansão, permitindo novos tipos de usuários e funcionalidades.
Para dúvidas ou sugestões, consulte os arquivos fonte ou abra uma issue!



Arquivos citados:  
- [App.js](http://_vscodecontentref_/4)  
- [Home.js](http://_vscodecontentref_/5)  
- [ViagemDetalhes.js](http://_vscodecontentref_/6)  
- [NovaViagem.js](http://_vscodecontentref_/7)  
- [Login.js](http://_vscodecontentref_/8)  
- [api.js](http://_vscodecontentref_/9)  
- [auth.js](http://_vscodecontentref_/10)  
- [Header.js](http://_vscodecontentref_/11)  
- [ProtectedRoute.js](http://_vscodecontentref_/12)  
- [server.js](http://_vscodecontentref_/13)  
- [create-admin.js](http://_vscodecontentref_/14)  
- [database.js](http://_vscodecontentref_/15)