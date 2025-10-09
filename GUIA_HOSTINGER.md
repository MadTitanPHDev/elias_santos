# 🚀 Guia Completo: Deploy na Hostinger

## 📋 Pré-requisitos

- ✅ Conta na Hostinger ativa
- ✅ Acesso ao painel de controle
- ✅ Banco de dados MySQL criado
- ✅ Arquivos do projeto prontos

---

## 🎯 Passo 1: Preparar os Arquivos

### 1.1 Estrutura Final dos Arquivos

Certifique-se de ter esta estrutura:

```
📁 elias_santos/
├── 📁 backend-php/          # Backend PHP (NOVO)
│   ├── 📁 api/
│   ├── 📁 config/
│   ├── 📁 middleware/
│   ├── 📁 utils/
│   ├── 📁 setup/
│   ├── 📁 logs/
│   ├── 📁 uploads/
│   ├── .htaccess
│   └── README.md
├── 📁 build/                # Frontend React (build)
├── 📁 src/                  # Código fonte React
└── 📁 public/               # Arquivos públicos
```

### 1.2 Fazer Build do Frontend

```bash
# No terminal, na pasta do projeto
npm run build
```

Isso criará/atualizará a pasta `build/` com os arquivos otimizados.

---

## 🗄️ Passo 2: Configurar Banco de Dados

### 2.1 Acessar o Painel da Hostinger

