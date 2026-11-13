import { useState, useMemo, FormEvent, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Search, 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  ArrowRight, 
  CreditCard, 
  CheckCircle, 
  RotateCcw, 
  Menu, 
  X, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Trophy,
  Activity,
  Check
} from 'lucide-react';
import { PRODUCTOS, CATEGORIAS, Product } from './data';

// Estructura de ítem en el carrito
interface CartItem {
  product: Product;
  quantity: number;
}

export default function App() {
  // Estado de navegación
  const [currentView, setCurrentView] = useState<'inicio' | 'productos' | 'carrito' | 'contacto'>('inicio');
  
  // Estado de filtros para el catálogo
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Estado del carrito de compras
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Estado del menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Estado de notificaciones (alertas flotantes)
  const [notifications, setNotifications] = useState<{ id: number; message: string; type: 'success' | 'info' | 'warning' }[]>([]);

  // Estados para los formularios
  const [billingForm, setBillingForm] = useState({
    nombre: '',
    email: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    paymentMethod: 'card'
  });
  
  const [contactForm, setContactForm] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  // Función para agregar notificaciones
  const addNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // Funciones del Carrito
  const addToCart = (product: Product, event?: MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
    addNotification(`¡"${product.nombre}" añadido al carrito!`, 'success');
  };

  const updateQuantity = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQty } 
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    addNotification('Producto eliminado del carrito.', 'warning');
  };

  const clearCart = () => {
    setCart([]);
    addNotification('El carrito ha sido vaciado.', 'info');
  };

  // Cálculos de totales del carrito
  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.precio * item.quantity), 0);
    const tax = subtotal * 0.07; // 7% impuesto
    const shipping = subtotal > 100 || subtotal === 0 ? 0 : 4.99;
    const total = subtotal + tax + shipping;
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      total: Number(total.toFixed(2)),
      totalCount
    };
  }, [cart]);

  // Filtrado de productos para el catálogo
  const filteredProducts = useMemo(() => {
    return PRODUCTOS.filter(p => {
      const matchesCategory = !selectedCategory || p.categoria.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = !searchQuery || 
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Productos destacados en la página de inicio
  const featuredProducts = useMemo(() => {
    // 4 productos de diferentes categorías
    return [PRODUCTOS[0], PRODUCTOS[3], PRODUCTOS[4], PRODUCTOS[6]];
  }, []);

  // Manejar el checkout simulado
  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      addNotification('Tu carrito está vacío.', 'warning');
      return;
    }
    addNotification(`¡Gracias por tu compra, ${billingForm.nombre}! Tu pedido está en camino.`, 'success');
    setCart([]);
    setBillingForm({
      nombre: '',
      email: '',
      direccion: '',
      ciudad: '',
      codigoPostal: '',
      paymentMethod: 'card'
    });
    setCurrentView('inicio');
  };

  // Manejar formulario de contacto
  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    addNotification(`¡Mensaje enviado con éxito, ${contactForm.nombre}! Te responderemos pronto.`, 'success');
    setContactForm({
      nombre: '',
      email: '',
      asunto: '',
      mensaje: ''
    });
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentView('productos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#121214] text-[#f8f9fa] font-sans selection:bg-[#39ff14] selection:text-black">
      
      {/* Contenedor de Alertas Flotantes (Toasts) */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`p-4 rounded-lg shadow-xl border-l-4 pointer-events-auto flex items-start gap-3 bg-[#1a1a1e] text-white ${
                n.type === 'success' ? 'border-[#39ff14]' :
                n.type === 'warning' ? 'border-yellow-500' : 'border-[#00b4d8]'
              }`}
            >
              <div className="mt-0.5">
                {n.type === 'success' && <CheckCircle className="w-5 h-5 text-[#39ff14]" />}
                {n.type === 'warning' && <Activity className="w-5 h-5 text-yellow-500" />}
                {n.type === 'info' && <Flame className="w-5 h-5 text-[#00b4d8]" />}
              </div>
              <p className="text-sm font-medium">{n.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Menú de Navegación */}
      <nav className="sticky top-0 z-40 bg-[#121214]/95 backdrop-blur-md border-b border-white/5 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <button 
            onClick={() => { setCurrentView('inicio'); setSelectedCategory(''); setSearchQuery(''); }}
            className="flex items-center gap-2 text-left cursor-pointer group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#39ff14] flex items-center justify-center bg-black/40 overflow-hidden transition-transform group-hover:scale-105">
              <span className="text-[#39ff14] font-extrabold text-xl font-mono">DT</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white uppercase">
              DEPORTE<span className="text-[#39ff14] group-hover:text-[#39ff14]/80 transition-colors">TOTAL</span>
            </span>
          </button>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => { setCurrentView('inicio'); }}
              className={`text-sm font-semibold tracking-wider uppercase transition-colors hover:text-[#39ff14] focus:outline-none ${
                currentView === 'inicio' ? 'text-[#39ff14]' : 'text-white'
              }`}
            >
              Inicio
            </button>
            <button 
              onClick={() => { setCurrentView('productos'); }}
              className={`text-sm font-semibold tracking-wider uppercase transition-colors hover:text-[#39ff14] focus:outline-none ${
                currentView === 'productos' ? 'text-[#39ff14]' : 'text-white'
              }`}
            >
              Productos
            </button>
            <button 
              onClick={() => { setCurrentView('contacto'); }}
              className={`text-sm font-semibold tracking-wider uppercase transition-colors hover:text-[#39ff14] focus:outline-none ${
                currentView === 'contacto' ? 'text-[#39ff14]' : 'text-white'
              }`}
            >
              Contacto
            </button>
          </div>

          {/* Buscador Rápido y Carrito Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative bg-[#1a1a1e] border border-white/10 rounded-full py-1.5 pl-4 pr-2 flex items-center max-w-xs transition-all focus-within:border-[#00b4d8] focus-within:shadow-[0_0_10px_rgba(0,180,216,0.15)]">
              <input 
                type="text" 
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'productos') {
                    setCurrentView('productos');
                  }
                }}
                className="bg-transparent border-none text-white text-sm focus:outline-none w-44"
              />
              <button className="bg-[#00b4d8] hover:bg-[#00b4d8]/80 text-black rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={() => setCurrentView('carrito')}
              className="relative bg-[#39ff14] hover:bg-[#39ff14]/90 text-black font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_15px_rgba(57,255,20,0.15)] focus:outline-none"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wider font-extrabold">Carrito</span>
              {cartTotals.totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-black rounded-full w-5 h-5 flex items-center justify-center border border-black animate-pulse">
                  {cartTotals.totalCount}
                </span>
              )}
            </button>
          </div>

          {/* Hamburguesa Móvil */}
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setCurrentView('carrito')}
              className="relative p-2 text-white bg-[#1a1a1e] rounded-lg border border-white/10 focus:outline-none"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartTotals.totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#39ff14] text-black text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {cartTotals.totalCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white bg-[#1a1a1e] rounded-lg border border-white/10 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Menú Móvil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#121214] border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col gap-4">
              <button 
                onClick={() => { setCurrentView('inicio'); setIsMobileMenuOpen(false); }}
                className={`text-left text-lg font-semibold tracking-wider uppercase py-2 border-b border-white/5 ${
                  currentView === 'inicio' ? 'text-[#39ff14]' : 'text-white'
                }`}
              >
                Inicio
              </button>
              <button 
                onClick={() => { setCurrentView('productos'); setIsMobileMenuOpen(false); }}
                className={`text-left text-lg font-semibold tracking-wider uppercase py-2 border-b border-white/5 ${
                  currentView === 'productos' ? 'text-[#39ff14]' : 'text-white'
                }`}
              >
                Productos
              </button>
              <button 
                onClick={() => { setCurrentView('contacto'); setIsMobileMenuOpen(false); }}
                className={`text-left text-lg font-semibold tracking-wider uppercase py-2 border-b border-white/5 ${
                  currentView === 'contacto' ? 'text-[#39ff14]' : 'text-white'
                }`}
              >
                Contacto
              </button>
              
              {/* Buscador móvil */}
              <div className="relative mt-2 bg-[#1a1a1e] border border-white/10 rounded-full py-2 pl-4 pr-2 flex items-center w-full">
                <input 
                  type="text" 
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentView !== 'productos') {
                      setCurrentView('productos');
                    }
                  }}
                  className="bg-transparent border-none text-white text-sm focus:outline-none w-full"
                />
                <button className="bg-[#00b4d8] text-black rounded-full w-8 h-8 flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido Dinámico con Transición */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentView}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          
          {/* VISTA: INICIO */}
          {currentView === 'inicio' && (
            <div className="flex flex-col gap-16">
              
              {/* Hero Banner */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-black via-black/80 to-transparent min-h-[480px] flex items-center px-6 sm:px-12 border-b-4 border-[#00b4d8] shadow-2xl">
                {/* Imagen de fondo con blur suave */}
                <div 
                  className="absolute inset-0 bg-cover bg-center -z-10 opacity-40 scale-105"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1920')` }}
                />
                <div className="max-w-xl flex flex-col gap-6">
                  <span className="inline-block bg-[#39ff14] text-black text-xs font-black uppercase px-3 py-1.5 rounded-md tracking-widest w-fit">
                    Temporada de Rendimiento 2026
                  </span>
                  <h1 className="text-4xl sm:text-6xl font-extrabold uppercase leading-none tracking-tight text-white">
                    Siente el Poder, <br />
                    <span className="bg-gradient-to-r from-[#00b4d8] to-[#39ff14] bg-clip-text text-transparent">Domina el Juego</span>
                  </h1>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    Explora nuestra colección premium de equipamiento deportivo para atletas que buscan superar sus propios límites. Calidad, resistencia y aerodinámica en un solo lugar.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <button 
                      onClick={() => { setCurrentView('productos'); setSelectedCategory(''); }}
                      className="bg-[#39ff14] hover:bg-[#39ff14]/90 text-black font-extrabold px-6 py-3.5 rounded-xl uppercase tracking-wider text-sm flex items-center gap-2 shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      <Flame className="w-4 h-4" /> Comprar Ahora
                    </button>
                    <a 
                      href="#categories"
                      className="border-2 border-white hover:bg-white hover:text-black font-extrabold px-6 py-3.5 rounded-xl uppercase tracking-wider text-sm transition-all"
                    >
                      Categorías
                    </a>
                  </div>
                </div>
              </div>

              {/* Categorías Deportivas */}
              <div id="categories" className="flex flex-col gap-6 scroll-mt-24">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold uppercase bg-gradient-to-r from-[#00b4d8] to-[#39ff14] bg-clip-text text-transparent inline-block">
                    Explora por Categorías
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Encuentra los artículos específicos para tu pasión deportiva</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {[
                    { name: 'Fútbol', icon: '⚽', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400' },
                    { name: 'Baloncesto', icon: '🏀', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400' },
                    { name: 'Running', icon: '🏃', img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=400' },
                    { name: 'Gimnasio', icon: '🏋️', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400' },
                    { name: 'Ciclismo', icon: '🚴', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=400' }
                  ].map(cat => (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="group relative h-48 rounded-2xl overflow-hidden border border-white/5 flex items-end p-5 text-left cursor-pointer transition-all hover:translate-y-[-6px] hover:border-[#39ff14] hover:shadow-[0_10px_20px_rgba(57,255,20,0.12)]"
                    >
                      <div 
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500 -z-10"
                        style={{ backgroundImage: `url('${cat.img}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent -z-10 group-hover:from-[#00b4d8]/80 group-hover:via-black/50 transition-all duration-300" />
                      <div className="absolute top-4 right-4 text-2xl filter drop-shadow">{cat.icon}</div>
                      <h3 className="text-xl font-extrabold uppercase text-white group-hover:text-white transition-colors">
                        {cat.name}
                      </h3>
                    </button>
                  ))}
                </div>
              </div>

              {/* Productos Destacados */}
              <div className="flex flex-col gap-8">
                <div className="flex items-end justify-between border-b border-white/5 pb-4">
                  <div>
                    <h2 className="text-3xl font-extrabold uppercase bg-gradient-to-r from-[#00b4d8] to-[#39ff14] bg-clip-text text-transparent inline-block">
                      Productos Destacados
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Nuestra recomendación de alto rendimiento</p>
                  </div>
                  <button 
                    onClick={() => { setCurrentView('productos'); setSelectedCategory(''); }}
                    className="hidden sm:flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                  >
                    Ver todo <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map(product => (
                    <div 
                      key={product.id}
                      onClick={() => { setCurrentView('productos'); setSearchQuery(product.nombre); }}
                      className="bg-[#1a1a1e] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full group hover:translate-y-[-6px] hover:border-[#00b4d8] hover:shadow-[0_12px_25px_rgba(0,180,216,0.12)] transition-all cursor-pointer"
                    >
                      <div className="relative pt-[100%] overflow-hidden bg-neutral-900">
                        <span className="absolute top-4 left-4 z-10 bg-[#00b4d8] text-black text-[10px] font-black uppercase px-2 py-1 rounded">
                          {product.categoria}
                        </span>
                        <img 
                          src={product.imagen} 
                          alt={product.nombre}
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <span className="text-[10px] font-bold text-[#39ff14] tracking-widest uppercase font-mono mb-1">
                          {product.categoria}
                        </span>
                        <h4 className="text-lg font-bold text-white mb-2 leading-snug tracking-tight">
                          {product.nombre}
                        </h4>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed flex-grow">
                          {product.descripcion}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                          <span className="text-xl font-bold font-mono text-white">
                            ${product.precio.toFixed(2)}
                          </span>
                          <button
                            onClick={(e) => addToCart(product, e)}
                            className="bg-[#00b4d8] hover:bg-[#00b4d8]/90 text-black font-black px-4 py-2 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" /> Añadir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter Promo Card */}
              <div className="bg-gradient-to-r from-[#00b4d8]/10 via-[#39ff14]/5 to-transparent border border-white/5 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                <div className="max-w-xl text-center md:text-left flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-[#39ff14] uppercase tracking-wider">¿Eres un atleta regular?</h3>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">¡Únete a nuestro Club de Descuentos Elite!</h2>
                  <p className="text-sm text-gray-400">
                    Regístrate en nuestro newsletter para obtener un 15% de descuento en tu primera compra, acceso prioritario a nuevos lanzamientos y ofertas exclusivas de fin de semana.
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentView('contacto')}
                  className="bg-[#39ff14] hover:bg-[#39ff14]/90 text-black font-black px-8 py-4 rounded-xl text-sm uppercase tracking-wider whitespace-nowrap shadow-lg flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  <Trophy className="w-4 h-4" /> Registrarme ahora
                </button>
              </div>

            </div>
          )}

          {/* VISTA: PRODUCTOS (CATÁLOGO) */}
          {currentView === 'productos' && (
            <div className="flex flex-col gap-8">
              
              {/* Encabezado del catálogo */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold uppercase bg-gradient-to-r from-[#00b4d8] to-[#39ff14] bg-clip-text text-transparent">
                    Catálogo de Productos
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {selectedCategory ? `Mostrando la categoría: ${selectedCategory}` : 'Explora nuestra amplia variedad de artículos deportivos premium'}
                  </p>
                </div>

                {/* Formulario de búsqueda en página */}
                <div className="relative bg-[#1a1a1e] border border-white/10 rounded-full py-2 pl-5 pr-2 flex items-center w-full md:max-w-md">
                  <input 
                    type="text" 
                    placeholder="Buscar por nombre, descripción..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none text-white text-sm focus:outline-none w-full"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-gray-400 hover:text-white mr-2 focus:outline-none"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button className="bg-[#00b4d8] text-black rounded-full w-9 h-9 flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filtros de Categorías (Pills) */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono">
                  Filtrar por deporte:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                      !selectedCategory 
                        ? 'bg-[#39ff14] text-black border-[#39ff14] font-black shadow-[0_0_10px_rgba(57,255,20,0.25)]' 
                        : 'bg-white/5 text-white border-white/5 hover:bg-white/10'
                    }`}
                  >
                    Todos los deportes
                  </button>
                  {CATEGORIAS.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                        selectedCategory.toLowerCase() === cat.toLowerCase()
                          ? 'bg-[#39ff14] text-black border-[#39ff14] font-black shadow-[0_0_10px_rgba(57,255,20,0.25)]' 
                          : 'bg-white/5 text-white border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rejilla de productos */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <div 
                      key={product.id}
                      className="bg-[#1a1a1e] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full group hover:translate-y-[-6px] hover:border-[#00b4d8] hover:shadow-[0_12px_25px_rgba(0,180,216,0.12)] transition-all"
                    >
                      <div className="relative pt-[100%] overflow-hidden bg-neutral-900">
                        <span className="absolute top-4 left-4 z-10 bg-[#00b4d8] text-black text-[10px] font-black uppercase px-2 py-1 rounded">
                          {product.categoria}
                        </span>
                        <img 
                          src={product.imagen} 
                          alt={product.nombre}
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <span className="text-[10px] font-bold text-[#39ff14] tracking-widest uppercase font-mono mb-1">
                          {product.categoria}
                        </span>
                        <h4 className="text-base font-bold text-white mb-2 leading-snug">
                          {product.nombre}
                        </h4>
                        <p className="text-xs text-gray-400 mb-5 leading-relaxed flex-grow">
                          {product.descripcion}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                          <span className="text-lg font-bold font-mono text-white">
                            ${product.precio.toFixed(2)}
                          </span>
                          <button
                            onClick={() => addToCart(product)}
                            className="bg-[#00b4d8] hover:bg-[#00b4d8]/90 text-black font-black px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" /> Añadir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-[#1a1a1e] rounded-3xl border border-white/5 flex flex-col items-center gap-4">
                  <Activity className="w-16 h-16 text-gray-500 animate-pulse" />
                  <h3 className="text-xl font-bold text-white uppercase">No se encontraron productos</h3>
                  <p className="text-gray-400 text-sm max-w-sm">No hay artículos que coincidan con tu búsqueda. Intenta limpiando los filtros o buscando otro término.</p>
                  <button 
                    onClick={() => { setSelectedCategory(''); setSearchQuery(''); }}
                    className="bg-[#39ff14] hover:bg-[#39ff14]/90 text-black font-black px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all mt-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Mostrar todos
                  </button>
                </div>
              )}

            </div>
          )}

          {/* VISTA: CARRITO DE COMPRAS */}
          {currentView === 'carrito' && (
            <div className="flex flex-col gap-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold uppercase bg-gradient-to-r from-[#00b4d8] to-[#39ff14] bg-clip-text text-transparent border-b border-white/5 pb-4">
                Mi Carrito de Compras
              </h1>

              {cart.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Tabla de Artículos */}
                  <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="bg-[#1a1a1e] border border-white/5 rounded-2xl p-4 sm:p-6 shadow-lg">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[500px]">
                          <thead>
                            <tr className="border-b border-white/10 text-gray-500 text-[10px] font-black uppercase tracking-widest font-mono pb-4">
                              <th className="pb-3" style={{ width: '10%' }}>Producto</th>
                              <th className="pb-3" style={{ width: '45%' }}>Detalle</th>
                              <th className="pb-3" style={{ width: '15%' }}>Precio</th>
                              <th className="pb-3" style={{ width: '15%' }}>Cantidad</th>
                              <th className="pb-3" style={{ width: '15%' }}>Total</th>
                              <th className="pb-3" style={{ width: '5%' }}></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {cart.map(item => (
                              <tr key={item.product.id} className="text-sm">
                                <td className="py-4">
                                  <img 
                                    src={item.product.imagen} 
                                    alt={item.product.nombre}
                                    referrerPolicy="no-referrer"
                                    className="w-12 h-12 rounded-lg object-cover bg-neutral-900"
                                  />
                                </td>
                                <td className="py-4 pr-4">
                                  <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase font-mono block mb-0.5">
                                    {item.product.categoria}
                                  </span>
                                  <h4 className="font-bold text-white leading-snug">
                                    {item.product.nombre}
                                  </h4>
                                </td>
                                <td className="py-4 font-mono text-white">
                                  ${item.product.precio.toFixed(2)}
                                </td>
                                <td className="py-4">
                                  <div className="flex items-center gap-2 border border-white/10 rounded-lg p-1 bg-black/40 w-fit">
                                    <button 
                                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                      className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-6 text-center font-bold font-mono text-sm">
                                      {item.quantity}
                                    </span>
                                    <button 
                                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                      className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                                <td className="py-4 font-mono font-bold text-[#39ff14]">
                                  ${(item.product.precio * item.quantity).toFixed(2)}
                                </td>
                                <td className="py-4 text-right">
                                  <button 
                                    onClick={() => removeFromCart(item.product.id)}
                                    className="text-gray-400 hover:text-red-500 p-1.5 transition-colors"
                                  >
                                    <Trash2 className="w-4.5 h-4.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t border-white/10 mt-4">
                        <button 
                          onClick={() => setCurrentView('productos')}
                          className="border border-white/20 hover:bg-white hover:text-black font-bold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                        >
                          <ArrowRight className="w-4 h-4 rotate-180" /> Continuar comprando
                        </button>
                        <button 
                          onClick={clearCart}
                          className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white font-bold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Vaciar carrito
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Resumen & Pago */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Tarjeta de Resumen */}
                    <div className="bg-[#1a1a1e] border border-white/5 rounded-2xl p-6 shadow-lg">
                      <h3 className="text-lg font-extrabold uppercase border-b border-white/10 pb-3 mb-4 text-white">
                        Resumen de compra
                      </h3>
                      <div className="flex flex-col gap-3 font-mono text-sm text-gray-400">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="text-white">${cartTotals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Impuestos (7% ITBMS)</span>
                          <span className="text-white">${cartTotals.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Envío</span>
                          <span>
                            {cartTotals.shipping === 0 ? (
                              <span className="text-[#39ff14] font-bold uppercase">Gratis</span>
                            ) : (
                              `$${cartTotals.shipping.toFixed(2)}`
                            )}
                          </span>
                        </div>
                        
                        {cartTotals.subtotal < 100 && (
                          <div className="p-3 bg-[#00b4d8]/10 text-[#00b4d8] rounded-xl text-[11px] font-sans font-semibold mt-2 border border-[#00b4d8]/20">
                            ¡Agrega ${(100 - cartTotals.subtotal).toFixed(2)} más para obtener envío gratis!
                          </div>
                        )}

                        <div className="flex justify-between text-base font-extrabold border-t border-white/10 pt-4 mt-2 text-white">
                          <span className="font-sans">Total</span>
                          <span className="text-[#39ff14]">${cartTotals.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Formulario de Pago */}
                    <div className="bg-[#1a1a1e] border border-white/5 rounded-2xl p-6 shadow-lg">
                      <h3 className="text-lg font-extrabold uppercase border-b border-white/10 pb-3 mb-4 text-white">
                        Datos de entrega
                      </h3>
                      <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5 font-mono">
                            Nombre Completo
                          </label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ej. Juan Pérez"
                            value={billingForm.nombre}
                            onChange={(e) => setBillingForm({ ...billingForm, nombre: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#00b4d8]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5 font-mono">
                            Correo Electrónico
                          </label>
                          <input 
                            type="email" 
                            required
                            placeholder="Ej. juan@correo.com"
                            value={billingForm.email}
                            onChange={(e) => setBillingForm({ ...billingForm, email: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#00b4d8]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5 font-mono">
                            Dirección de Envío
                          </label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ej. Calle Mayor 45, dpto 3B"
                            value={billingForm.direccion}
                            onChange={(e) => setBillingForm({ ...billingForm, direccion: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#00b4d8]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5 font-mono">
                              Ciudad
                            </label>
                            <input 
                              type="text" 
                              required
                              placeholder="Madrid"
                              value={billingForm.ciudad}
                              onChange={(e) => setBillingForm({ ...billingForm, ciudad: e.target.value })}
                              className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#00b4d8]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5 font-mono">
                              Código Postal
                            </label>
                            <input 
                              type="text" 
                              required
                              placeholder="28001"
                              value={billingForm.codigoPostal}
                              onChange={(e) => setBillingForm({ ...billingForm, codigoPostal: e.target.value })}
                              className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#00b4d8]"
                            />
                          </div>
                        </div>

                        {/* Método de pago */}
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2.5 font-mono">
                            Método de Pago
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <label className={`border rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer text-center select-none transition-all ${
                              billingForm.paymentMethod === 'card' 
                                ? 'border-[#39ff14] bg-[#39ff14]/5 text-white font-bold' 
                                : 'border-white/10 bg-black/20 text-gray-400 hover:bg-black/40'
                            }`}>
                              <input 
                                type="radio" 
                                name="payment" 
                                checked={billingForm.paymentMethod === 'card'}
                                onChange={() => setBillingForm({ ...billingForm, paymentMethod: 'card' })}
                                className="sr-only" 
                              />
                              <CreditCard className="w-5 h-5 text-[#00b4d8]" />
                              <span className="text-[10px] uppercase font-mono font-bold">Tarjeta</span>
                            </label>
                            <label className={`border rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer text-center select-none transition-all ${
                              billingForm.paymentMethod === 'paypal' 
                                ? 'border-[#39ff14] bg-[#39ff14]/5 text-white font-bold' 
                                : 'border-white/10 bg-black/20 text-gray-400 hover:bg-black/40'
                            }`}>
                              <input 
                                type="radio" 
                                name="payment" 
                                checked={billingForm.paymentMethod === 'paypal'}
                                onChange={() => setBillingForm({ ...billingForm, paymentMethod: 'paypal' })}
                                className="sr-only" 
                              />
                              <span className="text-[#00b4d8] font-bold text-base font-mono italic">P</span>
                              <span className="text-[10px] uppercase font-mono font-bold">PayPal</span>
                            </label>
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="bg-[#39ff14] hover:bg-[#39ff14]/90 text-black font-extrabold px-6 py-4 rounded-xl text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 mt-4 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> Realizar pedido seguro
                        </button>
                      </form>
                    </div>

                  </div>

                </div>
              ) : (
                <div className="text-center py-16 bg-[#1a1a1e] rounded-3xl border border-white/5 flex flex-col items-center gap-5">
                  <ShoppingCart className="w-20 h-20 text-[#39ff14]/40 animate-pulse" />
                  <h2 className="text-2xl font-extrabold uppercase text-white">Tu carrito está vacío</h2>
                  <p className="text-gray-400 text-sm max-w-sm">Parece que no has añadido ningún producto deportivo a tu carrito todavía. Explora nuestro catálogo y empieza a equipar tu juego.</p>
                  <button 
                    onClick={() => setCurrentView('productos')}
                    className="bg-[#39ff14] hover:bg-[#39ff14]/90 text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all mt-2"
                  >
                    Ir a la tienda deportiva
                  </button>
                </div>
              )}

            </div>
          )}

          {/* VISTA: CONTACTO */}
          {currentView === 'contacto' && (
            <div className="flex flex-col gap-10">
              
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold uppercase bg-gradient-to-r from-[#00b4d8] to-[#39ff14] bg-clip-text text-transparent inline-block">
                  Contáctanos
                </h1>
                <p className="text-gray-500 text-sm mt-1">¿Tienes alguna duda sobre tallas, envíos o patrocinios? Estamos aquí para ayudarte.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Formulario */}
                <div className="lg:col-span-7 bg-[#1a1a1e] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-lg">
                  <h3 className="text-xl font-extrabold uppercase border-b border-white/10 pb-3 mb-6 text-white">
                    Envíanos un mensaje
                  </h3>
                  <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5 font-mono">
                          Nombre Completo
                        </label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ej. Carlos Montiel"
                          value={contactForm.nombre}
                          onChange={(e) => setContactForm({ ...contactForm, nombre: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#00b4d8]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5 font-mono">
                          Correo Electrónico
                        </label>
                        <input 
                          type="email" 
                          required
                          placeholder="Ej. carlos@correo.com"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#00b4d8]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5 font-mono">
                        Asunto
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Consulta sobre tallas de botas"
                        value={contactForm.asunto}
                        onChange={(e) => setContactForm({ ...contactForm, asunto: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#00b4d8]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5 font-mono">
                        Mensaje o Comentarios
                      </label>
                      <textarea 
                        rows={6}
                        required
                        placeholder="Escribe aquí tu mensaje en detalle..."
                        value={contactForm.mensaje}
                        onChange={(e) => setContactForm({ ...contactForm, mensaje: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#00b4d8]"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="bg-[#39ff14] hover:bg-[#39ff14]/90 text-black font-extrabold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 mt-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                    >
                      <Mail className="w-4 h-4" /> Enviar Mensaje
                    </button>
                  </form>
                </div>

                {/* Info lateral y mapa */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  
                  {/* Detalles de contacto */}
                  <div className="bg-[#1a1a1e] border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col gap-5">
                    <h3 className="text-xl font-extrabold uppercase border-b border-white/10 pb-3 text-white">
                      Canales de Soporte
                    </h3>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#00b4d8] text-black flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">Sede Central</h4>
                        <p className="text-gray-400 text-xs mt-0.5">Avenida Olímpica 450, Piso 2, Ciudad de Deportes, España</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#00b4d8] text-black flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">Teléfonos de Atención</h4>
                        <p className="text-gray-400 text-xs mt-0.5">+34 912 345 678 / +34 912 345 679</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#00b4d8] text-black flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">Correos Electrónicos</h4>
                        <p className="text-gray-400 text-xs mt-0.5">soporte@deportetotal.com / ventas@deportetotal.com</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#00b4d8] text-black flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">Horario Comercial</h4>
                        <p className="text-gray-400 text-xs mt-0.5">Lunes a Sábado: 9:00 AM - 8:00 PM<br />Domingos: Cerrado por descanso deportivo</p>
                      </div>
                    </div>

                  </div>

                  {/* Mapa estilizado */}
                  <div className="h-[240px] rounded-2xl overflow-hidden border border-white/5 shadow-lg relative bg-neutral-900">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12148.431268482436!2d-3.6931584999999996!3d40.41725515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287d3a01129b%3A0x6b4efb1e3e7b165!2sParque%20del%20Retiro!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-4 start-4 bg-[#39ff14] text-black font-extrabold px-3 py-1.5 rounded text-xs flex items-center gap-1 shadow-md z-10">
                      <MapPin className="w-3.5 h-3.5" /> ¡Visítanos en tienda!
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </motion.main>
      </AnimatePresence>

      {/* Pie de Página */}
      <footer className="bg-black/60 border-t border-white/5 pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex flex-col gap-4">
            <h3 className="font-extrabold text-white text-base uppercase tracking-wider relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-[#39ff14]">
              DEPORTE TOTAL
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Somos tu aliado estratégico en el alto rendimiento. Equipamos tu pasión con la mejor tecnología en calzado, balones y accesorios deportivos de las mejores marcas.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#00b4d8] hover:text-black text-white flex items-center justify-center transition-all hover:-translate-y-1">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#00b4d8] hover:text-black text-white flex items-center justify-center transition-all hover:-translate-y-1">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#00b4d8] hover:text-black text-white flex items-center justify-center transition-all hover:-translate-y-1">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#00b4d8] hover:text-black text-white flex items-center justify-center transition-all hover:-translate-y-1">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-extrabold text-white text-base uppercase tracking-wider relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-[#39ff14]">
              Enlaces Rápidos
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li>
                <button onClick={() => setCurrentView('inicio')} className="hover:text-[#39ff14] hover:pl-1 transition-all text-left">
                  Inicio
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('productos'); setSelectedCategory(''); }} className="hover:text-[#39ff14] hover:pl-1 transition-all text-left">
                  Nuestros Productos
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('contacto')} className="hover:text-[#39ff14] hover:pl-1 transition-all text-left">
                  Contacto / Soporte
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('carrito')} className="hover:text-[#39ff14] hover:pl-1 transition-all text-left">
                  Mi Carrito ({cartTotals.totalCount})
                </button>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-extrabold text-white text-base uppercase tracking-wider relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-[#39ff14]">
              Deportes
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              {CATEGORIAS.map(cat => (
                <li key={cat}>
                  <button onClick={() => handleCategoryClick(cat)} className="hover:text-[#39ff14] hover:pl-1 transition-all text-left uppercase text-xs font-bold tracking-wider font-mono">
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-extrabold text-white text-base uppercase tracking-wider relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-[#39ff14]">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4.5 h-4.5 text-[#00b4d8] flex-shrink-0 mt-0.5" />
                <span>Av. Olimpica 450, Ciudad de Deportes</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4.5 h-4.5 text-[#00b4d8] flex-shrink-0" />
                <span>+34 912 345 678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4.5 h-4.5 text-[#00b4d8] flex-shrink-0" />
                <span>soporte@deportetotal.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-[#00b4d8] flex-shrink-0" />
                <span>Lun - Sáb: 9:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-6 text-center text-xs text-gray-500">
          <p>&copy; 2026 DeporteTotal S.A. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
