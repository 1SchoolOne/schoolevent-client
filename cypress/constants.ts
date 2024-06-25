import dayjs from 'dayjs'
import objectSupport from 'dayjs/plugin/objectSupport'

import { TEvent } from '@types'

dayjs.extend(objectSupport)

export const BASE_URL = 'http://localhost:5173'
export const LOGIN_URL = `${BASE_URL}/login`
export const CONTACTS_URL = `${BASE_URL}/contacts`
export const CALENDAR_URL = `${BASE_URL}/calendar`
export const APPOINTMENTS_URL = `${BASE_URL}/appointments`
export const EVENTS_URL = `${BASE_URL}/events`
export const REWARDS_URL = `${BASE_URL}/rewards`
export const STUDENTS_URL = `${BASE_URL}/students`
export const STATS_URL = `${BASE_URL}/statistics`

export const ADMIN_USER = {
	email: 'admin@esiee-it.fr',
	password: 'admin',
}

export const MANAGER_USER = {
	email: 'manager@esiee-it.fr',
	password: 'manager',
}

export const STUDENT_USER = {
	email: 'student@edu.esiee-it.fr',
	password: 'student',
}

export const DISABLED_USER = {
	email: 'disabled@esiee-it.fr',
	password: 'disabled',
}

export const SIDE_MENU_LABELS = {
	admin: {
		shouldHaveAccessTo: [
			'Accueil',
			'Contacts',
			'Calendrier',
			'Rendez-vous',
			'Événements',
			'Étudiants',
			'Récompenses',
			'Administration',
		],
	},
	manager: {
		shouldHaveAccessTo: [
			'Accueil',
			'Contacts',
			'Calendrier',
			'Rendez-vous',
			'Événements',
			'Étudiants',
			'Récompenses',
		],
		shouldNotHaveAccessTo: ['Administration'],
	},
	student: {
		shouldHaveAccessTo: ['Événements', 'Récompenses'],
		shouldNotHaveAccessTo: [
			'Accueil',
			'Contacts',
			'Calendrier',
			'Rendez-vous',
			'Étudiants',
			'Administration',
		],
	},
}

export const EVENT: TEvent = {
	id: 1,
	event_title: 'Mon événement',
	event_type: 'conference',
	event_date: dayjs({
		year: 2024,
		month: 6,
		day: 1,
		hour: 10,
		minutes: 0,
		seconds: 0,
	}).toISOString(),
	event_duration: 3600,
	event_creator_id: '1',
	event_address: '8 rue pierre de coubertin, 95300 Pontoise',
	event_school_name: 'ESIEE-IT',
	event_description: 'super description',
	event_background: null,
	event_assignee: null,
	event_points: 0,
}

export const EVENT_LIST: Array<TEvent> = [EVENT]
