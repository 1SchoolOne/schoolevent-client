import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { createContext, useContext, useMemo } from 'react'

import { PropsWithChildren } from '@types'
import { useSupabase } from '@utils'

import {
	GOUV_API_URL,
	SELECTED_FIELDS,
} from '../../components/ContactsLayout/_components/ContactsTable/Table-constants'
import { IAppointmentFormContext, IAppointmentFormProviderProps } from './AppointmentForm-types'

dayjs.extend(utc)
dayjs.extend(timezone)

const AppointmentFormContext = createContext<IAppointmentFormContext>({} as IAppointmentFormContext)

export function AppointmentFormProvider(props: PropsWithChildren<IAppointmentFormProviderProps>) {
	const { status, schoolId, appointmentId, mode, children } = props

	const supabase = useSupabase()

	const {
		data: school,
		isLoading: isSchoolLoading,
		isSuccess: hasSchoolLoaded,
		error: schoolError,
	} = useQuery({
		queryKey: ['school', { schoolId }],
		queryFn: async () => {
			const response = await fetch(
				`${GOUV_API_URL}?timezone=Europe%2FParis&where=identifiant_de_l_etablissement="${schoolId}"&select=${SELECTED_FIELDS}`,
			)

			if (!response.ok) {
				throw new Error(`Failed to fetch school data. school_id=${schoolId}`)
			}

			return response.json()
		},
		enabled: mode === 'new' && schoolId !== undefined,
		staleTime: 1000 * 60 * 2,
	})

	const {
		data: appointment,
		isLoading: isAppointmentLoading,
		isSuccess: hasAppointmentLoaded,
		error: appointmentError,
	} = useQuery({
		queryKey: ['appointment', { appointmentId }],
		queryFn: async () => {
			if (!appointmentId) {
				throw new Error('appointmentId is required')
			}

			const { data, error } = await supabase
				.from('appointments')
				.select()
				.eq('id', appointmentId)
				.single()

			if (error) {
				throw error
			}

			return data
		},
		enabled: mode !== null && mode !== 'new',
		staleTime: 1000 * 60 * 2,
	})

	const initialValues = useMemo((): Partial<IAppointmentFormContext['initialValues']> => {
		const defaultValues: Partial<IAppointmentFormContext['initialValues']> = {
			apt_status: status ?? 'to_contact',
			contacted_date: status === 'contacted' ? dayjs().tz().toISOString() : undefined,
			planned_date: status === 'planned' ? dayjs().tz().toISOString() : undefined,
		}

		if (mode === 'new' && school?.results[0]) {
			const result = school.results[0]

			return {
				...defaultValues,
				school_name: result.nom_etablissement,
				school_address: result.adresse_1,
				school_postal_code: result.code_postal,
				school_city: result.nom_commune,
				contact_phone: result.telephone,
				contact_email: result.mail,
			}
		} else if (mode === 'edit' || mode === 'view') {
			return appointment
		} else {
			return defaultValues
		}
	}, [mode, appointment, school, status])

	const value: IAppointmentFormContext = useMemo(
		() => ({
			status,
			appointmentId,
			mode,
			error: schoolError?.message || appointmentError?.message,
			initialValues,
			isLoading: isSchoolLoading || isAppointmentLoading,
			hasLoaded: hasSchoolLoaded || hasAppointmentLoaded,
		}),
		[
			status,
			appointmentId,
			mode,
			schoolError,
			appointmentError,
			initialValues,
			isSchoolLoading,
			isAppointmentLoading,
			hasSchoolLoaded,
			hasAppointmentLoaded,
		],
	)

	return <AppointmentFormContext.Provider value={value}>{children}</AppointmentFormContext.Provider>
}

export function useAppointmentForm() {
	return useContext(AppointmentFormContext)
}
