<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Register - Pastell'Elo</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Poppins', sans-serif; 
            background: #fff; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh; 
        }
        .auth-box {
            width: 400px;
            padding: 50px;
            border: 1px solid #f0f0f0;
            text-align: center;
        }
        .auth-box h1 {
            font-family: 'Playfair Display', cursive;
            font-size: 32px;
            font-style: italic;
            margin-bottom: 10px;
            color: #222;
        }
        .auth-box p {
            color: #777;
            font-size: 13px;
            margin-bottom: 30px;
        }
        .auth-box input {
            width: 100%;
            padding: 15px;
            border: 1px solid #e0e0e0;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            margin-bottom: 15px;
            outline: none;
        }
        .auth-box input:focus { border-color: #222; }
        .auth-box button {
            width: 100%;
            padding: 15px;
            background: #222;
            color: #fff;
            border: none;
            font-family: 'Poppins', sans-serif;
            font-size: 13px;
            letter-spacing: 2px;
            text-transform: uppercase;
            cursor: pointer;
            margin-top: 10px;
        }
        .auth-box button:hover { background: #444; }
        .error { color: #c0392b; font-size: 12px; margin-bottom: 15px; }
        .auth-link {
            display: block;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
            text-decoration: none;
        }
        .auth-link:hover { color: #222; }
    </style>
</head>
<body>
    <div class="auth-box">
        <h1>Pastell'Elo</h1>
        <p>Create your account</p>
        
        @if ($errors->any())
            <div class="error">{{ $errors->first() }}</div>
        @endif

        <form method="POST" action="/register">
            @csrf
            <input type="text" name="name" placeholder="Full name" required value="{{ old('name') }}">
            <input type="email" name="email" placeholder="Email address" required value="{{ old('email') }}">
            <input type="password" name="password" placeholder="Password (min 6 characters)" required>
            <input type="password" name="password_confirmation" placeholder="Confirm password" required>
            <button type="submit">CREATE ACCOUNT</button>
        </form>

        <a href="/login" class="auth-link">Already have an account? Sign in</a>
        <a href="/" class="auth-link">← Back to shop</a>
    </div>
</body>
</html>