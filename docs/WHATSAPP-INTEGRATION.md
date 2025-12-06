# 📱 Integración de WhatsApp en Header

## ✅ Implementación Completada

Se ha implementado la funcionalidad del botón de WhatsApp en el header con soporte multiidioma.

---

## 📞 Configuración

### Número de WhatsApp
```
+573183207294
```

### Mensajes por Idioma

**Español:**
```
¡Hola! Vi un vuelo ideal en el buscador y necesito un certificado para viajar con mi mascota en cabina.
```

**Inglés:**
```
Hi! I found an ideal flight on the search tool and need a certificate to travel with my pet in the cabin.
```

---

## 🔧 Implementación Técnica

### 1. Configuración en el Componente

**header.component.ts:**
```typescript
interface HeaderConfig {
  whatsapp: {
    phoneNumber: string;
    messages: {
      es: string;
      en: string;
    };
  };
}

private readonly config: HeaderConfig = {
  whatsapp: {
    phoneNumber: '+573183207294',
    messages: {
      es: '¡Hola! Vi un vuelo ideal en el buscador y necesito un certificado para viajar con mi mascota en cabina.',
      en: 'Hi! I found an ideal flight on the search tool and need a certificate to travel with my pet in the cabin.'
    }
  }
};
```

### 2. Método openWhatsApp()

```typescript
public openWhatsApp(): void {
  // Obtener el mensaje según el idioma actual
  const message = this.getWhatsAppMessage();
  
  // Codificar el mensaje para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Construir la URL de WhatsApp
  const whatsappUrl = `https://wa.me/${this.config.whatsapp.phoneNumber}?text=${encodedMessage}`;
  
  // Abrir en nueva pestaña
  window.open(whatsappUrl, '_blank');
}

private getWhatsAppMessage(): string {
  const languageCode = this.currentLanguage as 'es' | 'en';
  return this.config.whatsapp.messages[languageCode] || this.config.whatsapp.messages.es;
}
```

### 3. HTML del Botón

**header.component.html:**
```html
<button 
  class="nav-icon-btn" 
  type="button" 
  (click)="openWhatsApp()" 
  aria-label="WhatsApp"
>
  <i class="pi pi-whatsapp"></i>
</button>
```

---

## 🌍 Archivos i18n Actualizados

### es.json
```json
{
  "header": {
    "languageLabel": "Language",
    "whatsappLabel": "WhatsApp",
    "pricesLabel": "Prices",
    "whatsappMessage": "¡Hola! Vi un vuelo ideal en el buscador y necesito un certificado para viajar con mi mascota en cabina."
  }
}
```

### en.json
```json
{
  "header": {
    "languageLabel": "Language",
    "whatsappLabel": "WhatsApp",
    "pricesLabel": "Prices",
    "whatsappMessage": "Hi! I found an ideal flight on the search tool and need a certificate to travel with my pet in the cabin."
  }
}
```

---

## 🔄 Flujo de Funcionamiento

1. **Usuario hace clic en el botón de WhatsApp**
2. **Componente detecta el idioma actual** (`this.currentLanguage`)
3. **Obtiene el mensaje correspondiente** del config según el idioma
4. **Codifica el mensaje** para URL con `encodeURIComponent()`
5. **Construye la URL de WhatsApp** con el formato `wa.me/+573183207294?text=...`
6. **Abre WhatsApp** en una nueva pestaña con `window.open()`

---

## 📱 URLs Generadas

### Español
```
https://wa.me/+573183207294?text=%C2%A1Hola!%20Vi%20un%20vuelo%20ideal%20en%20el%20buscador%20y%20necesito%20un%20certificado%20para%20viajar%20con%20mi%20mascota%20en%20cabina.
```

### Inglés
```
https://wa.me/+573183207294?text=Hi!%20I%20found%20an%20ideal%20flight%20on%20the%20search%20tool%20and%20need%20a%20certificate%20to%20travel%20with%20my%20pet%20in%20the%20cabin.
```

---

## 🎯 Características

✅ **Multiidioma**: Detecta automáticamente el idioma actual (español/inglés)  
✅ **Mensaje personalizado**: Mensaje específico sobre certificados de mascotas  
✅ **Número correcto**: +573183207294  
✅ **Nueva pestaña**: Se abre en una nueva ventana/pestaña  
✅ **URL encoding**: Caracteres especiales correctamente codificados  
✅ **Fallback**: Si el idioma no está soportado, usa español por defecto  

---

## 🧪 Cómo Probar

### 1. Cambiar idioma a Español
- Hacer clic en el botón de idioma
- Seleccionar "Español"
- Hacer clic en el botón de WhatsApp
- Verificar que el mensaje esté en español

### 2. Cambiar idioma a Inglés
- Hacer clic en el botón de idioma
- Seleccionar "English"
- Hacer clic en el botón de WhatsApp
- Verificar que el mensaje esté en inglés

### 3. Verificar en Móvil
- Abrir la aplicación en un dispositivo móvil
- Hacer clic en el botón de WhatsApp
- Debe abrir la app de WhatsApp con el mensaje prellenado

### 4. Verificar en Desktop
- Abrir la aplicación en desktop
- Hacer clic en el botón de WhatsApp
- Debe abrir WhatsApp Web con el mensaje prellenado

---

## 🔧 Mantenimiento

### Cambiar el Número de WhatsApp
Editar en `header.component.ts`:
```typescript
private readonly config: HeaderConfig = {
  whatsapp: {
    phoneNumber: '+573183207294', // 👈 Cambiar aquí
    messages: { ... }
  }
};
```

### Cambiar los Mensajes
Editar en `header.component.ts`:
```typescript
messages: {
  es: 'Nuevo mensaje en español', // 👈 Cambiar aquí
  en: 'New message in English'    // 👈 Cambiar aquí
}
```

### Agregar Más Idiomas
1. Agregar el idioma al config:
```typescript
messages: {
  es: 'Mensaje en español',
  en: 'Message in English',
  pt: 'Mensagem em português' // 👈 Nuevo idioma
}
```

2. Actualizar el método `getWhatsAppMessage()`:
```typescript
private getWhatsAppMessage(): string {
  const languageCode = this.currentLanguage as 'es' | 'en' | 'pt';
  return this.config.whatsapp.messages[languageCode] || this.config.whatsapp.messages.es;
}
```

---

## 📝 Notas

- El mensaje se codifica automáticamente para URL
- Los caracteres especiales (¡, !) se manejan correctamente
- El idioma se detecta del servicio `I18nService`
- Si el usuario cambia de idioma, el mensaje también cambia
- Compatible con WhatsApp Web y WhatsApp móvil
