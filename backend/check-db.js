// Script para verificar a estrutura da tabela viagens
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'elias_santosdb'
});

async function checkTable() {
  try {
    console.log('🔍 Verificando estrutura da tabela viagens...\n');
    
    const [columns] = await pool.execute('DESCRIBE viagens');
    console.log('📋 Colunas da tabela viagens:');
    columns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(NULL)' : '(NOT NULL)'} ${col.Default ? `DEFAULT: ${col.Default}` : ''}`);
    });
    
    // Verificar se a coluna valor existe
    const valorColumn = columns.find(col => col.Field === 'valor');
    if (valorColumn) {
      console.log('\n✅ Coluna valor encontrada:', valorColumn);
    } else {
      console.log('\n❌ Coluna valor NÃO encontrada!');
      console.log('🔧 Tentando adicionar a coluna valor...');
      
      try {
        await pool.execute('ALTER TABLE viagens ADD COLUMN valor DECIMAL(10,2) AFTER dificuldade');
        console.log('✅ Coluna valor adicionada com sucesso!');
      } catch (error) {
        console.log('❌ Erro ao adicionar coluna:', error.message);
      }
    }
    
    // Verificar dados existentes
    const [rows] = await pool.execute('SELECT id, titulo, valor FROM viagens LIMIT 5');
    console.log('\n📊 Dados existentes (primeiras 5 viagens):');
    rows.forEach(row => {
      console.log(`- ID: ${row.id}, Título: ${row.titulo}, Valor: ${row.valor || 'NULL'}`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('❌ Erro:', error.message);
    await pool.end();
  }
}

checkTable();
