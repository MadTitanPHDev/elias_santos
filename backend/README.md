# Backend - API de Viagens de Bicicleta

## 🚀 Como Iniciar o Servidor

### Pré-requisitos
- Node.js instalado
- MySQL configurado (opcional - funciona sem banco também)

### Instalação
```bash
cd backend
npm install
```

### Iniciar o Servidor
```bash
npm start
# ou
node server.js
```

### Verificar se está Rodando
O servidor estará disponível em: `http://localhost:5000`

### Endpoints Disponíveis
- `GET /` - Página inicial da API
- `GET /api/health` - Status do servidor
- `GET /api/viagens` - Listar todas as viagens
- `GET /api/viagens/:id` - Obter uma viagem específica
- `POST /api/viagens` - Criar nova viagem
- `PUT /api/viagens/:id` - Atualizar viagem existente
- `DELETE /api/viagens/:id` - Excluir viagem
- `PUT /api/viagens/:id/capa` - Atualizar imagem de capa
- `POST /api/upload` - Upload de imagem
- `GET /api/viagens/aleatorias` - Viagens aleatórias para o banner

### Configuração do Banco de Dados
O servidor funciona com ou sem banco de dados. Se não conseguir conectar ao MySQL, ele funcionará em modo fallback.

### Logs
O servidor mostra logs detalhados no console para facilitar o debug.
