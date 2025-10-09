<?php
/**
 * Configurações gerais da aplicação
 * Centralize todas as configurações aqui
 */

// Configurações do ambiente
define('APP_ENV', $_ENV['APP_ENV'] ?? 'production');
define('APP_DEBUG', APP_ENV === 'development');

// Configurações do banco de dados
define('DB_HOST', $_ENV['DB_HOST'] ?? 'localhost');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'elias_santosdb');
define('DB_USER', $_ENV['DB_USER'] ?? 'root');
define('DB_PASS', $_ENV['DB_PASS'] ?? '');
define('DB_CHARSET', 'utf8mb4');

// Configurações JWT
define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? 'seu_segredo_jwt_aqui_use_variavel_ambiente_em_producao');
define('JWT_EXPIRATION', 86400); // 24 horas

// Configurações de upload
define('UPLOAD_MAX_SIZE', 10 * 1024 * 1024); // 10MB
define('UPLOAD_ALLOWED_TYPES', ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']);
define('UPLOAD_DIR', 'uploads/');

// Configurações de CORS
define('CORS_ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://seudominio.com',
    'https://www.seudominio.com'
]);

// Configurações de log
define('LOG_DIR', __DIR__ . '/../logs/');
define('LOG_LEVEL', APP_DEBUG ? 'DEBUG' : 'ERROR');

// Configurações de segurança
define('PASSWORD_MIN_LENGTH', 8);
define('SESSION_TIMEOUT', 3600); // 1 hora

// Configurações de API
define('API_VERSION', '1.0.0');
define('API_RATE_LIMIT', 100); // requests por hora

// Função para obter configuração
function config($key, $default = null) {
    $config = [
        'app.env' => APP_ENV,
        'app.debug' => APP_DEBUG,
        'app.version' => API_VERSION,
        
        'db.host' => DB_HOST,
        'db.name' => DB_NAME,
        'db.user' => DB_USER,
        'db.pass' => DB_PASS,
        'db.charset' => DB_CHARSET,
        
        'jwt.secret' => JWT_SECRET,
        'jwt.expiration' => JWT_EXPIRATION,
        
        'upload.max_size' => UPLOAD_MAX_SIZE,
        'upload.allowed_types' => UPLOAD_ALLOWED_TYPES,
        'upload.dir' => UPLOAD_DIR,
        
        'cors.allowed_origins' => CORS_ALLOWED_ORIGINS,
        
        'log.dir' => LOG_DIR,
        'log.level' => LOG_LEVEL,
        
        'security.password_min_length' => PASSWORD_MIN_LENGTH,
        'security.session_timeout' => SESSION_TIMEOUT,
        
        'api.rate_limit' => API_RATE_LIMIT
    ];
    
    return $config[$key] ?? $default;
}

// Função para log
function appLog($level, $message, $context = []) {
    if (!APP_DEBUG && $level === 'DEBUG') {
        return;
    }
    
    $logDir = config('log.dir');
    if (!file_exists($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $contextStr = !empty($context) ? ' ' . json_encode($context) : '';
    $logMessage = "[{$timestamp}] {$level}: {$message}{$contextStr}" . PHP_EOL;
    
    file_put_contents($logDir . 'app.log', $logMessage, FILE_APPEND | LOCK_EX);
}

// Função para debug
function debug($message, $context = []) {
    appLog('DEBUG', $message, $context);
}

// Função para info
function info($message, $context = []) {
    appLog('INFO', $message, $context);
}

// Função para warning
function warning($message, $context = []) {
    appLog('WARNING', $message, $context);
}

// Função para error
function error($message, $context = []) {
    appLog('ERROR', $message, $context);
}
?>
