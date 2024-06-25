import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ICalendarListProps } from '../Calendar-types'

const RENDEZ_VOUS = 'Rendez-vous'
const EVENEMENT = 'Événement'

export function useCalendarList(props: ICalendarListProps) {
	const { events, appointments } = props
	const [search, setSearch] = useState('')
	const [selectedButton, setSelectedButton] = useState(RENDEZ_VOUS)
	const navigate = useNavigate()

	const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
	}, [])

	const handleSegmentChange = useCallback((value: string | number) => {
		if (typeof value === 'string') {
			setSelectedButton(value === EVENEMENT ? EVENEMENT : RENDEZ_VOUS)
		}
	}, [])

	const getAppointmentsMenu = useCallback(
		(id: number): ItemType[] => [
			{
				key: 'create-follow-up',
				label: 'Modifier le rendez-vous',
				onClick: () => navigate(`/appointments?action=edit&id=${id}`),
			},
		],
		[navigate],
	)

	return {
		search,
		setSearch,
		selectedButton,
		events,
		appointments,
		handleSearchChange,
		handleSegmentChange,
		getAppointmentsMenu,
	}
}
