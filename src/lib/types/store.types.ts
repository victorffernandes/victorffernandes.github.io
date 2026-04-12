export type AsyncState<T> =
	| { status: 'idle' }
	| { status: 'loading' }
	| { status: 'success'; data: T }
	| { status: 'error'; error: string };

export function idle<T>(): AsyncState<T> {
	return { status: 'idle' };
}

export function loading<T>(): AsyncState<T> {
	return { status: 'loading' };
}

export function success<T>(data: T): AsyncState<T> {
	return { status: 'success', data };
}

export function error<T>(message: string): AsyncState<T> {
	return { status: 'error', error: message };
}
