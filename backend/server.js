// backend/server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const JWT_SECRET = 'seu_segredo_jwt_aqui'; // Use variável de ambiente em produção
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt_aqui_use_variavel_ambiente_em_producao';
const fs = require('fs'); // Adicione esta linha no topo

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('🔐 Token recebido:', token ? 'Sim' : 'Não');
  console.log('🔐 Header Authorization:', authHeader);
  console.log('🔐 Rota:', req.path);
  console.log('🔐 Método:', req.method);

  if (!token) {
    console.log('❌ Token não encontrado');
    return res.status(401).json({ error: 'Token de acesso necessário' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ Token inválido:', err.message);
      return res.status(403).json({ error: 'Token inválido' });
    }
    console.log('✅ Token válido para usuário:', user.email);
    req.user = user;
    next();
  });
};

// Middleware para verificar se é gestor
const requireGestor = (req, res, next) => {
  if (req.user.tipo !== 'gestor') {
     console.log('❌ Acesso negado - não é gestor');
    return res.status(403).json({ error: 'Acesso restrito a gestores' });
  }
   console.log('✅ Acesso permitido - usuário é gestor');
  next();
};




// Configuração do Multer para upload de imagens (IMPLEMENTAÇÃO ROBUSTA)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Criar diretório se não existir
    const fs = require('fs');
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 1. Gerar nome único
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    
    // 2. Sanitizar nome original
    const originalName = file.originalname
      .toLowerCase()                    // Minúsculas
      .replace(/[^a-z0-9.-]/g, '-')     // Remove caracteres especiais
      .replace(/-+/g, '-')              // Remove hífens duplicados
      .replace(/^-|-$/g, '');           // Remove hífens do início/fim
    
    // 3. Extrair extensão de forma segura
    const ext = path.extname(file.originalname).toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    // 4. Usar extensão padrão se inválida
    const safeExt = validExtensions.includes(ext) ? ext : '.jpg';
    
    // 5. Gerar nome final (sem nome original para máxima segurança)
    const filename = `${timestamp}-${randomString}${safeExt}`;
    
    console.log('📁 Nome original:', file.originalname);
    console.log('📁 Nome sanitizado:', originalName);
    console.log('📁 Extensão detectada:', ext);
    console.log('📁 Extensão segura:', safeExt);
    console.log('📁 Nome final:', filename);
    
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'), false);
    }
  }
});

// Testar conexão com o banco de dados
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao MySQL com sucesso!');
    connection.release();
    
    // Criar tabelas se não existirem
    await createTables();
  } catch (error) {
    console.error('❌ Erro ao conectar ao MySQL:', error.message);
    console.log('💡 Usando modo de fallback sem banco de dados...');
  }
};

