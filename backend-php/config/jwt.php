<?php
/**
 * Sistema de Autenticação JWT
 * Otimizado para PHP puro (sem dependências externas)
 */

class JWT {
    private static $secret;
    
    public static function init($secret = null) {
        self::$secret = $secret ?: 'seu_segredo_jwt_aqui_use_variavel_ambiente_em_producao';
    }
    
    /**
     * Codificar dados em Base64URL
     */
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    /**
     * Decodificar dados de Base64URL
     */
    private static function base64UrlDecode($data) {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
    }
    
    /**
     * Gerar HMAC SHA256
     */
    private static function hmacSha256($data, $key) {
        return hash_hmac('sha256', $data, $key, true);
    }
    
    /**
     * Gerar token JWT
     */
    public static function encode($payload, $expiration = 86400) { // 24 horas por padrão
        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];
        
        // Adicionar expiração
        $payload['exp'] = time() + $expiration;
        $payload['iat'] = time();
        
        $headerEncoded = self::base64UrlEncode(json_encode($header));
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));
        
        $signature = self::base64UrlEncode(
            self::hmacSha256($headerEncoded . '.' . $payloadEncoded, self::$secret)
        );
        
        return $headerEncoded . '.' . $payloadEncoded . '.' . $signature;
    }
    
    /**
     * Decodificar e verificar token JWT
     */
    public static function decode($token) {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            throw new Exception('Token inválido');
        }
        
        list($headerEncoded, $payloadEncoded, $signature) = $parts;
        
        // Verificar assinatura
        $expectedSignature = self::base64UrlEncode(
            self::hmacSha256($headerEncoded . '.' . $payloadEncoded, self::$secret)
        );
        
        if (!hash_equals($expectedSignature, $signature)) {
            throw new Exception('Assinatura inválida');
        }
        
        $payload = json_decode(self::base64UrlDecode($payloadEncoded), true);
        
        // Verificar expiração
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token expirado');
        }
        
        return $payload;
    }
    
    /**
     * Verificar se token é válido
     */
    public static function isValid($token) {
        try {
            self::decode($token);
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}

// Inicializar com secret do ambiente ou padrão
JWT::init($_ENV['JWT_SECRET'] ?? 'seu_segredo_jwt_aqui_use_variavel_ambiente_em_producao');
?>
