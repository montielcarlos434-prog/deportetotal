# DeporteTotal - Tienda Deportiva de Alto Rendimiento

Proyecto completo de una tienda de comercio electrónico deportiva utilizando **Python** y **Flask** como backend, con un diseño moderno, dinámico y responsivo utilizando **Bootstrap 5** y **CSS3** con animaciones personalizadas.

## Estructura del Proyecto

```
tienda_deportiva/
│
├── app.py                  # Archivo principal de Python/Flask (Rutas, lógica de carrito, controladores)
├── requirements.txt        # Dependencias de Python necesarias para el proyecto
├── static/
│   ├── style.css           # Estilos personalizados (Esquema de color deportivo: negro, azul, verde)
│   └── logo.png            # Logotipo de la tienda deportiva
├── templates/
│   ├── base.html           # Estructura base común (Navegación, pie de página, alertas)
│   ├── index.html          # Página de inicio con banner de héroe y categorías destacadas
│   ├── productos.html      # Catálogo de productos con filtros de categoría y buscador integrado
│   ├── carrito.html        # Detalle de carrito de compras con cálculo de subtotales, impuestos y envío
│   └── contacto.html       # Formulario de contacto con soporte, direcciones y mapa de ubicación
└── README.md               # Este archivo de documentación con instrucciones de instalación
```

## Características Técnicas

1. **Estructura Modular HTML5 & CSS3**: Diseño moderno con tipografía *Outfit*, gradientes dinámicos y sombras con aura deportiva de color verde neón y azul eléctrico sobre fondo negro mate.
2. **Framework Bootstrap 5**: Utilizado para asegurar la total compatibilidad móvil (diseño responsivo) y rejillas fluidas.
3. **Backend con Flask**: Manejo robusto de peticiones HTTP, procesamiento dinámico de parámetros de búsqueda, filtrado de categorías e inyección de datos contextuales.
4. **Carrito de Compras Persistente en Sesiones**: Los productos se guardan, actualizan y eliminan utilizando la sesión encriptada nativa de Flask sin necesidad de bases de datos complejas para facilitar la portabilidad.
5. **Formulario de Contacto Activo**: El formulario procesa envíos usando métodos POST de Flask, mostrando mensajes de notificación instantáneos al usuario (Alertas Flash).
6. **Mapa Interactivo**: Integración directa de Google Maps estilizado en modo oscuro para complementar la información de contacto de las tiendas físicas.

---

## Instrucciones de Instalación y Ejecución

Para ejecutar este proyecto en tu entorno local, sigue los pasos detallados a continuación:

### Requisitos Previos

- Tener instalado **Python 3.8 o superior** en tu equipo. Puedes descargarlo de [python.org](https://www.python.org/).
- Disponer de un terminal de comandos (Bash, CMD, PowerShell).

### Paso 1: Clonar o descargar el proyecto

Si tienes el código en una carpeta llamada `tienda_deportiva/`, navega hasta ella a través de tu terminal:

```bash
cd tienda_deportiva
```

### Paso 2: Crear un Entorno Virtual (Recomendado)

Es una buena práctica crear un entorno virtual para aislar las dependencias del proyecto y evitar conflictos con otras librerías del sistema.

En **Linux / macOS**:
```bash
python3 -m venv venv
source venv/bin/activate
```

En **Windows**:
```bash
python -m venv venv
venv\Scripts\activate
```

### Paso 3: Instalar las Dependencias

Con el entorno virtual activado, instala todas las librerías necesarias ejecutando:

```bash
pip install -r requirements.txt
```

Esto instalará **Flask**, **Gunicorn** y **Werkzeug** de forma automática.

### Paso 4: Ejecutar la Aplicación

Inicia el servidor web local ejecutando el archivo `app.py`:

```bash
python app.py
```

Deberías ver un mensaje similar al siguiente en tu consola:
```text
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:3000
```

### Paso 5: Abrir en el Navegador

Abre tu navegador de preferencia e ingresa a la siguiente dirección para explorar la tienda de manera local:

```text
http://localhost:3000
```

---

## Créditos y Licencia

Este proyecto ha sido desarrollado como una plantilla premium de comercio electrónico para deportes de alto rendimiento.
Código libre para uso educativo o comercial. ¡Domina el juego!
