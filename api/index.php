<?php

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/hello/:name', function ($name) {
    echo "Hello, $name";
});
$app->get('/getitems', 'getItems');
$app->post('/saveitems', 'saveItems');
$app->put('/updateitems/:user_id', 'updateItems');

function getItems() {
    $sql = "select * FROM todos_table WHERE user_id=1 LIMIT 1";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $data = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '{"todos": ' . json_encode($todos) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function saveItems() {
    $request = Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $sql = "INSERT INTO todos_table (user_id, todo_items) VALUES (:user_id, :todo_items)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("user_id", 1);
        $stmt->bindParam("todo_items", $data->todos);
        $stmt->execute();
        $id = $db->lastInsertId();
        $db = null;
        echo json_encode($id);
    } catch(PDOException $e) {
       // error_log($e->getMessage(), 3, '/var/tmp/php.log');
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function updateItems($user_id) {
    $request = Slim::getInstance()->request();
    $body = $request->getBody();
    $data = json_decode($body);
    $sql = "UPDATE todos_table SET todo_items=:todo_items WHERE user_id=:user_id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("todo_items", $data->todos);
        $stmt->bindParam("user_id", 1);
        $stmt->execute();
        $db = null;
        echo json_encode($data); 
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function getConnection() {
    $dbhost="127.0.0.1";
    $dbuser="todos_user";
    $dbpass="todos_password";
    $dbname="todos";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

$app->run();
?>
