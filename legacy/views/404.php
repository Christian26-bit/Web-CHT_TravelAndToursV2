<!DOCTYPE html>
<html lang="en">
<head>
    <base href="<?php echo $baseUrl; ?>" >
    <script>const BASE_URL = "<?php echo $baseUrl; ?>";</script>
    <meta charset="UTF-8">
    <title>404 Not Found - CHT Travel & Tours</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        body.error-body {
            background: url('assets/images/new background.jpg') no-repeat center center fixed;
            background-size: cover;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .error-card {
            background: rgba(255,255,255,0.9);
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            max-width: 500px;
            width: 90%;
        }
        .error-code {
            font-size: 72px;
            font-weight: bold;
            color: #d32f2f;
            margin: 0;
        }
        .error-title {
            font-size: 24px;
            color: #333;
            margin-bottom: 10px;
        }
        .error-message {
            color: #666;
            margin-bottom: 30px;
        }
        .btn-home {
            background-color: #2e7d32;
            color: white;
            padding: 12px 25px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            transition: background 0.3s;
        }
        .btn-home:hover {
            background-color: #1b5e20;
        }
    </style>
</head>
<body class="error-body">
    <div class="error-card">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Page Not Found</h2>
        <p class="error-message">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <a href="login" class="btn-home">Go to Login</a>
    </div>
</body>
</html>