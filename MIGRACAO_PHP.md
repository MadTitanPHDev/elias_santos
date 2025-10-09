# 🚀 Guia de Migração para Backend PHP

## ✅ Conversão Concluída!

Seu backend Node.js foi **completamente convertido** para PHP e está otimizado para hospedagem compartilhada.

## 📁 Arquivos Criados

### Backend PHP
```
backend-php/
├── api/index.php              # ✅ API principal
├── config/
│   ├── config.php             # ✅ Configurações gerais
│   ├── cors.php               # ✅ CORS
│   ├── database.php           # ✅ Conexão MySQL
│   └── jwt.php                # ✅ Sistema JWT
├── middleware/
│   └── auth.php               # ✅ Autenticação
├── utils/
│   └── upload.php             # ✅ Upload de imagens
├── setup/
│   └── create-admin.php       # ✅ Script admin
├── .htaccess                  # ✅ Configurações Apache
└── README.md                  # ✅ Documentação
```

### Frontend Atualizado
```
src/
├── config/backend.js          # ✅ Configuração do backend
└── services/api.js            # ✅ Atualizado para PHP
```

## 🎯 Próximos Passos

### 1. **Upload para Hospedagem**
```bash
# Faça upload da pasta backend-php/ para sua hospedagem
# Exemplo: public_html/backend-php/
```

### 2. **Configurar Banco de Dados**
Edite `backend-php/config/database.php`:
```php
private $host = 'localhost';           // Seu host MySQL
private $dbname = 'elias_santosdb';    // Nome do banco
private $username = 'seu_usuario';     // Seu usuário
private $password = 'sua_senha';       // Sua senha
```

### 3. **Criar Usuário Admin**
Acesse via navegador:
```
https://seudominio.com/backend-php/setup/create-admin.php
```

**Credenciais padrão:**
- Email: `admin@eliassantos.com`
- Senha: `admin@eliasSantos`

### 4. **Configurar Frontend**
Edite `src/config/backend.js`:
```javascript
baseURL: 'https://seudominio.com/backend-php/api'
```

### 5. **Testar API**
```bash
# Health check
curl https://seudominio.com/backend-php/api/health

# Listar viagens
curl https://seudominio.com/backend-php/api/viagens
```

## 🔧 Configurações Importantes

### Permissões de Diretório
```bash
chmod 755 backend-php/
chmod 755 backend-php/uploads/
chmod 755 backend-php/logs/
```

### CORS (se necessário)
Edite `backend-php/config/cors.php`:
```php
$allowedOrigins = [
    'https://seudominio.com',
    'https://www.seudominio.com'
];
```

## 🚀 Vantagens da Conversão

### ✅ **Compatibilidade**
- Funciona em hospedagem compartilhada
- Sem necessidade de Node.js
- PHP 7.4+ (padrão em hospedagens)

### ✅ **Performance**
- Conexão PDO otimizada
- Prepared statements
- Compressão GZIP
- Cache de headers

### ✅ **Segurança**
- Headers de segurança
- Validação rigorosa de uploads
- Sanitização de dados
- JWT com expiração

### ✅ **Manutenção**
- Código PHP puro (sem dependências)
- Logs detalhados
- Documentação completa
- Fácil debugging

## 📊 Comparação: Node.js vs PHP

| Aspecto | Node.js | PHP |
|---------|---------|-----|
| **Hospedagem** | VPS/Cloud | Compartilhada ✅ |
| **Dependências** | npm install | Nenhuma ✅ |
| **Performance** | Boa | Otimizada ✅ |
| **Segurança** | Boa | Reforçada ✅ |
| **Manutenção** | Média | Simples ✅ |
| **Custo** | Alto | Baixo ✅ |

## 🔍 Endpoints Mantidos

Todos os endpoints foram mantidos com a mesma funcionalidade:

```javascript
// Autenticação
POST /api/login
GET /api/verify

// Viagens
GET /api/viagens
GET /api/viagens/:id
GET /api/viagens/aleatorias
POST /api/viagens
PUT /api/viagens/:id
DELETE /api/viagens/:id

// Upload
POST /api/upload
PUT /api/viagens/:id/capa

// Sistema
GET /api/health
GET /api/
```

## 🐛 Troubleshooting

### Problema: Erro 500
**Solução:**
1. Verifique logs em `backend-php/logs/app.log`
2. Confirme configurações do banco
3. Verifique permissões dos diretórios

### Problema: CORS Error
**Solução:**
1. Edite `backend-php/config/cors.php`
2. Adicione seu domínio na lista
3. Verifique se está usando HTTPS

### Problema: Upload não funciona
**Solução:**
1. Verifique permissões do diretório `uploads/`
2. Confirme limite de upload no PHP
3. Verifique se o diretório existe

### Problema: Token inválido
**Solução:**
1. Verifique se o JWT_SECRET está configurado
2. Confirme se o token não expirou
3. Verifique se está enviando o header Authorization

## 📞 Suporte

### Logs Importantes
```bash
# Logs da aplicação
tail -f backend-php/logs/app.log

# Logs de erro do PHP
tail -f /var/log/apache2/error.log
```

### Testes de Conectividade
```bash
# Teste básico
curl -I https://seudominio.com/backend-php/api/health

# Teste com dados
curl -X POST https://seudominio.com/backend-php/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eliassantos.com","senha":"admin@eliasSantos"}'
```

## 🎉 Resultado Final

✅ **Backend PHP funcional**  
✅ **Compatível com hospedagem compartilhada**  
✅ **Mesma funcionalidade do Node.js**  
✅ **Otimizado para performance**  
✅ **Seguro e confiável**  
✅ **Fácil de manter**  

---

**Sua aplicação está pronta para produção na Hostinger!** 🚀
