export interface IEventFormFields {
	date: Date
	name: string
	position: string
	background?: { file: File; fileList: FileList[] }
	time: string
	eventType: EEventTypes
}

export enum EEventTypes {
	'Portes ouvertes',
	'Présentation',
	'Conférence',
}
