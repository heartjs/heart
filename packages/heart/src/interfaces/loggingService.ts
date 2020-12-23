export type TDebug = (message: string, context?: string) => Promise<void>
export type TInfo = (message: string, context?: string) => Promise<void>
export type TWarning = (message: string, context?: string) => Promise<void>
export type TError = (error: Error, context?: string) => Promise<void>

export interface ILoggingService {
  /**
   * @description should be called only in development environment
   */
  debug: TDebug
  info: TInfo
  warning: TWarning
  error: TError
}
