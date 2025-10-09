<?php
/**
 * Configuração do Banco de Dados
 * Otimizado para hospedagem compartilhada
 */

class Database {
    private static $instance = null;
    private $connection;
    
    // Configurações do banco - ajuste conforme sua hospedagem
    private $host = 'localhost';
    private $dbname = 'u937729098_elias_santosdb';
    private $username = 'u937729098_elias_santos';
    private $password = 'J7caWp;pit!t';
    private $charset = 'utf8mb4';
    
    private function __construct() {
        $this->connect();
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function connect() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$this->charset}"
            ];
            
            $this->connection = new PDO($dsn, $this->username, $this->password, $options);
            
            // Criar tabelas se não existirem
            $this->createTables();
            
        } catch (PDOException $e) {
            error_log("Erro de conexão com o banco: " . $e->getMessage());
            throw new Exception("Erro de conexão com o banco de dados");
        }
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    private function createTables() {
        try {
            // Tabela de usuários
            $this->connection->exec("
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    nome VARCHAR(100) NOT NULL,
                    email VARCHAR(150) UNIQUE NOT NULL,
                    senha_hash VARCHAR(255) NOT NULL,
                    tipo ENUM('gestor', 'usuario') DEFAULT 'usuario',
                    ativo BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            ");
            
            // Tabela de viagens
            $this->connection->exec("
                CREATE TABLE IF NOT EXISTS viagens (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    titulo VARCHAR(200) NOT NULL,
                    descricao TEXT NOT NULL,
                    resumo VARCHAR(500),
                    distancia_km DECIMAL(8,2),
                    duracao_dias INT,
                    data_viagem DATE,
                    localizacao VARCHAR(150),
                    dificuldade ENUM('fácil', 'moderada', 'difícil', 'extrema'),
                    valor DECIMAL(10,2),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            ");
            
            // Tabela de imagens das viagens
            $this->connection->exec("
                CREATE TABLE IF NOT EXISTS viagem_imagens (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    viagem_id INT NOT NULL,
                    caminho_imagem VARCHAR(255) NOT NULL,
                    descricao_imagem VARCHAR(300),
                    ordem INT DEFAULT 0,
                    is_capa BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (viagem_id) REFERENCES viagens(id) ON DELETE CASCADE
                )
            ");
            
            error_log("✅ Tabelas criadas/verificadas com sucesso!");
            
        } catch (PDOException $e) {
            error_log("❌ Erro ao criar tabelas: " . $e->getMessage());
        }
    }
    
    // Método para executar queries com prepared statements
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Erro na query: " . $e->getMessage());
            throw new Exception("Erro na execução da query");
        }
    }
    
    // Método para buscar um registro
    public function fetchOne($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetch();
    }
    
    // Método para buscar múltiplos registros
    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }
    
    // Método para inserir e retornar o ID
    public function insert($sql, $params = []) {
        $this->query($sql, $params);
        return $this->connection->lastInsertId();
    }
    
    // Método para atualizar/deletar
    public function execute($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->rowCount();
    }
}
?>
