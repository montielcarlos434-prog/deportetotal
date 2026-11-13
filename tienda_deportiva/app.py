import os
from flask import Flask, render_template, request, redirect, url_for, session, flash

app = Flask(__name__)
# Clave secreta para manejo de sesiones
app.secret_key = os.environ.get('SECRET_KEY', 'deporte_total_secret_session_key_2026')

# Base de datos simulada de productos
PRODUCTOS = {
    1: {
        'id': 1,
        'nombre': 'Balón de Fútbol Profesional Star',
        'precio': 29.99,
        'categoria': 'Fútbol',
        'imagen': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600',
        'descripcion': 'Balón de alta resistencia con diseño aerodinámico avanzado de 32 paneles. Ideal para partidos oficiales y entrenamientos profesionales en cualquier clima.'
    },
    2: {
        'id': 2,
        'nombre': 'Botas de Fútbol Elite FG',
        'precio': 79.99,
        'categoria': 'Fútbol',
        'imagen': 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=600',
        'descripcion': 'Botas ultraligeras con suela de tacos cónicos para césped natural firme. Parte superior sintética con textura para un mejor control del balón.'
    },
    3: {
        'id': 3,
        'nombre': 'Balón de Baloncesto Grip-Max',
        'precio': 34.99,
        'categoria': 'Baloncesto',
        'imagen': 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&q=80&w=600',
        'descripcion': 'Balón de cuero sintético premium con textura de guijarros profundos para un agarre excepcional en canchas interiores y exteriores.'
    },
    4: {
        'id': 4,
        'nombre': 'Zapatillas Baloncesto Dunk-Pro',
        'precio': 95.00,
        'categoria': 'Baloncesto',
        'imagen': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
        'descripcion': 'Zapatillas de cuello alto con amortiguación de aire y suela de tracción multidireccional que asegura estabilidad y protección del tobillo.'
    },
    5: {
        'id': 5,
        'nombre': 'Zapatillas Running Air-Sprint',
        'precio': 89.99,
        'categoria': 'Running',
        'imagen': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&q=80&w=600',
        'descripcion': 'Zapatillas ligeras y transpirables con suela de goma amortiguadora reactiva. Diseñadas para acumular kilómetros de running sobre asfalto sin fatiga.'
    },
    6: {
        'id': 6,
        'nombre': 'Reloj Deportivo GPS Tracker',
        'precio': 120.00,
        'categoria': 'Running',
        'imagen': 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=600',
        'descripcion': 'Monitorea ritmo cardíaco, pasos, calorías y rutas mediante GPS incorporado. Resistencia al agua 5 ATM y batería de hasta 10 días de duración.'
    },
    7: {
        'id': 7,
        'nombre': 'Mancuernas Ajustables Flex (Par)',
        'precio': 149.99,
        'categoria': 'Gimnasio',
        'imagen': 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&q=80&w=600',
        'descripcion': 'Reemplaza hasta 15 pares de pesas convencionales. Mecanismo de dial para ajustar fácilmente el peso desde 2.5 kg hasta 24 kg cada una.'
    },
    8: {
        'id': 8,
        'nombre': 'Bandas de Resistencia Elastic-Band',
        'precio': 14.99,
        'categoria': 'Gimnasio',
        'imagen': 'https://images.unsplash.com/photo-1598262138525-40b904d9b43e?auto=format&fit=crop&q=80&w=600',
        'descripcion': 'Juego de 5 bandas elásticas con mosquetones, manijas y anclaje de puerta. Distintas resistencias para entrenar fuerza de cuerpo completo.'
    },
    9: {
        'id': 9,
        'nombre': 'Casco de Ciclismo Aero-Pro',
        'precio': 59.99,
        'categoria': 'Ciclismo',
        'imagen': 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&q=80&w=600',
        'descripcion': 'Casco ultra liviano con 21 canales de ventilación aerodinámica y tecnología de seguridad de absorción de impactos EPS in-mold.'
    },
    10: {
        'id': 10,
        'nombre': 'Maillot Ciclismo Tech-Dry',
        'precio': 39.99,
        'categoria': 'Ciclismo',
        'imagen': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600',
        'descripcion': 'Maillot deportivo de secado rápido con cremallera completa, bolsillos traseros amplios y parches reflectantes de seguridad nocturna.'
    }
}

# Context processor para inyectar datos globales en los templates
@app.context_processor
def inject_cart_count():
    cart = session.get('cart', {})
    # Contar cuántos productos totales hay en el carrito
    total_items = sum(cart.values())
    return dict(cart_count=total_items)

# Ruta de inicio
@app.route('/')
def index():
    # Obtener algunos productos destacados (primeros 3 o uno por categoría)
    destacados = [PRODUCTOS[1], PRODUCTOS[4], PRODUCTOS[5], PRODUCTOS[7]]
    return render_template('index.html', destacados=destacados)

