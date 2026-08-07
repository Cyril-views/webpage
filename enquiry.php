<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $message = trim($_POST['message'] ?? '');
    $service = trim($_POST['service'] ?? '');
    $createdAt = date('Y-m-d H:i:s');

    if ($name === '' || $email === '' || $message === '') {
        header('Location: index.html?status=incomplete');
        exit;
    }

    $entry = [$createdAt, $name, $email, $phone, $service, $message] . PHP_EOL;
    file_put_contents('assets/enquiries.txt', $entry, FILE_APPEND | LOCK_EX);
    header('Location: index.html?status=success');
    exit;
}
?>
