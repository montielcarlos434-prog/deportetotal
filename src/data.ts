export interface Product {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
  descripcion: string;
}

export const PRODUCTOS: Product[] = [
  {
    id: 1,
    nombre: 'Balón de Fútbol Profesional Star',
    precio: 29.99,
    categoria: 'Fútbol',
    imagen: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Balón de alta resistencia con diseño aerodinámico avanzado de 32 paneles. Ideal para partidos oficiales y entrenamientos profesionales en cualquier clima.'
  },
  {
    id: 2,
    nombre: 'Botas de Fútbol Elite FG',
    precio: 79.99,
    categoria: 'Fútbol',
    imagen: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Botas ultraligeras con suela de tacos cónicos para césped natural firme. Parte superior sintética con textura para un mejor control del balón.'
  },
  {
    id: 3,
    nombre: 'Balón de Baloncesto Grip-Max',
    precio: 34.99,
    categoria: 'Baloncesto',
    imagen: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Balón de cuero sintético premium con textura de guijarros profundos para un agarre excepcional en canchas interiores y exteriores.'
  },
  {
    id: 4,
    nombre: 'Zapatillas Baloncesto Dunk-Pro',
    precio: 95.00,
    categoria: 'Baloncesto',
    imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Zapatillas de cuello alto con amortiguación de aire y suela de tracción multidireccional que asegura estabilidad y protección del tobillo.'
  },
  {
    id: 5,
    nombre: 'Zapatillas Running Air-Sprint',
    precio: 89.99,
    categoria: 'Running',
    imagen: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Zapatillas ligeras y transpirables con suela de goma amortiguadora reactiva. Diseñadas para acumular kilómetros de running sobre asfalto sin fatiga.'
  },
  {
    id: 6,
    nombre: 'Reloj Deportivo GPS Tracker',
    precio: 120.00,
    categoria: 'Running',
    imagen: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Monitorea ritmo cardíaco, pasos, calorías y rutas mediante GPS incorporado. Resistencia al agua 5 ATM y batería de hasta 10 días de duración.'
  },
  {
    id: 7,
    nombre: 'Mancuernas Ajustables Flex (Par)',
    precio: 149.99,
    categoria: 'Gimnasio',
    imagen: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Reemplaza hasta 15 pares de pesas convencionales. Mecanismo de dial para ajustar fácilmente el peso desde 2.5 kg hasta 24 kg cada una.'
  },
  {
    id: 8,
    nombre: 'Bandas de Resistencia Elastic-Band',
    precio: 14.99,
    categoria: 'Gimnasio',
    imagen: 'https://images.unsplash.com/photo-1598262138525-40b904d9b43e?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Juego de 5 bandas elásticas con mosquetones, manijas y anclaje de puerta. Distintas resistencias para entrenar fuerza de cuerpo completo.'
  },
  {
    id: 9,
    nombre: 'Casco de Ciclismo Aero-Pro',
    precio: 59.99,
    categoria: 'Ciclismo',
    imagen: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Casco ultra liviano con 21 canales de ventilación aerodinámica y tecnología de seguridad de absorción de impactos EPS in-mold.'
  },
  {
    id: 10,
    nombre: 'Maillot Ciclismo Tech-Dry',
    precio: 39.99,
    categoria: 'Ciclismo',
    imagen: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Maillot deportivo de secado rápido con cremallera completa, bolsillos traseros amplios y parches reflectantes de seguridad nocturna.'
  }
];

export const CATEGORIAS = ['Fútbol', 'Baloncesto', 'Running', 'Gimnasio', 'Ciclismo'];
