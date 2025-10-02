// helpers/durationHelper.ts
export class DurationHelper {
  /**
   * Formatear duración en formato legible
   */
  static format(minutes: number): string {
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
   * Calcular duración entre dos fechas
   */
  static between(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  }

  /**
   * Obtener duración formateada entre dos fechas
   */
  static formatBetween(start: Date, end: Date): string {
    const minutes = this.between(start, end);
    return this.format(minutes);
  }

  /**
   * Convertir horas a minutos
   */
  static hoursToMinutes(hours: number): number {
    return hours * 60;
  }

  /**
   * Convertir minutos a horas
   */
  static minutesToHours(minutes: number): number {
    return Math.floor(minutes / 60);
  }

  /**
   * Verificar si la duración es válida (mayor a 0)
   */
  static isValid(minutes: number): boolean {
    return minutes > 0;
  }
}
