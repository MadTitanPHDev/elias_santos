<?php
/**
 * Configuração CORS - Versão Robusta
 * Para permitir requisições do frontend
 */

class CORS {
    private static $initialized = false;
    
    public static function enable() {
        // Evitar execução múltipla
        if (self::$initialized) {
            return;
        }
        
        // Verificar se headers já foram enviados
        if (headers_sent()) {
            return;
        }
        
        // Verificar se estamos em modo de teste
        if (defined('CORS_DISABLED') && CORS_DISABLED) {
            return;
        }
        
        try {
            // Permitir origens específicas
            $allowedOrigins = [
                'http://localhost:3000',
                'http://localhost:3001',
                'https://khaki-alpaca-178991.hostingersite.com',
                'https://www.khaki-alpaca-178991.hostingersite.com'
            ];
            
            $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
            
            if (in_array($origin, $allowedOrigins)) {
                header("Access-Control-Allow-Origin: $origin");
            }
            
            // Headers permitidos
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');
            
            // Responder a requisições OPTIONS (preflight)
            if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
                http_response_code(200);
                exit();
            }
            
            self::$initialized = true;
            
        } catch (Exception $e) {
            // Log do erro mas não quebrar a aplicação
            error_log('Erro no CORS: ' . $e->getMessage());
        }
    }
    
    public static function isInitialized() {
        return self::$initialized;
    }
}

// Não executar automaticamente - apenas definir a classe
?>
