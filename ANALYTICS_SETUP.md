# 📊 Configuración de Google Analytics

## ¿Qué se ha implementado?

✅ **Google Analytics 4 (GA4)** completamente integrado
✅ **Tracking automático** de páginas visitadas
✅ **Eventos personalizados** para interacciones específicas
✅ **Dashboard de desarrollo** para monitoreo en tiempo real
✅ **Hook personalizado** para trackear eventos fácilmente

## 🚀 Cómo configurar

### 1. Crear cuenta de Google Analytics

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una cuenta nueva
3. Configura una propiedad para tu sitio web
4. Obtén tu **Measurement ID** (formato: G-XXXXXXXXXX)

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Google Analytics
NEXT_PUBLIC_GA_ID=G-TU_ID_AQUI
```

**Importante:** Reemplaza `G-TU_ID_AQUI` con tu ID real de Google Analytics.

### 3. Desplegar el sitio

Después de configurar el ID, despliega tu sitio y comenzarás a ver datos en Google Analytics dentro de 24-48 horas.

## 📈 Métricas que se trackean

### Automáticas:
- **Visitantes únicos**
- **Sesiones totales**
- **Páginas vistas**
- **Tiempo en página**
- **Ubicación geográfica**
- **Dispositivos utilizados**
- **Fuentes de tráfico**

### Eventos personalizados:
- **Clics en WhatsApp** (`whatsapp_click`)
- **Visualización de propiedades** (`view_property`)
- **Navegación por secciones** (`section_view`)
- **Tiempo total en página** (`time_on_page`)

## 🛠️ Cómo agregar más eventos

Usa el hook `useAnalytics()` en cualquier componente:

```tsx
import { useAnalytics } from '../../hooks/useAnalytics';

const MiComponente = () => {
  const { trackPropertyView, trackWhatsAppClick } = useAnalytics();

  const handleClick = () => {
    trackPropertyView('property-1', 'Apartaestudio Chapinero');
  };

  return <button onClick={handleClick}>Ver propiedad</button>;
};
```

## 🔧 Dashboard de desarrollo

En modo desarrollo, verás un botón flotante 📊 en la esquina superior derecha que muestra métricas en tiempo real. Este dashboard:

- ✅ Solo aparece en desarrollo (`NODE_ENV !== 'production'`)
- ✅ Muestra métricas básicas en tiempo real
- ✅ Se actualiza automáticamente

## 📊 Acceder a tus métricas

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Selecciona tu propiedad
3. Explora los reportes:
   - **Tiempo real**: Visitantes actuales
   - **Audiencia**: Datos demográficos
   - **Adquisición**: Cómo llegan los usuarios
   - **Comportamiento**: Qué hacen en tu sitio
   - **Eventos**: Interacciones específicas

## 🔒 Privacidad

El sistema respeta la privacidad de los usuarios:
- ✅ No recopila información personal identificable
- ✅ Cumple con regulaciones de privacidad
- ✅ Los usuarios pueden deshabilitar el tracking en su navegador

## 📱 Métricas móviles

Google Analytics automáticamente detecta y separa:
- Tráfico de escritorio
- Tráfico móvil  
- Tráfico de tablets

## 🎯 Próximos pasos sugeridos

1. **Configurar alertas** para cambios significativos en el tráfico
2. **Crear audiencias personalizadas** para remarketing
3. **Conectar Google Search Console** para datos de SEO
4. **Configurar objetivos** para medir conversiones
5. **Implementar Google Tag Manager** para tracking más avanzado

¿Necesitas ayuda con alguna configuración específica? ¡Pregúntame! 