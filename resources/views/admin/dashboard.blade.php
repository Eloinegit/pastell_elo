<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Admin Dashboard - Pastell'Elo</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; background: #fff; color: #333; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; border-bottom: 1px solid #f0f0f0; }
        .admin-header h1 { font-family: 'Playfair Display', cursive; font-size: 28px; font-style: italic; color: #222; }
        .logout-btn { background: none; border: 1px solid #222; padding: 8px 20px; font-family: 'Poppins', sans-serif; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; }
        .logout-btn:hover { background: #222; color: #fff; }
        .tabs { display: flex; justify-content: center; gap: 30px; padding: 30px 0; border-bottom: 1px solid #f0f0f0; }
        .tab-btn { background: none; border: none; padding: 10px 25px; font-family: 'Poppins', sans-serif; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; color: #777; cursor: pointer; border-bottom: 2px solid transparent; }
        .tab-btn.active { color: #222; border-bottom: 2px solid #222; }
        .tab-content { display: none; padding: 40px; max-width: 1200px; margin: 0 auto; }
        .tab-content.active { display: block; }
        .tab-content h2 { font-family: 'Playfair Display', serif; font-size: 28px; margin-bottom: 30px; color: #222; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { text-align: left; padding: 15px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
        th { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #777; font-weight: 500; }
        .status-badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-processing { background: #cce5ff; color: #004085; }
        .status-shipped { background: #d4edda; color: #155724; }
        .status-delivered { background: #e2e3e5; color: #383d41; }
        .action-btn { background: none; border: 1px solid #e0e0e0; padding: 6px 12px; font-size: 11px; cursor: pointer; margin-right: 5px; }
        .action-btn:hover { border-color: #222; }
        .action-btn.delete { color: #c0392b; border-color: #e74c3c; }
        .action-btn.delete:hover { background: #e74c3c; color: #fff; }
        
        .add-form { background: #f9f9f9; padding: 25px; margin-bottom: 30px; border: 1px solid #f0f0f0; display: flex; gap: 15px; align-items: flex-end; flex-wrap: wrap; }
        .add-form .input-group { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 150px; }
        .add-form label { font-size: 11px; text-transform: uppercase; color: #777; letter-spacing: 1px; }
        .add-form input, .add-form select { padding: 10px; border: 1px solid #e0e0e0; font-family: 'Poppins', sans-serif; outline: none; }
        .add-form button { background: #222; color: #fff; border: none; padding: 10px 25px; cursor: pointer; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; height: 38px; }
        .add-form button:hover { background: #444; }
        
        .success-msg { background: #d4edda; color: #155724; padding: 15px; margin-bottom: 20px; text-align: center; border-radius: 4px; }

        /* Styles pour les Modales */
        .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; }
        .modal-content { background: #fff; padding: 40px; width: 600px; max-height: 90vh; overflow-y: auto; border: 1px solid #f0f0f0; position: relative; }
        .modal-content h3 { font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 20px; }
        .modal-close { position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #777; }
        .modal-close:hover { color: #222; }
        .modal-form .input-group { margin-bottom: 15px; }
        .modal-form input, .modal-form select { width: 100%; padding: 12px; border: 1px solid #e0e0e0; font-family: 'Poppins', sans-serif; outline: none; }
        .modal-form button { width: 100%; background: #222; color: #fff; border: none; padding: 15px; cursor: pointer; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; margin-top: 10px; }
        .modal-form button:hover { background: #444; }
        
        .order-info { margin-bottom: 20px; font-size: 14px; line-height: 1.6; }
        .order-info strong { color: #222; }
        .total-final { text-align: right; margin-top: 20px; font-size: 18px; font-weight: 600; border-top: 2px solid #222; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="admin-header">
        <h1>Pastell'Elo Admin</h1>
        <form method="POST" action="/admin/logout" style="display:inline;">
            @csrf
            <button type="submit" class="logout-btn">Logout</button>
        </form>
    </div>

    <div class="tabs">
        <button class="tab-btn active" onclick="showTab('orders')">Orders ({{ $orders->count() }})</button>
        <button class="tab-btn" onclick="showTab('patisseries')">Patisseries ({{ $patisseries->count() }})</button>
    </div>

    @if(session('success'))
        <div style="max-width: 1200px; margin: 20px auto 0; padding: 0 40px;">
            <div class="success-msg">{{ session('success') }}</div>
        </div>
    @endif

    <!-- ONGLET COMMANDES -->
    <div id="orders" class="tab-content active">
        <h2>All Orders</h2>
        @if($orders->isEmpty())
            <p style="color:#999; text-align:center; padding:40px;">No orders yet.</p>
        @else
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($orders as $order)
                <tr>
                    <td>#{{ $order->id }}</td>
                    <td>
                        <strong>{{ $order->customer_name }}</strong><br>
                        <span style="font-size:12px; color:#777;">{{ $order->customer_email }}</span>
                    </td>
                    <td>${{ number_format($order->total_price, 2) }}</td>
                    <td>
                        <form method="POST" action="{{ route('admin.orders.status', $order->id) }}" style="display:inline;">
                            @csrf
                            @method('PATCH')
                            <select name="status" onchange="this.form.submit()" style="padding:5px; border:1px solid #ddd; font-family:'Poppins'; font-size:12px;">
                                <option value="pending" {{ $order->status == 'pending' ? 'selected' : '' }}>Pending</option>
                                <option value="processing" {{ $order->status == 'processing' ? 'selected' : '' }}>Processing</option>
                                <option value="shipped" {{ $order->status == 'shipped' ? 'selected' : '' }}>Shipped</option>
                                <option value="delivered" {{ $order->status == 'delivered' ? 'selected' : '' }}>Delivered</option>
                            </select>
                        </form>
                    </td>
                    <td>{{ $order->created_at->format('M d, Y') }}</td>
                    <td>
                        <!-- Bouton qui ouvre la modale de détails -->
                        <button class="action-btn" onclick="document.getElementById('orderModal{{ $order->id }}').style.display='flex'">View Details</button>
                    </td>
                </tr>

                <!-- MODALE DE DÉTAILS POUR CETTE COMMANDE -->
                <div id="orderModal{{ $order->id }}" class="modal-overlay" onclick="if(event.target==this)this.style.display='none'">
                    <div class="modal-content">
                        <button class="modal-close" onclick="this.parentElement.parentElement.style.display='none'">×</button>
                        <h3>Order #{{ $order->id }} Details</h3>
                        
                        <div class="order-info">
                            <p><strong>Customer:</strong> {{ $order->customer_name }}</p>
                            <p><strong>Email:</strong> {{ $order->customer_email }}</p>
                            <p><strong>Delivery Address:</strong> {{ $order->delivery_address }}</p>
                            <p><strong>Date:</strong> {{ $order->created_at->format('M d, Y - H:i') }}</p>
                            <p><strong>Status:</strong> <span class="status-badge status-{{ $order->status }}">{{ $order->status }}</span></p>
                        </div>

                        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #f0f0f0;">
                        
                        <h4 style="font-family: 'Playfair Display', serif; font-size: 18px; margin-bottom: 15px;">Items Ordered</h4>
                        <table style="margin-top: 0;">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($order->items as $item)
                                <tr>
                                    <td>{{ $item->patisserie ? $item->patisserie->nom : 'Deleted Product' }}</td>
                                    <td>{{ $item->quantity }}</td>
                                    <td>${{ number_format($item->price, 2) }}</td>
                                    <td>${{ number_format($item->price * $item->quantity, 2) }}</td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>

                        <div class="total-final">
                            Grand Total: ${{ number_format($order->total_price, 2) }}
                        </div>
                    </div>
                </div>
                <!-- FIN MODALE -->

                @endforeach
            </tbody>
        </table>
        @endif
    </div>

    <!-- ONGLET PÂTISSERIES -->
    <div id="patisseries" class="tab-content">
        <h2>All Patisseries</h2>
        
        <form method="POST" action="{{ route('admin.patisseries.store') }}" class="add-form" enctype="multipart/form-data">
            @csrf
            <div class="input-group">
                <label>Name</label>
                <input type="text" name="nom" required placeholder="ex: Chocolate Cake">
            </div>
            <div class="input-group">
                <label>Category</label>
                <select name="categorie" required>
                    <option value="Eclairs">Eclairs</option>
                    <option value="Tarts">Tarts</option>
                    <option value="Macarons">Macarons</option>
                    <option value="Cakes">Cakes</option>
                    <option value="Cupcakes">Cupcakes</option>
                    <option value="Viennoiseries">Viennoiseries</option>
                </select>
            </div>
            <div class="input-group">
                <label>Price ($)</label>
                <input type="number" step="0.01" name="prix" required placeholder="0.00">
            </div>
            <div class="input-group" style="flex: 1;">
                <label>Description</label>
                <input type="text" name="description" required placeholder="Short description...">
            </div>
            <div class="input-group">
                <label>Image</label>
                <input type="file" name="image" accept="image/*" required style="padding:8px; font-size:12px;">
            </div>
            <button type="submit">+ Add</button>
        </form>

        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($patisseries as $p)
                <tr>
                    <td>
                        @if($p->image)
                            <img src="/{{ $p->image }}" alt="{{ $p->nom }}" style="width:60px; height:60px; object-fit:cover; border-radius:4px; border:1px solid #f0f0f0;">
                        @else
                            <div style="width:60px; height:60px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; border-radius:4px; color:#999; font-size:10px;">No Image</div>
                        @endif
                    </td>
                    <td>#{{ $p->id }}</td>
                    <td>{{ $p->nom }}</td>
                    <td>{{ $p->categorie }}</td>
                    <td>${{ number_format($p->prix, 2) }}</td>
                    <td>
                        <button class="action-btn edit-btn" 
                            data-id="{{ $p->id }}" 
                            data-nom="{{ $p->nom }}" 
                            data-categorie="{{ $p->categorie }}" 
                            data-prix="{{ $p->prix }}" 
                            data-description="{{ $p->description }}">
                            Edit
                        </button>
                        
                        <form method="POST" action="{{ route('admin.patisseries.destroy', $p->id) }}" style="display:inline;" onsubmit="return confirm('Are you sure you want to delete this item?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="action-btn delete">Delete</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- MODALE D'ÉDITION PÂTISSERIE -->
    <div id="editModal" class="modal-overlay" onclick="if(event.target==this)closeEditModal()">
        <div class="modal-content" style="width: 500px;">
            <button class="modal-close" onclick="closeEditModal()">×</button>
            <h3>Edit Patisserie</h3>
            
            <form method="POST" action="" id="editForm" class="modal-form" enctype="multipart/form-data">
                @csrf
                @method('PUT')
                
                <div class="input-group">
                    <label>Name</label>
                    <input type="text" name="nom" id="edit_nom" required>
                </div>
                <div class="input-group">
                    <label>Category</label>
                    <select name="categorie" id="edit_categorie" required>
                        <option value="Eclairs">Eclairs</option>
                        <option value="Tarts">Tarts</option>
                        <option value="Macarons">Macarons</option>
                        <option value="Cakes">Cakes</option>
                        <option value="Cupcakes">Cupcakes</option>
                        <option value="Viennoiseries">Viennoiseries</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Price ($)</label>
                    <input type="number" step="0.01" name="prix" id="edit_prix" required>
                </div>
                <div class="input-group">
                    <label>Description</label>
                    <input type="text" name="description" id="edit_description" required>
                </div>
                <div class="input-group">
                    <label>New Image (Optional)</label>
                    <input type="file" name="image" accept="image/*" style="padding:8px; font-size:12px;">
                    <small style="color:#777; font-size:10px;">Leave empty to keep current image.</small>
                </div>
                
                <button type="submit">Update Patisserie</button>
            </form>
        </div>
    </div>

    <script>
        // Gestion des onglets
        function showTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }

        // Gestion de la Modale d'édition Pâtisserie
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const nom = this.getAttribute('data-nom');
                const categorie = this.getAttribute('data-categorie');
                const prix = this.getAttribute('data-prix');
                const description = this.getAttribute('data-description');
                
                document.getElementById('edit_nom').value = nom;
                document.getElementById('edit_categorie').value = categorie;
                document.getElementById('edit_prix').value = prix;
                document.getElementById('edit_description').value = description;
                document.getElementById('editForm').action = '/admin/patisseries/' + id;
                document.getElementById('editModal').style.display = 'flex';
            });
        });

        function closeEditModal() {
            document.getElementById('editModal').style.display = 'none';
        }
    </script>
</body>
</html>