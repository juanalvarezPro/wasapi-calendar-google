// helpers/dateHelper.ts
export class DateHelper {
  /**
   * Crear fecha combinando date y time
   */
  static combineDateTime(date: string, time: string): Date {
    return new Date(`${date}T${time}:00`);
  }

  /**
   * Agregar minutos a una fecha
   */
  static addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + (minutes * 60 * 1000));
  }

  /**
   * Obtener fecha de inicio del día
   */
  static startOfDay(date: Date = new Date()): Date {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  /**
   * Obtener fecha de fin del día
   */
  static endOfDay(date: Date = new Date()): Date {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  /**
   * Agregar días a una fecha
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Verificar si una fecha es hoy
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  /**
   * Verificar si una fecha es mañana
   */
  static isTomorrow(date: Date): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  }
}
