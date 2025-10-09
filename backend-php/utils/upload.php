<?php
/**
 * Sistema de Upload de Imagens
 * Otimizado para segurança e performance
 */

class ImageUpload {
    private static $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    private static $maxSize = 10 * 1024 * 1024; // 10MB
    private static $uploadDir = 'uploads/';
    
    /**
     * Processar upload de imagem
     */
    public static function processUpload($file, $viagemId, $descricao = '', $isCapa = false) {
        try {
            // Validar arquivo
            self::validateFile($file);
            
            // Criar diretório se não existir
            self::createUploadDir();
            
            // Gerar nome único e seguro
            $filename = self::generateSafeFilename($file);
            $filepath = self::$uploadDir . $filename;
            
            // Mover arquivo
            if (!move_uploaded_file($file['tmp_name'], $filepath)) {
                throw new Exception('Erro ao salvar arquivo');
            }
            
            // Otimizar imagem (opcional)
            self::optimizeImage($filepath);
            
            // Salvar no banco de dados
            $imageId = self::saveToDatabase($viagemId, $filepath, $descricao, $isCapa);
            
            return [
                'success' => true,
                'message' => 'Imagem enviada com sucesso',
                'image' => [
                    'id' => $imageId,
                    'caminho_imagem' => '/' . $filepath,
                    'descricao_imagem' => $descricao ?: 'Imagem da viagem',
                    'is_capa' => $isCapa
                ]
            ];
            
        } catch (Exception $e) {
            error_log('❌ Erro no upload: ' . $e->getMessage());
            
            // Limpar arquivo em caso de erro
            if (isset($filepath) && file_exists($filepath)) {
                unlink($filepath);
            }
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Validar arquivo de upload
     */
    private static function validateFile($file) {
        // Verificar se arquivo foi enviado
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Erro no upload do arquivo');
        }
        
        // Verificar tamanho
        if ($file['size'] > self::$maxSize) {
            throw new Exception('Arquivo muito grande. Máximo 10MB');
        }
        
        // Verificar tipo MIME
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($mimeType, self::$allowedTypes)) {
            throw new Exception('Tipo de arquivo não permitido. Apenas imagens são aceitas');
        }
        
        // Verificar extensão
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        if (!in_array($extension, $allowedExtensions)) {
            throw new Exception('Extensão de arquivo não permitida');
        }
        
        // Verificar se é realmente uma imagem
        $imageInfo = getimagesize($file['tmp_name']);
        if ($imageInfo === false) {
            throw new Exception('Arquivo não é uma imagem válida');
        }
    }
    
    /**
     * Criar diretório de upload
     */
    private static function createUploadDir() {
        if (!file_exists(self::$uploadDir)) {
            if (!mkdir(self::$uploadDir, 0755, true)) {
                throw new Exception('Erro ao criar diretório de upload');
            }
        }
    }
    
    /**
     * Gerar nome de arquivo seguro
     */
    private static function generateSafeFilename($file) {
        $timestamp = time();
        $randomString = bin2hex(random_bytes(8));
        
        // Sanitizar nome original
        $originalName = pathinfo($file['name'], PATHINFO_FILENAME);
        $originalName = preg_replace('/[^a-zA-Z0-9.-]/', '-', $originalName);
        $originalName = preg_replace('/-+/', '-', $originalName);
        $originalName = trim($originalName, '-');
        
        // Obter extensão
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $safeExtension = in_array($extension, $validExtensions) ? $extension : 'jpg';
        
        // Gerar nome final (sem nome original para máxima segurança)
        $filename = $timestamp . '-' . $randomString . '.' . $safeExtension;
        
        error_log("📁 Nome original: " . $file['name']);
        error_log("📁 Nome sanitizado: " . $originalName);
        error_log("📁 Extensão: " . $safeExtension);
        error_log("📁 Nome final: " . $filename);
        
        return $filename;
    }
    