# Ruta para ver productos con filtros y buscador
@app.route('/productos')
def productos():
    categoria_filtrada = request.args.get('categoria', '')
    query = request.args.get('search', '').strip().lower()
    
    productos_filtrados = list(PRODUCTOS.values())
    
    # Filtrar por categoría
    if categoria_filtrada:
        productos_filtrados = [p for p in productos_filtrados if p['categoria'].lower() == categoria_filtrada.lower()]
        
    # Filtrar por búsqueda
    if query:
        productos_filtrados = [
            p for p in productos_filtrados 
            if query in p['nombre'].lower() or query in p['descripcion'].lower() or query in p['categoria'].lower()
        ]
        
    categorias = ['Fútbol', 'Baloncesto', 'Running', 'Gimnasio', 'Ciclismo']
    return render_template(
        'productos.html', 
        productos=productos_filtrados, 
        categorias=categorias,
        categoria_activa=categoria_filtrada,
        search_query=request.args.get('search', '')
    )

# Ruta para ver el carrito
@app.route('/carrito')
def carrito():
    cart = session.get('cart', {})
    items_carrito = []
    subtotal = 0.0
    
    for p_id_str, cantidad in cart.items():
        try:
            p_id = int(p_id_str)
            if p_id in PRODUCTOS:
                producto = PRODUCTOS[p_id].copy()
                producto['cantidad'] = cantidad
                producto['total_producto'] = round(producto['precio'] * cantidad, 2)
                subtotal += producto['total_producto']
                items_carrito.append(producto)
        except ValueError:
            continue
            
    itbms = round(subtotal * 0.07, 2) # Impuesto de 7% (opcional, simulación)
    envio = 4.99 if subtotal > 0 else 0.0
    # Envío gratis si supera los 100 dólares
    if subtotal > 100:
        envio = 0.0
        
    total = round(subtotal + itbms + envio, 2)
    
    return render_template(
        'carrito.html', 
        items=items_carrito, 
        subtotal=round(subtotal, 2),
        itbms=itbms,
        envio=envio,
        total=total
    )

# Ruta para agregar producto al carrito
@app.route('/agregar/<int:producto_id>')
def agregar_al_carrito(producto_id):
    if producto_id not in PRODUCTOS:
        flash('Producto no encontrado.', 'danger')
        return redirect(url_for('productos'))
        
    cart = session.get('cart', {})
    prod_id_str = str(producto_id)
    
    if prod_id_str in cart:
        cart[prod_id_str] += 1
    else:
        cart[prod_id_str] = 1
        
    session['cart'] = cart
    session.modified = True
    
    flash(f'¡"{PRODUCTOS[producto_id]["nombre"]}" se ha agregado al carrito!', 'success')
    
    # Redirigir a la página previa o al carrito
    next_page = request.args.get('next')
    if next_page == 'carrito':
        return redirect(url_for('carrito'))
    return redirect(request.referrer or url_for('productos'))

# Actualizar cantidades desde el carrito
@app.route('/actualizar_carrito', methods=['POST'])
def actualizar_carrito():
    cart = session.get('cart', {})
    for p_id_str in list(cart.keys()):
        field_name = f'cantidad_{p_id_str}'
        if field_name in request.form:
            try:
                nueva_cantidad = int(request.form[field_name])
                if nueva_cantidad > 0:
                    cart[p_id_str] = nueva_cantidad
                else:
                    cart.pop(p_id_str, None)
            except ValueError:
                pass
                
    session['cart'] = cart
    session.modified = True
    flash('Carrito actualizado con éxito.', 'info')
    return redirect(url_for('carrito'))

# Ruta para eliminar un producto del carrito
@app.route('/eliminar/<int:producto_id>')
def eliminar_del_carrito(producto_id):
    cart = session.get('cart', {})
    prod_id_str = str(producto_id)
    
    if prod_id_str in cart:
        cart.pop(prod_id_str)
        session['cart'] = cart
        session.modified = True
        flash(f'Producto eliminado del carrito.', 'warning')
        
    return redirect(url_for('carrito'))

# Ruta para limpiar todo el carrito
@app.route('/limpiar_carrito')
def limpiar_carrito():
    session['cart'] = {}
    session.modified = True
    flash('El carrito ha sido vaciado.', 'info')
    return redirect(url_for('carrito'))

# Ruta para procesar la compra (Checkout simulado)
@app.route('/checkout', methods=['POST'])
def checkout():
    cart = session.get('cart', {})
    if not cart:
        flash('Tu carrito está vacío. Agrega productos antes de pagar.', 'danger')
        return redirect(url_for('productos'))
        
    # Aquí se simularía el pago y registro en DB
    session['cart'] = {}
    session.modified = True
    
    nombre_cliente = request.form.get('nombre', 'Cliente')
    flash(f'¡Gracias por tu compra, {nombre_cliente}! Tu pedido ha sido procesado con éxito y se encuentra en camino. Se envió un correo con los detalles.', 'success')
    return redirect(url_for('index'))

# Ruta de contacto
@app.route('/contacto', methods=['GET', 'POST'])
def contacto():
    if request.method == 'POST':
        nombre = request.form.get('nombre')
        correo = request.form.get('email')
        asunto = request.form.get('asunto')
        mensaje = request.form.get('mensaje')
        
        # Simulación de envío de formulario de contacto
        flash(f'¡Gracias por contactarnos, {nombre}! Hemos recibido tu mensaje sobre "{asunto}" y te responderemos a la brevedad a {correo}.', 'success')
        return redirect(url_for('contacto'))
        
    return render_template('contacto.html')

if __name__ == '__main__':
    # Ejecución del servidor Flask en el puerto 3000 si se corre localmente
    app.run(host='0.0.0.0', port=3000, debug=True)
