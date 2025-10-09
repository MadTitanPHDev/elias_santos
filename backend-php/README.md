# Backend PHP - Sistema de Viagens de Bicicleta

Backend PHP otimizado para hospedagem compartilhada, convertido do Node.js original.

## 🚀 Características

- ✅ **PHP Puro** - Sem dependências externas
- ✅ **JWT Authentication** - Sistema de autenticação seguro
- ✅ **Upload de Imagens** - Com otimização automática
- ✅ **MySQL PDO** - Conexão segura com prepared statements
- ✅ **CORS Configurado** - Para requisições do frontend
- ✅ **Logs Detalhados** - Para debugging e monitoramento
- ✅ **Segurança** - Headers de segurança e validações
- ✅ **Otimizado** - Para hospedagem compartilhada

## 📁 Estrutura de Arquivos

```
backend-php/
├── api/
│   └── index.php              # API principal
├── config/
│   ├── config.php             # Configurações gerais
│   ├── cors.php               # Configuração CORS
│   ├── database.php           # Conexão com banco
│   └── jwt.php                # Sistema JWT
├── middleware/
│   └── auth.php               # Middleware de autenticação
├── utils/
│   └── upload.php             # Sistema de upload
├── setup/
│   └── create-admin.php       # Script para criar admin
├── logs/                      # Diretório de logs
├── uploads/                   # Diretório de uploads
├── .htaccess                  # Configurações Apache
└── README.md                  # Este arquivo
```

## 🔧 Instalação

### 1. Upload dos Arquivos

Faça upload de todos os arquivos para sua hospedagem compartilhada:

```bash
# Via FTP/SFTP ou painel de controle
# Upload da pasta backend-php/ para o diretório raiz
```

### 2. Configurar Banco de Dados

Edite o arquivo `config/database.php` com suas credenciais:

```php
private $host = 'localhost';           // Seu host MySQL
private $dbname = 'elias_santosdb';    // Nome do banco
private $username = 'seu_usuario';     // Seu usuário
private $password = 'sua_senha';       // Sua senha
```

### 3. Criar Usuário Admin

Execute o script para criar o usuário administrador:

```bash
# Via navegador ou linha de comando
https://seudominio.com/backend-php/setup/create-admin.php
```

**Credenciais padrão:**
- Email: `admin@eliassantos.com`
- Senha: `admin@eliasSantos`

### 4. Configurar Permissões

Certifique-se de que os diretórios têm as permissões corretas:

```bash
chmod 755 backend-php/
chmod 755 backend-php/uploads/
chmod 755 backend-php/logs/
chmod 644 backend-php/.htaccess
```

## 🌐 Endpoints da API

### Autenticação
- `POST /api/login` - Login
- `GET /api/verify` - Verificar token

### Viagens
- `GET /api/viagens` - Listar todas as viagens
- `GET /api/viagens/:id` - Obter viagem específica
- `GET /api/viagens/aleatorias` - Viagens aleatórias
- `POST /api/viagens` - Criar viagem (requer autenticação)
- `PUT /api/viagens/:id` - Atualizar viagem (requer autenticação)
- `DELETE /api/viagens/:id` - Deletar viagem (requer autenticação)

### Upload
- `POST /api/upload` - Upload de imagem (requer autenticação)
- `PUT /api/viagens/:id/capa` - Definir imagem de capa (requer autenticação)

### Sistema
- `GET /api/health` - Status da API
- `GET /api/` - Informações da API

## 🔒 Segurança

### Headers de Segurança
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### Validações
- ✅ Prepared statements (SQL injection)
- ✅ Validação de tipos de arquivo
- ✅ Sanitização de nomes de arquivo
- ✅ Verificação de tamanho de upload
- ✅ Tokens JWT com expiração

## 📊 Logs

Os logs são salvos em `logs/app.log` com diferentes níveis:

```php
debug('Mensagem de debug');
info('Informação geral');
warning('Aviso importante');
error('Erro crítico');
```

## 🔧 Configurações

### Variáveis de Ambiente (Opcional)

Crie um arquivo `.env` na raiz:

```env
APP_ENV=production
DB_HOST=localhost
DB_NAME=elias_santosdb
DB_USER=seu_usuario
DB_PASS=sua_senha
JWT_SECRET=seu_segredo_super_seguro
```

### CORS

Configure as origens permitidas em `config/cors.php`:

```php
$allowedOrigins = [
    'https://seudominio.com',
    'https://www.seudominio.com'
];
```

## 🚀 Otimizações

### Performance
- ✅ Conexão PDO com pool
- ✅ Prepared statements
- ✅ Compressão GZIP
- ✅ Cache de headers
- ✅ Otimização de imagens

### Hospedagem Compartilhada
- ✅ Sem dependências externas
- ✅ Compatível com PHP 7.4+
- ✅ Configurações Apache otimizadas
- ✅ Logs em arquivo (não console)

## 🐛 Debugging

### Logs de Erro
```bash
tail -f logs/app.log
```

### Health Check
```bash
curl https://seudominio.com/api/health
```

### Teste de Upload
```bash
curl -X POST https://seudominio.com/api/upload \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "image=@imagem.jpg" \
  -F "viagemId=1"
```

## 📝 Migração do Node.js

### Principais Mudanças
1. **Autenticação**: JWT implementado em PHP puro
2. **Upload**: Sistema otimizado com validações
3. **Banco**: PDO ao invés de mysql2
4. **Rotas**: Roteamento manual ao invés de Express
5. **Middleware**: Implementação customizada

### Compatibilidade
- ✅ Mesma estrutura de API
- ✅ Mesmos endpoints
- ✅ Mesmo formato de resposta
- ✅ Compatível com frontend React existente

## 🔄 Atualizações

Para atualizar o backend:

1. Faça backup dos uploads e logs
2. Substitua os arquivos PHP
3. Execute `create-admin.php` se necessário
4. Verifique as configurações

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs em `logs/app.log`
2. Teste o health check: `/api/health`
3. Verifique as permissões dos diretórios
4. Confirme as configurações do banco

---

**Versão**: 1.0.0  
**Compatibilidade**: PHP 7.4+  
**Hospedagem**: Compartilhada (Hostinger, etc.)
