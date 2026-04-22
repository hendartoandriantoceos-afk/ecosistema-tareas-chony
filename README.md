# 🧠 Dashboard de Tareas - Ecosistema Chony

Un dashboard de tareas moderno y interactivo para gestionar el ecosistema de tareas de Chony, diseñado con React y Vite.

## 🚀 Características

- ✨ **Interfaz moderna** con diseño gradient y animaciones suaves
- 📅 **Gestión por fechas** con calendario completo para seleccionar fechas específicas
- 📂 **Organización por categorías**:
  - 🏃 Salud / Bienestar
  - 📸 Instagram / Redes
  - 🎓 Academia Digital
  - 🤖 Clientes / IA
  - 💬 Email / WhatsApp
  - ✍️ Contenido
  - 💼 Admin / Finanzas

- 🎯 **Sistema de prioridades** (Urgente, Importante, Rutina)
- 📝 **Notas detalladas** para cada tarea
- 📌 **Tareas fijas** que se repiten cada semana
- 📊 **Barra de progreso** para visualizar el avance diario
- 🔍 **Filtros** por categoría y prioridad
- 👁️ **Vistas múltiples**:
  - Vista semanal
  - Vista diaria
  - Vista por categoría (todas las tareas de una categoría)
- 💾 **Persistencia local** con localStorage
- 📱 **Diseño responsivo** adaptado a diferentes tamaños de pantalla

## 🛠️ Tecnologías

- **React 18** - Biblioteca de JavaScript para construir interfaces de usuario
- **Vite 5** - Herramienta de construcción y desarrollo
- **Vanilla CSS** - Estilos personalizados con JavaScript objects

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd Ecosistema-tareas
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## 🎮 Uso

### Añadir una Tarea
1. Haz clic en el botón **"+ Nueva Tarea"**
2. Ingresa el título de la tarea
3. Selecciona la fecha usando el calendario
4. Elige la categoría correspondiente
5. Define la prioridad (Urgente, Importante, Rutina)
6. Añade notas adicionales si lo deseas
7. Marca como "Tarea fija" si se repite cada semana
8. Haz clic en "Añadir Tarea"

### Navegación
- **Vista Semanal**: Haz clic en cualquier día para ver las tareas de ese día
- **Vista Diaria**: Selecciona el día específico para ver sus tareas detalladas
- **Vista por Categoría**: Haz clic en los botones de categoría al final para ver todas las tareas de esa categoría

### Gestionar Tareas
- **Marcar como completada**: Haz clic en el checkbox
- **Eliminar tarea**: Haz clic en el botón ✕ (solo tareas no fijas)

### Navegación entre Semanas
- Usa los botones ‹ y › para moverte entre semanas
- El botón "Hoy" te lleva a la semana actual

## 📝 Estructura del Proyecto

```
Ecosistema-tareas/
├── dashboard-tareas-chony.jsx  # Componente principal del dashboard
├── index.html                   # Archivo HTML principal
├── main.jsx                    # Punto de entrada de React
├── vite.config.js              # Configuración de Vite
├── package.json                # Dependencias del proyecto
├── README.md                  # Este archivo
└── .gitignore                 # Archivos ignorados por Git
```

## 🎨 Personalización

El dashboard está configurado con un tema oscuro con gradientes violetas y rosas. Puedes personalizar los colores y estilos modificando las constantes en el archivo `dashboard-tareas-chony.jsx`:

```javascript
const CATEGORIES = [
  // Puedes agregar o modificar categorías aquí
];

const PRIORITIES = [
  // Puedes modificar las prioridades y sus colores aquí
];
```

## 🚀 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza la versión de producción

## 📄 Licencia

Este proyecto es de uso personal para la gestión del ecosistema de tareas de Chony.

---

**Desarrollado con 💜 para optimizar la gestión de tareas**
