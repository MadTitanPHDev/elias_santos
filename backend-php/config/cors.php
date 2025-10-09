<?php
/**
 * Configuração CORS
 * Para permitir requisições do frontend
 */

class CORS {
    public static function enable() {
        // Permitir origens específicas (ajuste conforme necessário)
        $allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://lightpink-albatross-852396.hostingersite.com',
            'https://www.lightpink-albatross-852396.hostingersite.com'
        ];
        
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
        if (in_array($origin, $allowedOrigins) || in_array('*', $allowedOrigins)) {
            header("Access-Control-Allow-Origin: $origin");
        }
        
        // Headers permitidos
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400'); // 24 horas
        
        // Responder a requisições OPTIONS (preflight)
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }
}

// Habilitar CORS automaticamente
CORS::enable();
?>
