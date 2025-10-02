// resources/EventResource.ts
export class EventResource {
  /**
   * Formatear un evento individual para respuesta API
   */
  static format(event: any) {
    const startTime = new Date(event.start?.dateTime || event.start?.date || '');
    const endTime = new Date(event.end?.dateTime || event.end?.date || '');
    
    return {
      id: event.id,
      title: event.summary || "Sin título",
      description: event.description || null,
      start: startTime.toISOString(),
      end: endTime.toISOString(),
      date: this.formatDate(startTime),
      time: this.formatTime(startTime),
      duration: this.calculateDuration(startTime, endTime),
      minutes: this.getDurationMinutes(startTime, endTime),
      location: event.location || null,
      attendees: event.attendees?.length || 0,
      creator: event.creator?.email || null,
      htmlLink: event.htmlLink || null,
      status: event.status || 'confirmed'
    };
  }

  /**
   * Formatear múltiples eventos
   */
  static collection(events: any[]) {
    return events.map(event => this.format(event));
  }

  /**
   * Formatear para chatbot (versión simplificada)
   */
  static forChatbot(event: any) {
    const startTime = new Date(event.start?.dateTime || event.start?.date || '');
    const endTime = new Date(event.end?.dateTime || event.end?.date || '');
    
    return {
      title: event.summary || "Sin título",
      date: this.formatDate(startTime),
      time: this.formatTime(startTime),
      duration: this.calculateDuration(startTime, endTime),
      minutes: this.getDurationMinutes(startTime, endTime)
    };
  }

  /**
   * Formatear fecha legible
   */
  private static formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Formatear hora legible
   */
  private static formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  /**
   * Calcular duración en formato legible
   */
  private static calculateDuration(start: Date, end: Date): string {
    const minutes = this.getDurationMinutes(start, end);
    
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    } else {
      return `${minutes}m`;
    }
  }

  /**
   * Obtener duración en minutos
   */
  private static getDurationMinutes(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  }
}
