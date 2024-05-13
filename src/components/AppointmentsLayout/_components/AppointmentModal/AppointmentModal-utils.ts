import { TAppointment } from '@types'

import { ISchool } from '../../../ContactsLayout/_components/ContactsTable/ContactsTable-types'

export function isSchool(record: ISchool | TAppointment): record is ISchool {
	return (record as ISchool).identifiant_de_l_etablissement !== undefined
}
