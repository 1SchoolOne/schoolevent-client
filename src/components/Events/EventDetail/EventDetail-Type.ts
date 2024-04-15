import { Database } from '@types'

export const roleLabelRecord: Record<Database['public']['Enums']['user_role'], string> = {
	manager: 'Manager',
	admin: 'Administrateur',
	student: 'Étudiant',
}
