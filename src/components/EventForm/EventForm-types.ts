export interface IEventFormFields {
	event_date: Date
	event_name: string
	event_position: string
	event_background?: { file: File; fileList: FileList }
	event_time: string
	event_type: TEventTypeValue
	event_description: string
}

export type TEventTypeLabel = 'Portes ouvertes' | 'Présentation' | 'Conférence'
export type TEventTypeValue = 'portes_ouvertes' | 'presentation' | 'conference'

export const eventTypesRecord: Record<TEventTypeValue, TEventTypeLabel> = {
	portes_ouvertes: 'Portes ouvertes',
	presentation: 'Présentation',
	conference: 'Conférence',
}
