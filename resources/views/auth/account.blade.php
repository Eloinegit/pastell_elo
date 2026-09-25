<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>My Account - Pastell'Elo</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; background: #fff; color: #333; }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 40px;
            border-bottom: 1px solid #f0f0f0;
        }
        .header h1 {
            font-family: 'Playfair Display', cursive;
            font-size: 32px;
            font-style: italic;
            color: #222;
        }
        .header-nav { display: flex; gap: 30px; align-items: center; }
        .header-nav a {
            text-decoration: none;
            color: #555;
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .header-nav a:hover { color: #222; }
        .logout-btn {
            background: none;
            border: 1px solid #222;
            padding: 8px 20px;
            font-family: 'Poppins', sans-serif;
            font-size: 12px;
            letter-spacing: 1px;
            text-transform: uppercase;
            cursor: pointer;
        }
        .logout-btn:hover { background: #222; color: #fff; }

        .account-container { max-width: 1000px; margin: 60px auto; padding: 0 20px; }
        .welcome-section {
            text-align: center;
            padding: 40px 20px;
            border-bottom: 1px solid #f0f0f0;
            margin-bottom: 40px;
        }
        .welcome-section h2 {
            font-family: 'Playfair Display', serif;
            font-size: 36px;
            font-weight: 400;
            margin-bottom: 10px;
        }
        .welcome-section p { color: #777; font-size: 14px; }

        .orders-section h3 {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            margin-bottom: 30px;
            font-weight: 400;
        }

        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; padding: 15px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
        th { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #777; font-weight: 500; }
        .status-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 11px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-processing { background: #cce5ff; color: #004085; }
        .status-shipped { background: #d4edda; color: #155724; }
        .status-delivered { background: #e2e3e5; color: #383d41; }
        .empty-state { text-align: center; padding: 60px 20px; color: #999; }
        .shop-link {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 30px;
            background: #222;
            color: #fff;
            text-decoration: none;
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .shop-link:hover { background: #444; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Pastell'Elo</h1>
        <div class="header-nav">
            <a href="/">Shop</a>
            <form method="POST" action="/logout" style="display:inline;">
                @csrf
                <button type="submit" class="logout-btn">Logout</button>
            </form>
        </div>
    </div>

    <div class="account-container">
        <div class="welcome-section">
            <h2>Welcome, {{ $user->name }}!</h2>
            <p>{{ $user->email }}</p>
        </div>

        <div class="orders-section">
            <h3>Your Orders</h3>
            
            @if($orders->isEmpty())
                <div class="empty-state">
                    <p>You haven't placed any orders yet.</p>
                    <a href="/" class="shop-link">Start Shopping</a>
                </div>
            @else
            <table>
                <thead>
                    <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($orders as $order)
                    <tr>
                        <td>#{{ $order->id }}</td>
                        <td>{{ $order->created_at->format('M d, Y') }}</td>
                        <td>${{ number_format($order->total_price, 2) }}</td>
                        <td><span class="status-badge status-{{ $order->status }}">{{ $order->status }}</span></td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
            @endif
        </div>
    </div>
</body>
</html>