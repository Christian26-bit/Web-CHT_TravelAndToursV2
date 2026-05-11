<!DOCTYPE html>
<html lang="en">

<head>
    <base href="<?php echo $baseUrl; ?>" >
    <script>const BASE_URL = "<?php echo $baseUrl; ?>";</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CHT Travel & Tour Management System - Login</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        body.login-body {
            background: #eef1f6;
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .login-wrapper {
            position: relative;
            z-index: 1;
            width: 100%;
            display: flex;
            justify-content: center;
            padding: 20px;
        }

        .login-card {
            width: 420px;
            max-width: 100%;
            background: #f8f9fb;
            border: 1px solid #e2e6f0;
            border-radius: 24px;
            padding: 40px 38px 36px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
            animation: cardFadeIn 0.6s ease-out;
        }

        @keyframes cardFadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Logo */
        .login-logo-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 8px;
        }

        .login-logo-area img {
            max-width: 120px;
            width: 120px;
            height: auto;
            filter: drop-shadow(0 2px 8px rgba(0,0,0,0.1));
        }

        /* Title */
        .login-title {
            text-align: center;
            margin: 12px 0 24px;
        }

        .login-title h2 {
            font-size: 24px;
            font-weight: 700;
            color: #1a1a2e;
            margin-bottom: 6px;
            letter-spacing: -0.3px;
        }

        .login-title p {
            font-size: 13px;
            color: #7b8499;
        }

        /* Form fields */
        .login-card .form-group {
            margin-bottom: 18px;
        }

        .login-card label {
            display: block;
            margin-bottom: 6px;
            font-size: 12px;
            font-weight: 600;
            color: #555b6e;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .login-card input[type="text"],
        .login-card input[type="password"] {
            width: 100%;
            padding: 12px 14px;
            border-radius: 10px;
            border: 1px solid #dde3f0;
            background: rgba(255, 255, 255, 0.95);
            font-size: 14px;
            color: #1a1a2e;
            outline: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .login-card input[type="text"]:focus,
        .login-card input[type="password"]:focus {
            border-color: #5ba3f5;
            box-shadow: 0 0 0 3px rgba(91, 163, 245, 0.25);
        }

        .login-card input::placeholder {
            color: #a0a8be;
        }

        /* Message */
        #loginMessage {
            margin-top: 4px;
            margin-bottom: 14px;
            padding: 10px 14px;
            border-radius: 8px;
            display: none;
            text-align: center;
            font-size: 13px;
            font-weight: 500;
            animation: msgFadeIn 0.3s ease;
        }

        @keyframes msgFadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
        }

        #loginMessage.error {
            background: #fdecea;
            color: #c62828;
            border: 1px solid #f5c6cb;
            display: block;
        }

        #loginMessage.success {
            background: #e8f5e9;
            color: #2e7d32;
            border: 1px solid #c8e6c9;
            display: block;
        }

        #loginMessage.loading {
            background: #e3f2fd;
            color: #1565c0;
            border: 1px solid #bbdefb;
            display: block;
        }

        /* Button */
        .login-actions {
            margin-top: 6px;
        }

        .login-btn {
            width: 100%;
            padding: 13px;
            border: none;
            border-radius: 10px;
            background: linear-gradient(135deg, #1b76d1, #2196f3);
            color: #fff;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            letter-spacing: 0.3px;
            transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
            box-shadow: 0 4px 15px rgba(27, 118, 209, 0.35);
        }

        .login-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(27, 118, 209, 0.5);
            background: linear-gradient(135deg, #1565c0, #1b76d1);
        }

        .login-btn:active {
            transform: translateY(0);
        }

        .login-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        /* Footer */
        .login-footer {
            margin-top: 24px;
            text-align: center;
            font-size: 11px;
            color: #a0a8be;
            line-height: 1.6;
        }

        /* Responsive */
        @media (max-width: 480px) {
            .login-card {
                padding: 30px 24px 28px;
                border-radius: 18px;
            }

            .login-title h2 {
                font-size: 20px;
            }
        }
    </style>
</head>

<body class="login-body">
    <div class="login-wrapper">
        <div class="login-card">
            <div class="login-logo-area">
                <img src="assets/images/no bg logo.png" alt="CHT Travel & Tours Logo">
            </div>

            <div class="login-title">
                <h2>Welcome Back</h2>
                <p>Sign in to your account</p>
            </div>

            <form id="loginForm" autocomplete="off">
                <div class="form-group">
                    <label for="email">Email / Username</label>
                    <input id="email" type="text" placeholder="Enter your email or username" autocomplete="username">
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input id="password" type="password" placeholder="Enter your password" autocomplete="current-password">
                </div>

                <div id="loginMessage"></div>

                <div class="login-actions">
                    <button type="submit" class="login-btn" id="loginBtn">Sign In</button>
                </div>
            </form>

            <div class="login-footer">
                CHT Travel & Tour Management System<br>
                &copy; 2026 All rights reserved
            </div>
        </div>
    </div>

    <script>

        // Login form submission
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('loginMessage');
            const loginBtn = document.getElementById('loginBtn');
            
            // Validate inputs
            if (!email || !password) {
                messageDiv.className = 'error';
                messageDiv.innerHTML = 'Please enter your email and password.';
                return;
            }
            
            // Show loading state
            loginBtn.disabled = true;
            loginBtn.textContent = 'Signing in...';
            messageDiv.className = 'loading';
            messageDiv.innerHTML = 'Authenticating...';
            
            // Send login request
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            
            fetch(BASE_URL + 'api/login', {
                method: 'POST',
                body: formData
            })
            .then(r => r.json())
            .then(res => {
                if (res.success) {
                    // Store user info
                    localStorage.setItem('cht_current_username', res.name || res.email);
                    
                    messageDiv.className = 'success';
                    messageDiv.innerHTML = 'Login successful! Redirecting...';
                    
                    // Redirect based on server-determined role
                    setTimeout(() => {
                        if (res.role === 'admin') {
                            window.location.href = BASE_URL + 'admin/dashboard';
                        } else {
                            window.location.href = BASE_URL + 'user/dashboard';
                        }
                    }, 500);
                } else {
                    // Failed - show error
                    messageDiv.className = 'error';
                    messageDiv.innerHTML = res.error || 'Invalid email or password.';
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Sign In';
                }
            })
            .catch(err => {
                console.error('Login error:', err);
                messageDiv.className = 'error';
                messageDiv.innerHTML = 'Wrong email or password.';
                loginBtn.disabled = false;
                loginBtn.textContent = 'Sign In';
            });
        });
    </script>
</body>

</html>