1. Acesse [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Faça login com suas credenciais
3. Vá em **"Bancos de Dados MySQL"**

### 2.2 Criar Banco de Dados

1. Clique em **"Criar Novo Banco de Dados"**
2. Nome do banco: `elias_santosdb` (ou o que preferir)
3. Usuário: `elias_santos_user` (ou o que preferir)
4. Senha: **Crie uma senha forte**
5. Clique em **"Criar"**

### 2.3 Anotar as Credenciais

**IMPORTANTE:** Anote estas informações:
```
Host: localhost
Banco: elias_santosdb
Usuário: elias_santos_user
Senha: [sua_senha]
```

---

## 📤 Passo 3: Upload dos Arquivos

### 3.1 Acessar o Gerenciador de Arquivos

1. No painel da Hostinger, vá em **"Gerenciador de Arquivos"**
2. Navegue até a pasta `public_html/`

### 3.2 Upload do Backend PHP

1. **Criar pasta para o backend:**
   - Clique em **"Nova Pasta"**
   - Nome: `backend-php`
   - Clique em **"Criar"**

2. **Upload dos arquivos do backend:**
   - Entre na pasta `backend-php/`
   - Faça upload de **TODOS** os arquivos da pasta `backend-php/` do seu projeto
   - **Estrutura final:**
     ```
     public_html/backend-php/
     ├── api/
     ├── config/
     ├── middleware/
     ├── utils/
     ├── setup/
     ├── logs/
     ├── uploads/
     ├── .htaccess
     └── README.md
     ```

### 3.3 Upload do Frontend

1. **Volte para `public_html/`**
2. **Faça upload de TODOS os arquivos da pasta `build/`**
3. **Estrutura final:**
   ```
   public_html/
   ├── index.html              # Página principal
   ├── favicon.ico
   ├── manifest.json
   ├── robots.txt
   ├── sitemap.xml
   ├── static/                 # CSS, JS, imagens
   └── backend-php/            # Backend
   ```

### 3.4 Configurar Permissões

1. **Selecione a pasta `backend-php/`**
2. Clique em **"Permissões"**
3. Configure:
   - **Pastas:** 755
   - **Arquivos:** 644
4. **Especialmente importante:**
   - `backend-php/uploads/` → 755
   - `backend-php/logs/` → 755

---

## ⚙️ Passo 4: Configurar o Backend

### 4.1 Editar Configuração do Banco

1. No Gerenciador de Arquivos, navegue até:
   `public_html/backend-php/config/database.php`

2. **Edite o arquivo** e substitua:
   ```php
   private $host = 'localhost';
   private $dbname = 'elias_santosdb';        // Nome do seu banco
   private $username = 'elias_santos_user';   // Seu usuário
   private $password = 'sua_senha_aqui';      // Sua senha
   ```

### 4.2 Criar Usuário Administrador

1. **Acesse via navegador:**
   ```
   https://seudominio.com/backend-php/setup/create-admin.php
   ```

2. **Você deve ver:**
   ```
   ✅ Usuário admin criado com sucesso!
   📧 Email: admin@eliassantos.com
   🔑 Senha: admin@eliasSantos
   👤 Tipo: gestor
   ```

3. **Se der erro:** Verifique as credenciais do banco no passo 4.1

---

## 🌐 Passo 5: Configurar o Frontend

### 5.1 Editar Configuração da API

1. No Gerenciador de Arquivos, navegue até:
   `public_html/static/js/main.[hash].js`

2. **OU melhor:** Edite o arquivo fonte e faça novo build:
   - No seu projeto local, edite: `src/config/backend.js`
   - Substitua:
     ```javascript
     baseURL: 'https://seudominio.com/backend-php/api'
     ```
   - Execute `npm run build` novamente
   - Faça upload dos novos arquivos

### 5.2 Configurar CORS (se necessário)

1. Edite: `public_html/backend-php/config/cors.php`
2. Adicione seu domínio:
   ```php
   $allowedOrigins = [
       'https://seudominio.com',
       'https://www.seudominio.com'
   ];
   ```

---

## 🧪 Passo 6: Testar a Aplicação

### 6.1 Teste do Backend

1. **Health Check:**
   ```
   https://seudominio.com/backend-php/api/health
   ```
   **Resultado esperado:**
   ```json
   {
     "status": "OK",
     "message": "API e banco de dados estão funcionando",
     "timestamp": "2024-01-XX..."
   }
   ```

2. **Teste de Login:**
   ```
   https://seudominio.com/backend-php/api/login
   ```
   **Com dados:**
   ```json
   {
     "email": "admin@eliassantos.com",
     "senha": "admin@eliasSantos"
   }
   ```

### 6.2 Teste do Frontend

1. **Acesse seu site:**
   ```
   https://seudominio.com
   ```

2. **Verifique se:**
   - ✅ Página carrega normalmente
   - ✅ Imagens aparecem
   - ✅ Navegação funciona
   - ✅ Login funciona (se aplicável)

---

## 🔧 Passo 7: Configurações Avançadas

### 7.1 Configurar SSL (HTTPS)

1. No painel da Hostinger:
   - Vá em **"SSL"**
   - Ative o **"Certificado SSL Gratuito"**
   - Aguarde a ativação (pode levar algumas horas)

### 7.2 Configurar Domínio

1. **Se usar subdomínio:**
   - Vá em **"Domínios"**
   - Adicione o subdomínio
   - Configure o DNS

2. **Se usar domínio principal:**
   - Configure o DNS no seu provedor
   - Aponte para os servidores da Hostinger

### 7.3 Otimizações de Performance

1. **Ativar Cache:**
   - No painel: **"Cache"** → **"Ativar"**

2. **Compressão GZIP:**
   - Já configurada no `.htaccess`

3. **CDN (opcional):**
   - Ative o Cloudflare se disponível

---

## 🐛 Solução de Problemas

### Problema: Erro 500 no Backend

**Diagnóstico:**
1. Verifique logs: `public_html/backend-php/logs/app.log`
2. Verifique permissões das pastas
3. Confirme credenciais do banco

**Solução:**
```bash
# Verificar permissões
chmod 755 backend-php/
chmod 755 backend-php/uploads/
chmod 755 backend-php/logs/
```

### Problema: CORS Error

**Solução:**
1. Edite `backend-php/config/cors.php`
2. Adicione seu domínio na lista
3. Verifique se está usando HTTPS

### Problema: Upload não funciona

**Solução:**
1. Verifique permissões: `chmod 755 uploads/`
2. Confirme limite PHP: `upload_max_filesize = 10M`
3. Verifique se a pasta existe

### Problema: Frontend não carrega

**Solução:**
1. Verifique se fez upload da pasta `build/`
2. Confirme se `index.html` está na raiz
3. Verifique console do navegador para erros

### Problema: Banco de dados não conecta

**Solução:**
1. Verifique credenciais em `database.php`
2. Confirme se o banco foi criado
3. Teste conexão via phpMyAdmin

---

## 📊 Checklist Final

### ✅ Backend
- [ ] Arquivos PHP uploadados
- [ ] Permissões configuradas (755/644)
- [ ] Banco de dados configurado
- [ ] Usuário admin criado
- [ ] Health check funcionando
- [ ] Logs sendo gerados

### ✅ Frontend
- [ ] Build feito e uploadado
- [ ] URL da API configurada
- [ ] Site carregando normalmente
- [ ] Imagens aparecendo
- [ ] Navegação funcionando

### ✅ Configurações
- [ ] SSL ativado
- [ ] CORS configurado
- [ ] Cache ativado
- [ ] Domínio configurado

---

## 🎉 Deploy Concluído!

### URLs Importantes:
- **Site:** `https://seudominio.com`
- **API:** `https://seudominio.com/backend-php/api`
- **Admin:** `https://seudominio.com/backend-php/setup/create-admin.php`
- **Health:** `https://seudominio.com/backend-php/api/health`

### Credenciais Admin:
- **Email:** `admin@eliassantos.com`
- **Senha:** `admin@eliasSantos`

### Próximos Passos:
1. **Altere a senha do admin** após primeiro login
2. **Configure backup automático** no painel
3. **Monitore os logs** regularmente
4. **Teste todas as funcionalidades**

---

## 📞 Suporte

### Logs Importantes:
- **Aplicação:** `backend-php/logs/app.log`
- **Erro PHP:** Via painel da Hostinger
- **Acesso:** Via painel da Hostinger

### Contatos:
- **Hostinger:** Suporte via chat no painel
- **Documentação:** `backend-php/README.md`

---

**🚀 Sua aplicação está no ar e funcionando perfeitamente na Hostinger!**
