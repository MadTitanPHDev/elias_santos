<?php
/**
 * API Principal - Sistema de Viagens de Bicicleta
 * Backend PHP otimizado para hospedagem compartilhada
 */

// Configurações iniciais
error_reporting(E_ALL);
ini_set('display_errors', 0); // Desabilitar em produção
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/error.log');

// Incluir configurações
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../utils/upload.php';

// Configurar headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Função para enviar resposta JSON
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

// Função para enviar erro
function sendError($message, $statusCode = 500) {
    sendResponse(['error' => $message], $statusCode);
}

// Função para log de requisições
function logRequest($method, $path, $statusCode = null) {
    $log = date('Y-m-d H:i:s') . " - {$method} {$path}";
    if ($statusCode) {
        $log .= " - Status: {$statusCode}";
    }
    error_log($log);
}

// Obter método e path da requisição
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api', '', $path); // Remover /api do path

// Log da requisição
logRequest($method, $path);

try {
    // Roteamento
    switch ($path) {
        case '/':
            handleRoot();
            break;
            
        case '/health':
            handleHealth();
            break;
            
        case '/login':
            if ($method === 'POST') {
                handleLogin();
            } else {
                sendError('Método não permitido', 405);
            }
            break;
            
        case '/verify':
            if ($method === 'GET') {
                handleVerify();
            } else {
                sendError('Método não permitido', 405);
            }
            break;
            
        case '/viagens':
            if ($method === 'GET') {
                handleGetViagens();
            } elseif ($method === 'POST') {
                handleCreateViagem();
            } else {
                sendError('Método não permitido', 405);
            }
            break;
            
        case '/viagens/aleatorias':
            if ($method === 'GET') {
                handleGetViagensAleatorias();
            } else {
                sendError('Método não permitido', 405);
            }
            break;
            
        case '/upload':
            if ($method === 'POST') {
                handleUpload();
            } else {
                sendError('Método não permitido', 405);
            }
            break;
            
        default:
            // Verificar se é uma rota com parâmetro (ex: /viagens/123)
            if (preg_match('/^\/viagens\/(\d+)(?:\/(.+))?$/', $path, $matches)) {
                $id = $matches[1];
                $action = $matches[2] ?? '';
                
                switch ($method) {
                    case 'GET':
                        handleGetViagem($id);
                        break;
                    case 'PUT':
                        if ($action === 'capa') {
                            handleUpdateCapa($id);
                        } else {
                            handleUpdateViagem($id);
                        }
                        break;
                    case 'DELETE':
                        handleDeleteViagem($id);
                        break;
                    default:
                        sendError('Método não permitido', 405);
                }
            } else {
                sendError('Rota não encontrada', 404);
            }
    }
    
} catch (Exception $e) {
    error_log('❌ Erro na API: ' . $e->getMessage());
    sendError('Erro interno do servidor', 500);
}

/**
 * Rota raiz - Informações da API
 */
function handleRoot() {
    sendResponse([
        'message' => 'Bem-vindo à API de Viagens de Bicicleta!',
        'endpoints' => [
            'GET /api/health' => 'Status do servidor',
            'GET /api/viagens' => 'Listar todas as viagens',
            'GET /api/viagens/:id' => 'Obter uma viagem específica',
            'POST /api/viagens' => 'Criar nova viagem',
            'PUT /api/viagens/:id' => 'Atualizar viagem existente',
            'DELETE /api/viagens/:id' => 'Excluir viagem',
            'PUT /api/viagens/:id/capa' => 'Atualizar imagem de capa',
            'POST /api/upload' => 'Upload de imagem'
        ],
        'version' => '1.0.0'
    ]);
}

/**
 * Health check
 */
function handleHealth() {
    try {
        $db = Database::getInstance();
        $db->query('SELECT 1');
        
        sendResponse([
            'status' => 'OK',
            'message' => 'API e banco de dados estão funcionando',
            'timestamp' => date('c')
        ]);
    } catch (Exception $e) {
        sendError('Erro na conexão com o banco de dados', 500);
    }
}

/**
 * Login
 */
function handleLogin() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendError('Dados inválidos', 400);
    }
    
    $email = $input['email'] ?? '';
    $senha = $input['senha'] ?? '';
    
    if (empty($email) || empty($senha)) {
        sendError('Email e senha são obrigatórios', 400);
    }
    
    try {
        $db = Database::getInstance();
        
        $user = $db->fetchOne(
            'SELECT * FROM usuarios WHERE email = ? AND ativo = TRUE',
            [$email]
        );
        
        if (!$user) {
            error_log('❌ Nenhum usuário encontrado para: ' . $email);
            sendError('Credenciais inválidas', 401);
        }
        
        if (!password_verify($senha, $user['senha_hash'])) {
            error_log('❌ Senha inválida para usuário: ' . $email);
            sendError('Credenciais inválidas', 401);
        }
        
        // Gerar token JWT
        $token = JWT::encode([
            'id' => $user['id'],
            'email' => $user['email'],
            'tipo' => $user['tipo'],
            'nome' => $user['nome']
        ]);
        
        error_log('✅ Login bem-sucedido para: ' . $email);
        
        sendResponse([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'nome' => $user['nome'],
                'email' => $user['email'],
                'tipo' => $user['tipo']
            ]
        ]);
        
    } catch (Exception $e) {
        error_log('💥 Erro no login: ' . $e->getMessage());
        sendError('Erro interno no servidor', 500);
    }
}

