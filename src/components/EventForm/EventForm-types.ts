export interface IEventFormFields {
	event_date: Date
	event_name: string
	event_position: string
	event_background?: { file: File; fileList: FileList }
	event_time: string
	event_type: EEventTypes
	event_description: string
}

export enum EEventTypes {
	'Portes ouvertes',
	'Présentation',
	'Conférence',
}
