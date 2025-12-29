export interface HeaderTexts {
  languageLabel: string;
  whatsappLabel: string;
  pricesLabel: string;
  whatsappMessage: string;
}

export const HeaderConfig = Object.freeze({
  i18n: {
    languageLabel: 'header.languageLabel',
    whatsappLabel: 'header.whatsappLabel',
    pricesLabel: 'header.pricesLabel',
    whatsappMessage: 'header.whatsappMessage',
  },
  whatsapp: {
    phoneNumber: '+573183207294',
    messages: {
      es: '¡Hola! Vi un vuelo ideal en el buscador y necesito un certificado para viajar con mi mascota en cabina.',
      en: 'Hi! I found an ideal flight on the search tool and need a certificate to travel with my pet in the cabin.',
    },
  },
  defaults: {
    language: 'es',
    languageName: 'Español',
    languageFlag: '🇪🇸',
  },
  styles: {
    overlayPanelWidth: '280px',
    currencyPanelWidth: 'auto',
  },
});