    /**
     * Otimizar imagem (reduzir tamanho)
     */
    private static function optimizeImage($filepath) {
        try {
            $imageInfo = getimagesize($filepath);
            if (!$imageInfo) return;
            
            $width = $imageInfo[0];
            $height = $imageInfo[1];
            $mimeType = $imageInfo['mime'];
            
            // Se a imagem for muito grande, redimensionar
            $maxWidth = 1920;
            $maxHeight = 1080;
            
            if ($width > $maxWidth || $height > $maxHeight) {
                $ratio = min($maxWidth / $width, $maxHeight / $height);
                $newWidth = intval($width * $ratio);
                $newHeight = intval($height * $ratio);
                
                // Criar nova imagem redimensionada
                $source = self::createImageFromFile($filepath, $mimeType);
                $resized = imagecreatetruecolor($newWidth, $newHeight);
                
                // Preservar transparência
                if ($mimeType === 'image/png' || $mimeType === 'image/gif') {
                    imagealphablending($resized, false);
                    imagesavealpha($resized, true);
                    $transparent = imagecolorallocatealpha($resized, 255, 255, 255, 127);
                    imagefilledrectangle($resized, 0, 0, $newWidth, $newHeight, $transparent);
                }
                
                imagecopyresampled($resized, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                
                // Salvar imagem otimizada
                self::saveImageToFile($resized, $filepath, $mimeType);
                
                imagedestroy($source);
                imagedestroy($resized);
                
                error_log("✅ Imagem otimizada: {$width}x{$height} -> {$newWidth}x{$newHeight}");
            }
            
        } catch (Exception $e) {
            error_log("⚠️ Erro ao otimizar imagem: " . $e->getMessage());
        }
    }
    
    /**
     * Criar recurso de imagem a partir do arquivo
     */
    private static function createImageFromFile($filepath, $mimeType) {
        switch ($mimeType) {
            case 'image/jpeg':
                return imagecreatefromjpeg($filepath);
            case 'image/png':
                return imagecreatefrompng($filepath);
            case 'image/gif':
                return imagecreatefromgif($filepath);
            case 'image/webp':
                return imagecreatefromwebp($filepath);
            default:
                throw new Exception('Tipo de imagem não suportado');
        }
    }
    
    /**
     * Salvar recurso de imagem no arquivo
     */
    private static function saveImageToFile($image, $filepath, $mimeType) {
        switch ($mimeType) {
            case 'image/jpeg':
                return imagejpeg($image, $filepath, 85); // 85% de qualidade
            case 'image/png':
                return imagepng($image, $filepath, 8); // 8 = compressão máxima
            case 'image/gif':
                return imagegif($image, $filepath);
            case 'image/webp':
                return imagewebp($image, $filepath, 85);
            default:
                throw new Exception('Tipo de imagem não suportado');
        }
    }
    
    /**
     * Salvar informações da imagem no banco
     */
    private static function saveToDatabase($viagemId, $filepath, $descricao, $isCapa) {
        require_once __DIR__ . '/../config/database.php';
        
        $db = Database::getInstance();
        
        // Se for capa, remover capa de outras imagens
        if ($isCapa) {
            $db->execute(
                'UPDATE viagem_imagens SET is_capa = FALSE WHERE viagem_id = ?',
                [$viagemId]
            );
        }
        
        // Inserir nova imagem
        $imageId = $db->insert(
            'INSERT INTO viagem_imagens (viagem_id, caminho_imagem, descricao_imagem, is_capa) VALUES (?, ?, ?, ?)',
            [$viagemId, '/' . $filepath, $descricao ?: 'Imagem da viagem', $isCapa]
        );
        
        return $imageId;
    }
    
    /**
     * Deletar imagem
     */
    public static function deleteImage($imageId) {
        try {
            require_once __DIR__ . '/../config/database.php';
            
            $db = Database::getInstance();
            
            // Buscar informações da imagem
            $image = $db->fetchOne(
                'SELECT caminho_imagem FROM viagem_imagens WHERE id = ?',
                [$imageId]
            );
            
            if (!$image) {
                throw new Exception('Imagem não encontrada');
            }
            
            // Deletar arquivo físico
            $filepath = ltrim($image['caminho_imagem'], '/');
            if (file_exists($filepath)) {
                unlink($filepath);
                error_log('🗑️ Arquivo deletado: ' . $filepath);
            }
            
            // Deletar registro do banco
            $db->execute('DELETE FROM viagem_imagens WHERE id = ?', [$imageId]);
            
            return true;
            
        } catch (Exception $e) {
            error_log('❌ Erro ao deletar imagem: ' . $e->getMessage());
            throw $e;
        }
    }
}
?>
