import { Database } from '@types'

type TUsersJoin = {
	id: string
	email: string
} | null

export interface ICommentProps {
	comment: Database['public']['Tables']['appointment_comments']['Row'] & { users: TUsersJoin }
}
