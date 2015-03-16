<?php

#require_once('/Users/DK/Sites/FirePHP/FirePHP.class.php');

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

#ob_start();

use \Slim\Slim;
$app = new Slim();

#Routes
$app -> get('/getItems', 'getItems');
$app -> post('/insertItems', 'insertItems');
$app -> put('/updateItems', 'updateItems');

$app -> run();

# get items
function getItems() {
    $sql = "select todo_items FROM todos_table WHERE user_id=1 LIMIT 1";
    try {
        $db = getConnection();
        $stmt = $db -> query($sql);
        $todos = $stmt->fetchObject();
        $db = null;
        echo json_encode($todos);
    } catch(PDOException $e) {
        echo '{"error":{"text":' . $e -> getMessage() . '}}';
    }
}

# update items
function updateItems() {
    $app = \Slim\Slim::getInstance();
    $request = $app -> request();
    $data = json_decode($request -> getBody());
    $todos = json_encode($data);
    $sql = "UPDATE todos_table SET todo_items=:todo_items WHERE user_id=:user_id";
    try {
        $user_id = 1;
        $db = getConnection();
        $stmt = $db -> prepare($sql);
        $stmt -> bindParam("todo_items", $todos);
        $stmt -> bindParam("user_id", $user_id);
        $stmt -> execute();
        $db = null;
        echo json_encode($data);
    } catch(PDOException $e) {
        echo '{"error":{"text":' . $e -> getMessage() . '}}';
    }
}

# new items
function insertItems() {
    $app = \Slim\Slim::getInstance();
    $request = $app -> request();
    $data = json_decode($request -> getBody());
    $todos = json_encode($data);
    $sql = "INSERT INTO todos_table (user_id, todo_items) VALUES (:user_id, :todo_items)";
    #$firephp = FirePHP::getInstance(true);
    #$firephp->log($data, 'Iterators');
    
    try {
        $user_id = 1;
        $db = getConnection();
        $stmt = $db->prepare($sql); 
        $stmt->bindParam("user_id", $user_id);
        $stmt->bindParam("todo_items", $todos);
        $stmt->execute();
        $id = $db->lastInsertId();
        $db = null;
        echo json_encode($data);
    } catch(PDOException $e) {
       // error_log($e->getMessage(), 3, '/var/tmp/php.log');
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

#DB connection function
function getConnection() {
    $dbhost = "127.0.0.1";
    $dbuser = "todos_user";
    $dbpass = "todos_password";
    $dbname = "todos";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}
?>
