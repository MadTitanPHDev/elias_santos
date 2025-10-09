<?php
/**
 * Middleware de Autenticação
 * Verifica tokens JWT e permissões
 */

require_once __DIR__ . '/../config/jwt.php';

class AuthMiddleware {
    
    /**
     * Verificar se o token é válido
     */
    public static function authenticate() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        // Log para debug
        error_log("🔐 Token recebido: " . ($authHeader ? 'Sim' : 'Não'));
        error_log("🔐 Header Authorization: " . $authHeader);
        error_log("🔐 Rota: " . $_SERVER['REQUEST_URI']);
        error_log("🔐 Método: " . $_SERVER['REQUEST_METHOD']);
        
        if (!$authHeader) {
            error_log('❌ Token não encontrado');
            self::sendError('Token de acesso necessário', 401);
        }
        
        $token = null;
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
        }
        
        if (!$token) {
            error_log('❌ Formato de token inválido');
            self::sendError('Formato de token inválido', 401);
        }
        
        try {
            $payload = JWT::decode($token);
            error_log('✅ Token válido para usuário: ' . $payload['email']);
            
            // Adicionar dados do usuário ao contexto global
            $GLOBALS['user'] = $payload;
            
            return $payload;
            
        } catch (Exception $e) {
            error_log('❌ Token inválido: ' . $e->getMessage());
            self::sendError('Token inválido', 403);
        }
    }
    
    /**
     * Verificar se o usuário é gestor
     */
    public static function requireGestor() {
        $user = self::authenticate();
        
        if ($user['tipo'] !== 'gestor') {
            error_log('❌ Acesso negado - não é gestor');
            self::sendError('Acesso restrito a gestores', 403);
        }
        
        error_log('✅ Acesso permitido - usuário é gestor');
        return $user;
    }
    
    /**
     * Verificar token sem retornar erro (para rotas opcionais)
     */
    public static function optionalAuth() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (!$authHeader) {
            return null;
        }
        
        $token = null;
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
        }
        
        if (!$token) {
            return null;
        }
        
        try {
            $payload = JWT::decode($token);
            $GLOBALS['user'] = $payload;
            return $payload;
        } catch (Exception $e) {
            return null;
        }
    }
    
    /**
     * Enviar erro de autenticação
     */
    private static function sendError($message, $code) {
        http_response_code($code);
        header('Content-Type: application/json');
        echo json_encode(['error' => $message]);
        exit();
    }
    
    /**
     * Obter usuário atual do contexto
     */
    public static function getCurrentUser() {
        return $GLOBALS['user'] ?? null;
    }
}
?>
