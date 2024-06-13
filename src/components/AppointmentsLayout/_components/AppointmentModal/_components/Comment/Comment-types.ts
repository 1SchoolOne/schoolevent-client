import { Database } from '@types'

type TUsersJoin = Database['public']['Tables']['users']['Row'] | null

export interface ICommentProps {
	comment: Database['public']['Tables']['appointment_comments']['Row'] & { users: TUsersJoin }
}
