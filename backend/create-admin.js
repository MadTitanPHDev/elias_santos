const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise'); // Usando promises

async function createAdmin() {
  // Configuração do banco
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elias_santosdb'
  });

  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash('admin@eliasSantos', 10);
    
    // Query para inserir/atualizar
    const [result] = await db.execute(
      `INSERT INTO usuarios (nome, email, senha_hash, tipo) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         senha_hash = VALUES(senha_hash), 
         tipo = VALUES(tipo)`,
      ['Administrador', 'admin@eliassantos.com', hashedPassword, 'gestor']
    );

    console.log('✅ Usuário admin configurado com sucesso!');
    console.log('📧 Email: admin@eliassantos.com');
    console.log('🔑 Senha: admin@eliasSantos');
    console.log('👤 Tipo: gestor');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await db.end();
  }
}

createAdmin();