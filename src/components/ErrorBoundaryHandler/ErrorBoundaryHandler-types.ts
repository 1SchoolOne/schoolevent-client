/* eslint @typescript-eslint/no-explicit-any: 0 */
export interface IErrorBoundaryHandlerProps {
	error: any
	resetErrorBoundary: (...args: any[]) => void
}
