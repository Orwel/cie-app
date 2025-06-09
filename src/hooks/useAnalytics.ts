import { event } from '../lib/gtag';

export const useAnalytics = () => {
  // Trackear cuando alguien hace clic en una propiedad
  const trackPropertyView = (propertyId: string, propertyTitle: string) => {
    event('view_property', 'engagement', `property_${propertyId}`, 1);
  };

  // Trackear cuando alguien hace clic en WhatsApp
  const trackWhatsAppClick = () => {
    event('whatsapp_click', 'engagement', 'contact_button', 1);
  };

  // Trackear cuando alguien navega a una sección específica
  const trackSectionView = (section: string) => {
    event('section_view', 'navigation', section, 1);
  };

  // Trackear tiempo en página (cuando el usuario sale)
  const trackTimeOnPage = (seconds: number) => {
    event('time_on_page', 'engagement', 'page_duration', seconds);
  };

  // Trackear búsquedas o filtros
  const trackSearch = (searchTerm: string) => {
    event('search', 'engagement', searchTerm, 1);
  };

  return {
    trackPropertyView,
    trackWhatsAppClick,
    trackSectionView,
    trackTimeOnPage,
    trackSearch,
  };
}; 