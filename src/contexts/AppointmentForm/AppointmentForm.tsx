import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo } from 'react'

import { PropsWithChildren } from '@types'
import { useSupabase } from '@utils'

import {
	GOUV_API_URL,
	SELECTED_FIELDS,
} from '../../components/ContactsLayout/_components/Table/Table-constants'
import { IAppointmentFormContext, IAppointmentFormProviderProps } from './AppointmentForm-types'

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
		queryFn: async () =>
			fetch(
				`${GOUV_API_URL}?timezone=Europe%2FParis&where=identifiant_de_l_etablissement="${schoolId}"&select=${SELECTED_FIELDS}`,
			).then((res) => res.json()),
		enabled: mode === 'new' && schoolId !== undefined,
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
	})

	const initialValues = useMemo((): Partial<IAppointmentFormContext['initialValues']> => {
		if (mode === 'new' && school?.results[0]) {
			const result = school.results[0]

			return {
				apt_status: status ? status : 'to_contact',
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
			return undefined
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