// Criar tabelas
const createTables = async () => {
  try {
    // Tabela de viagens
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS viagens (
        id INT PRIMARY KEY AUTO_INCREMENT,
        titulo VARCHAR(200) NOT NULL,
        descricao TEXT NOT NULL,
        resumo VARCHAR(500),
        distancia_km DECIMAL(8,2),
        duracao_dias INT,
        data_viagem DATE,
        localizacao VARCHAR(150),
        dificuldade ENUM('fácil', 'moderada', 'difícil', 'extrema'),
        valor DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Adicionar coluna valor se não existir (para tabelas já criadas)
    try {
      await pool.execute(`ALTER TABLE viagens ADD COLUMN valor DECIMAL(10,2) AFTER dificuldade`);
      console.log('✅ Coluna valor adicionada à tabela viagens');
    } catch (error) {
      // Ignora erro se a coluna já existir
      if (!error.message.includes('Duplicate column name')) {
        console.log('ℹ️ Coluna valor já existe ou erro ao adicionar:', error.message);
      }
    }

    // Tabela de imagens das viagens
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS viagem_imagens (
        id INT PRIMARY KEY AUTO_INCREMENT,
        viagem_id INT NOT NULL,
        caminho_imagem VARCHAR(255) NOT NULL,
        descricao_imagem VARCHAR(300),
        ordem INT DEFAULT 0,
        is_capa BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (viagem_id) REFERENCES viagens(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Tabelas criadas/verificadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error.message);
  }
};

// Rotas da API

// Rota de login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  // DEBUG: Log da tentativa de login
  console.log('📧 Tentativa de login para:', email);
  
  // Validação básica
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    // DEBUG: Log da query
    console.log('🔍 Executando query para email:', email);
    
    const [users] = await pool.execute('SELECT * FROM usuarios WHERE email = ? AND ativo = TRUE', [email]);
    
    // DEBUG: Log dos resultados
    console.log('👥 Usuários encontrados:', users.length);
    
    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado para:', email);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = users[0];
    console.log('✅ Usuário encontrado:', user.id, user.email);
    
    // DEBUG: Log para verificar a senha hash
    console.log('🔐 Comparando senha...');
    console.log('Senha recebida:', senha);
    console.log('Hash no banco:', user.senha_hash);
    
    const validPassword = await bcrypt.compare(senha, user.senha_hash);
    console.log('✅ Senha válida:', validPassword);

    if (!validPassword) {
      console.log('❌ Senha inválida para usuário:', email);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Criar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        tipo: user.tipo, 
        nome: user.nome 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login bem-sucedido para:', email);
    console.log('🔑 Token gerado:', token.substring(0, 20) + '...');

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo
      }
    });

  } catch (error) {
    console.error('💥 Erro completo no login:', error);
    
    // Log mais detalhado do erro
    if (error.code) {
      console.error('Código do erro:', error.code);
    }
    if (error.sqlMessage) {
      console.error('Mensagem SQL:', error.sqlMessage);
    }
    
    res.status(500).json({ 
      error: 'Erro interno no servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API de Viagens de Bicicleta!',
    endpoints: {
      'GET /api/health': 'Status do servidor',
      'GET /api/viagens': 'Listar todas as viagens',
      'GET /api/viagens/:id': 'Obter uma viagem específica',
      'POST /api/viagens': 'Criar nova viagem',
      'PUT /api/viagens/:id': 'Atualizar viagem existente',
      'DELETE /api/viagens/:id': 'Excluir viagem',
      'PUT /api/viagens/:id/capa': 'Atualizar imagem de capa',
      'POST /api/upload': 'Upload de imagem'
    },
    version: '1.0.0'
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.json({ 
      status: 'OK', 
      message: 'API e banco de dados estão funcionando',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Erro na conexão com o banco de dados',
      error: error.message 
    });
  }
});

