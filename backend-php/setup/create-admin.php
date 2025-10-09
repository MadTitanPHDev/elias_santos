<?php
/**
 * Script para criar usuário administrador
 * Execute este arquivo uma vez para configurar o usuário admin
 */

require_once __DIR__ . '/../config/database.php';

try {
    $db = Database::getInstance();
    
    // Hash da senha
    $senha = 'admin@eliasSantos';
    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
    
    // Dados do admin
    $nome = 'Administrador';
    $email = 'admin@eliassantos.com';
    $tipo = 'gestor';
    
    // Verificar se já existe
    $existingUser = $db->fetchOne('SELECT id FROM usuarios WHERE email = ?', [$email]);
    
    if ($existingUser) {
        // Atualizar senha se já existe
        $db->execute(
            'UPDATE usuarios SET senha_hash = ?, tipo = ?, ativo = TRUE WHERE email = ?',
            [$senhaHash, $tipo, $email]
        );
        echo "✅ Usuário admin atualizado com sucesso!\n";
    } else {
        // Criar novo usuário
        $db->execute(
            'INSERT INTO usuarios (nome, email, senha_hash, tipo, ativo) VALUES (?, ?, ?, ?, TRUE)',
            [$nome, $email, $senhaHash, $tipo]
        );
        echo "✅ Usuário admin criado com sucesso!\n";
    }
    
    echo "📧 Email: {$email}\n";
    echo "🔑 Senha: {$senha}\n";
    echo "👤 Tipo: {$tipo}\n";
    echo "\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!\n";
    
} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
    exit(1);
}
?>