/**
 * Verificar token
 */
function handleVerify() {
    $user = AuthMiddleware::authenticate();
    
    sendResponse([
        'user' => $user,
        'valid' => true
    ]);
}

/**
 * Obter todas as viagens
 */
function handleGetViagens() {
    try {
        $db = Database::getInstance();
        
        $viagens = $db->fetchAll(`
            SELECT v.*, 
                   (SELECT caminho_imagem FROM viagem_imagens WHERE viagem_id = v.id AND is_capa = TRUE LIMIT 1) as imagem_capa
            FROM viagens v
            ORDER BY v.created_at DESC
        `);
        
        sendResponse($viagens);
        
    } catch (Exception $e) {
        error_log('Erro ao buscar viagens: ' . $e->getMessage());
        sendError('Erro interno do servidor', 500);
    }
}

/**
 * Obter viagens aleatórias
 */
function handleGetViagensAleatorias() {
    try {
        $limit = intval($_GET['limit'] ?? 3);
        error_log('🔍 Buscando viagens aleatórias, limit: ' . $limit);
        
        $db = Database::getInstance();
        
        $viagens = $db->fetchAll(`
            SELECT v.*, 
                   (SELECT caminho_imagem FROM viagem_imagens WHERE viagem_id = v.id AND is_capa = TRUE LIMIT 1) as imagem_capa
            FROM viagens v
            ORDER BY RAND()
            LIMIT ?
        `, [$limit]);
        
        error_log('✅ Viagens aleatórias encontradas: ' . count($viagens));
        sendResponse($viagens);
        
    } catch (Exception $e) {
        error_log('❌ Erro ao buscar viagens aleatórias: ' . $e->getMessage());
        sendError('Erro interno do servidor', 500);
    }
}

/**
 * Obter uma viagem específica
 */
function handleGetViagem($id) {
    try {
        $db = Database::getInstance();
        
        // Buscar viagem
        $viagem = $db->fetchOne('SELECT * FROM viagens WHERE id = ?', [$id]);
        
        if (!$viagem) {
            sendError('Viagem não encontrada', 404);
        }
        
        // Buscar imagens da viagem
        $imagens = $db->fetchAll(
            'SELECT * FROM viagem_imagens WHERE viagem_id = ? ORDER BY ordem',
            [$id]
        );
        
        $viagem['imagens'] = $imagens;
        
        sendResponse($viagem);
        
    } catch (Exception $e) {
        error_log('Erro ao buscar viagem: ' . $e->getMessage());
        sendError('Erro interno do servidor', 500);
    }
}

/**
 * Criar nova viagem
 */