// Obter todas as viagens
app.get('/api/viagens', async (req, res) => {
  try {
    const [viagens] = await pool.execute(`
      SELECT v.*, 
             (SELECT caminho_imagem FROM viagem_imagens WHERE viagem_id = v.id AND is_capa = TRUE LIMIT 1) as imagem_capa
      FROM viagens v
      ORDER BY v.created_at DESC
    `);
    
    res.json(viagens);
  } catch (error) {
    console.error('Erro ao buscar viagens:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para viagens aleatórias (DEVE vir antes da rota /:id)
app.get('/api/viagens/aleatorias', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3; // Número de viagens aleatórias
    console.log('🔍 Buscando viagens aleatórias, limit:', limit);
    
    const query = `
      SELECT v.*, 
             (SELECT caminho_imagem FROM viagem_imagens WHERE viagem_id = v.id AND is_capa = TRUE LIMIT 1) as imagem_capa
      FROM viagens v
      ORDER BY RAND()
      LIMIT ?
    `;
    
    const [results] = await pool.execute(query, [limit]);
    console.log('✅ Viagens aleatórias encontradas:', results.length);
    console.log('📋 Dados:', results);
    res.json(results);
  } catch (err) {
    console.error('❌ Erro ao buscar viagens aleatórias:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter uma viagem específica
app.get('/api/viagens/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar viagem
    const [viagens] = await pool.execute('SELECT * FROM viagens WHERE id = ?', [id]);
    
    if (viagens.length === 0) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }
    
    // Buscar imagens da viagem
    const [imagens] = await pool.execute(
      'SELECT * FROM viagem_imagens WHERE viagem_id = ? ORDER BY ordem', 
      [id]
    );
    
    res.json({
      ...viagens[0],
      imagens: imagens
    });
  } catch (error) {
    console.error('Erro ao buscar viagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar uma viagem existente
app.put('/api/viagens/:id', authenticateToken, requireGestor, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, resumo, distancia_km, duracao_dias, data_viagem, localizacao, dificuldade, valor } = req.body;
    
    console.log('📝 Atualizando viagem ID:', id);
    console.log('📋 Dados recebidos:', req.body);
    
    // Verificar se a viagem existe
    const [existingViagem] = await pool.execute('SELECT id FROM viagens WHERE id = ?', [id]);
    if (existingViagem.length === 0) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }
    
    const query = `
      UPDATE viagens 
      SET titulo = ?, descricao = ?, resumo = ?, distancia_km = ?, duracao_dias = ?, 
          data_viagem = ?, localizacao = ?, dificuldade = ?, valor = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    await pool.execute(query, [titulo, descricao, resumo, distancia_km, duracao_dias, data_viagem, localizacao, dificuldade, valor, id]);
    
    console.log('✅ Viagem atualizada com sucesso');
    res.json({ message: 'Viagem atualizada com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao atualizar viagem:', error);
    res.status(500).json({ error: error.message });
  }
});

// Excluir uma viagem
app.delete('/api/viagens/:id', authenticateToken, requireGestor, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Excluindo viagem ID:', id);
    
    // Verificar se a viagem existe
    const [existingViagem] = await pool.execute('SELECT id FROM viagens WHERE id = ?', [id]);
    if (existingViagem.length === 0) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }
    
    // Excluir imagens da viagem primeiro
    const [imagens] = await pool.execute('SELECT caminho_imagem FROM viagem_imagens WHERE viagem_id = ?', [id]);
    
    // Deletar arquivos físicos
    for (const imagem of imagens) {
      const fs = require('fs');
      const imagePath = imagem.caminho_imagem.replace('/uploads/', 'uploads/');
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('🗑️ Arquivo deletado:', imagePath);
      }
    }
    
    // Excluir registros das imagens no banco
    await pool.execute('DELETE FROM viagem_imagens WHERE viagem_id = ?', [id]);
    
    // Excluir a viagem
    await pool.execute('DELETE FROM viagens WHERE id = ?', [id]);
    
    console.log('✅ Viagem e imagens excluídas com sucesso');
    res.json({ message: 'Viagem excluída com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao excluir viagem:', error);
    res.status(500).json({ error: error.message });
  }
});

// Criar uma nova viagem
// Rotas protegidas - apenas gestores podem criar viagens
app.post('/api/viagens', authenticateToken, requireGestor, async (req, res) => {
  try {
    console.log('📝 Criando nova viagem para usuário:', req.user.id);
    console.log('📋 Body completo recebido:', JSON.stringify(req.body, null, 2));
    
    const { titulo, descricao, resumo, distancia_km, duracao_dias, data_viagem, localizacao, dificuldade, valor } = req.body;
    
    console.log('📋 Dados extraídos:', { 
      titulo, 
      descricao, 
      resumo, 
      distancia_km, 
      duracao_dias, 
      data_viagem, 
      localizacao, 
      dificuldade, 
      valor,
      valorType: typeof valor,
      valorLength: valor ? valor.length : 'undefined'
    });
    
    const query = `
      INSERT INTO viagens (titulo, descricao, resumo, distancia_km, duracao_dias, data_viagem, localizacao, dificuldade, valor)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [titulo, descricao, resumo, distancia_km, duracao_dias, data_viagem, localizacao, dificuldade, valor]);
    
    console.log('✅ Viagem criada com ID:', result.insertId);
    res.json({ id: result.insertId, message: 'Viagem criada com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao criar viagem:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verificar token (para o frontend validar se está logado)
app.get('/api/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user, valid: true });
});

// Atualizar imagem de capa
app.put('/api/viagens/:id/capa', authenticateToken, requireGestor, async (req, res) => {
  try {
    const { id } = req.params;
    const { imagemId } = req.body;
    
    console.log('🖼️ Atualizando imagem de capa para viagem:', id, 'imagem:', imagemId);
    
    // Verificar se a viagem existe
    const [existingViagem] = await pool.execute('SELECT id FROM viagens WHERE id = ?', [id]);
    if (existingViagem.length === 0) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }
    
    // Verificar se a imagem existe e pertence à viagem
    const [existingImagem] = await pool.execute(
      'SELECT id FROM viagem_imagens WHERE id = ? AND viagem_id = ?', 
      [imagemId, id]
    );
    if (existingImagem.length === 0) {
      return res.status(404).json({ error: 'Imagem não encontrada ou não pertence à viagem' });
    }
    
    // Remover capa de todas as imagens da viagem
    await pool.execute(
      'UPDATE viagem_imagens SET is_capa = FALSE WHERE viagem_id = ?', 
      [id]
    );
    
    // Definir a nova capa
    await pool.execute(
      'UPDATE viagem_imagens SET is_capa = TRUE WHERE id = ?', 
      [imagemId]
    );
    
    console.log('✅ Imagem de capa atualizada com sucesso');
    res.json({ message: 'Imagem de capa atualizada com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao atualizar imagem de capa:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload de imagem
app.post('/api/upload', authenticateToken, requireGestor, upload.single('image'), async (req, res) => {
  try {
    console.log('📤 Recebendo upload de imagem...');
    console.log('📋 Headers:', req.headers);
    console.log('📋 Body:', req.body);
    console.log('📋 Files:', req.file);
    
    if (!req.file) {
      console.log('❌ Nenhum arquivo recebido');
      return res.status(400).json({ 
        success: false,
        error: 'Nenhuma imagem enviada' 
      });
    }
    
    const { viagemId, descricao, isCapa } = req.body;
    
    console.log('📋 Dados recebidos:', { viagemId, descricao, isCapa });
    console.log('📁 Arquivo:', req.file);

    if (!viagemId) {
      // Deletar arquivo se não tem viagemId
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false,
        error: 'ID da viagem é obrigatório' 
      });
    }

    // Usar caminho relativo para facilitar o acesso
    const imagePath = `/uploads/${req.file.filename}`;
    
    const [result] = await pool.execute(
      `INSERT INTO viagem_imagens (viagem_id, caminho_imagem, descricao_imagem, is_capa)
       VALUES (?, ?, ?, ?)`,
      [viagemId, imagePath, descricao || 'Imagem da viagem', isCapa === 'true' || false]
    );
    
    console.log('✅ Imagem salva no banco com ID:', result.insertId);
    
    res.json({ 
      success: true,
      message: 'Imagem enviada com sucesso', 
      image: {
        id: result.insertId,
        caminho_imagem: imagePath,
        descricao_imagem: descricao || 'Imagem da viagem',
        is_capa: isCapa === 'true' || false
      }
    });
  } catch (error) {
    console.error('❌ Erro ao fazer upload:', error);
    
    // Deletar arquivo em caso de erro
    if (req.file) {
      const fs = require('fs');
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor: ' + error.message 
    });
  }
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message 
  });
});

// Rota não encontrada - DEVE ser o último middleware
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method,
    message: `A rota ${req.method} ${req.originalUrl} não existe`,
    availableEndpoints: {
      'GET /': 'Página inicial da API',
      'GET /api/health': 'Status do servidor e banco',
      'GET /api/viagens': 'Lista todas as viagens',
      'GET /api/viagens/:id': 'Detalhes de uma viagem',
      'POST /api/viagens': 'Cria uma nova viagem',
      'PUT /api/viagens/:id': 'Atualiza uma viagem existente',
      'DELETE /api/viagens/:id': 'Exclui uma viagem',
      'PUT /api/viagens/:id/capa': 'Atualiza imagem de capa',
      'POST /api/upload': 'Faz upload de imagem'
    }
  });
});


// INICIAR O SERVIDOR
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 SERVIDOR INICIADO COM SUCESSO!');
  console.log('='.repeat(60));
  console.log(`📍 Porta: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Listar viagens: http://localhost:${PORT}/api/viagens`);
  console.log('='.repeat(60));
  
  // Testar conexão com o banco
  testConnection();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Desligando servidor...');
  process.exit(0);
});



