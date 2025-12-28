# 📱 Integración de WhatsApp en Header

## Configuración

**Número:** `+573183207294`

**Mensajes por idioma:**
- **Español:** "¡Hola! Vi un vuelo ideal en el buscador y necesito un certificado para viajar con mi mascota en cabina."
- **Inglés:** "Hi! I found an ideal flight on the search tool and need a certificate to travel with my pet in the cabin."

## Implementación

```typescript
// header.component.ts
private readonly config: HeaderConfig = {
  whatsapp: {
    phoneNumber: '+573183207294',
    messages: {
      es: '¡Hola! Vi un vuelo ideal...',
      en: 'Hi! I found an ideal flight...'
    }
  }
};

public openWhatsApp(): void {
  const message = this.getWhatsAppMessage();
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${this.config.whatsapp.phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}

private getWhatsAppMessage(): string {
  const languageCode = this.currentLanguage as 'es' | 'en';
  return this.config.whatsapp.messages[languageCode] || this.config.whatsapp.messages.es;
}
```

## Características

✅ Multiidioma (detecta automáticamente español/inglés)
✅ Mensaje personalizado sobre certificados de mascotas
✅ Se abre en nueva pestaña
✅ URL encoding automático
✅ Fallback a español si idioma no soportado

## Mantenimiento

### Cambiar número
Editar `phoneNumber` en `header.component.ts`

### Cambiar mensajes
Editar `messages.es` y `messages.en` en `header.component.ts`

### Agregar idiomas
1. Agregar idioma al config: `pt: 'Mensagem em português'`
2. Actualizar tipo en `getWhatsAppMessage()`: `'es' | 'en' | 'pt'`