function handleCreateViagem() {
    $user = AuthMiddleware::requireGestor();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendError('Dados inválidos', 400);
    }
    
    $requiredFields = ['titulo', 'descricao'];
    foreach ($requiredFields as $field) {
        if (empty($input[$field])) {
            sendError("Campo '{$field}' é obrigatório", 400);
        }
    }
    
    try {
        $db = Database::getInstance();
        
        $id = $db->insert(`
            INSERT INTO viagens (titulo, descricao, resumo, distancia_km, duracao_dias, data_viagem, localizacao, dificuldade, valor)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            $input['titulo'],
            $input['descricao'],
            $input['resumo'] ?? null,
            $input['distancia_km'] ?? null,
            $input['duracao_dias'] ?? null,
            $input['data_viagem'] ?? null,
            $input['localizacao'] ?? null,
            $input['dificuldade'] ?? null,
            $input['valor'] ?? null
        ]);
        
        error_log('✅ Viagem criada com ID: ' . $id);
        
        sendResponse([
            'id' => $id,
            'message' => 'Viagem criada com sucesso'
        ]);
        
    } catch (Exception $e) {
        error_log('❌ Erro ao criar viagem: ' . $e->getMessage());
        sendError('Erro interno do servidor', 500);
    }
}

/**
 * Atualizar viagem
 */
function handleUpdateViagem($id) {
    $user = AuthMiddleware::requireGestor();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendError('Dados inválidos', 400);
    }
    
    try {
        $db = Database::getInstance();
        
        // Verificar se a viagem existe
        $existingViagem = $db->fetchOne('SELECT id FROM viagens WHERE id = ?', [$id]);
        if (!$existingViagem) {
            sendError('Viagem não encontrada', 404);
        }
        
        $db->execute(`
            UPDATE viagens 
            SET titulo = ?, descricao = ?, resumo = ?, distancia_km = ?, duracao_dias = ?, 
                data_viagem = ?, localizacao = ?, dificuldade = ?, valor = ?, updated_at = NOW()
            WHERE id = ?
        `, [
            $input['titulo'],
            $input['descricao'],
            $input['resumo'] ?? null,
            $input['distancia_km'] ?? null,
            $input['duracao_dias'] ?? null,
            $input['data_viagem'] ?? null,
            $input['localizacao'] ?? null,
            $input['dificuldade'] ?? null,
            $input['valor'] ?? null,
            $id
        ]);
        
        error_log('✅ Viagem atualizada com sucesso');
        sendResponse(['message' => 'Viagem atualizada com sucesso']);
        
    } catch (Exception $e) {
        error_log('❌ Erro ao atualizar viagem: ' . $e->getMessage());
        sendError('Erro interno do servidor', 500);
    }
}

/**
 * Deletar viagem
 */
function handleDeleteViagem($id) {
    $user = AuthMiddleware::requireGestor();
    
    try {
        $db = Database::getInstance();
        
        // Verificar se a viagem existe
        $existingViagem = $db->fetchOne('SELECT id FROM viagens WHERE id = ?', [$id]);
        if (!$existingViagem) {
            sendError('Viagem não encontrada', 404);
        }
        
        // Buscar imagens da viagem
        $imagens = $db->fetchAll('SELECT caminho_imagem FROM viagem_imagens WHERE viagem_id = ?', [$id]);
        
        // Deletar arquivos físicos
        foreach ($imagens as $imagem) {
            $filepath = ltrim($imagem['caminho_imagem'], '/');
            if (file_exists($filepath)) {
                unlink($filepath);
                error_log('🗑️ Arquivo deletado: ' . $filepath);
            }
        }
        
        // Deletar registros das imagens no banco
        $db->execute('DELETE FROM viagem_imagens WHERE viagem_id = ?', [$id]);
        
        // Deletar a viagem
        $db->execute('DELETE FROM viagens WHERE id = ?', [$id]);
        
        error_log('✅ Viagem e imagens excluídas com sucesso');
        sendResponse(['message' => 'Viagem excluída com sucesso']);
        
    } catch (Exception $e) {
        error_log('❌ Erro ao excluir viagem: ' . $e->getMessage());
        sendError('Erro interno do servidor', 500);
    }
}

/**
 * Atualizar imagem de capa
 */
function handleUpdateCapa($id) {
    $user = AuthMiddleware::requireGestor();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['imagemId'])) {
        sendError('ID da imagem é obrigatório', 400);
    }
    
    try {
        $db = Database::getInstance();
        
        // Verificar se a viagem existe
        $existingViagem = $db->fetchOne('SELECT id FROM viagens WHERE id = ?', [$id]);
        if (!$existingViagem) {
            sendError('Viagem não encontrada', 404);
        }
        
        // Verificar se a imagem existe e pertence à viagem
        $existingImagem = $db->fetchOne(
            'SELECT id FROM viagem_imagens WHERE id = ? AND viagem_id = ?',
            [$input['imagemId'], $id]
        );
        if (!$existingImagem) {
            sendError('Imagem não encontrada ou não pertence à viagem', 404);
        }
        
        // Remover capa de todas as imagens da viagem
        $db->execute('UPDATE viagem_imagens SET is_capa = FALSE WHERE viagem_id = ?', [$id]);
        
        // Definir a nova capa
        $db->execute('UPDATE viagem_imagens SET is_capa = TRUE WHERE id = ?', [$input['imagemId']]);
        
        error_log('✅ Imagem de capa atualizada com sucesso');
        sendResponse(['message' => 'Imagem de capa atualizada com sucesso']);
        
    } catch (Exception $e) {
        error_log('❌ Erro ao atualizar imagem de capa: ' . $e->getMessage());
        sendError('Erro interno do servidor', 500);
    }
}

/**
 * Upload de imagem
 */
function handleUpload() {
    $user = AuthMiddleware::requireGestor();
    
    if (!isset($_FILES['image'])) {
        sendError('Nenhuma imagem enviada', 400);
    }
    
    $viagemId = $_POST['viagemId'] ?? '';
    $descricao = $_POST['descricao'] ?? '';
    $isCapa = ($_POST['isCapa'] ?? 'false') === 'true';
    
    if (empty($viagemId)) {
        sendError('ID da viagem é obrigatório', 400);
    }
    
    try {
        $result = ImageUpload::processUpload($_FILES['image'], $viagemId, $descricao, $isCapa);
        
        if ($result['success']) {
            sendResponse($result);
        } else {
            sendError($result['error'], 400);
        }
        
    } catch (Exception $e) {
        error_log('❌ Erro no upload: ' . $e->getMessage());
        sendError('Erro interno do servidor', 500);
    }
}
?>
