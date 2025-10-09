<?php
/**
 * Arquivo de teste para a API
 */

header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'status' => 'OK',
    'message' => 'API está funcionando!',
    'timestamp' => date('Y-m-d H:i:s'),
    'server' => $_SERVER['SERVER_NAME'] ?? 'unknown',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown',
    'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown'
], JSON_UNESCAPED_UNICODE);
?>
