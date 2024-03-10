import type { GetRef } from 'antd'
import { Form } from 'antd'
import dayjs from 'dayjs'

import { TAppointment } from '@types'

export interface IFormValues
	extends Omit<TAppointment, 'id' | 'author_id' | 'planned_date' | 'contacted_date'> {
	contacted_date?: dayjs.Dayjs
	planned_date?: dayjs.Dayjs
}

export type TFormProps = IFormEditModeProps | IFormNewModeProps | IFormViewModeProps

type FormInstance = GetRef<typeof Form<IFormValues>>

interface IFormEditModeProps {
	formInstance: FormInstance
	initialValues?: Partial<IFormValues>
	isLoading: boolean
	isPending?: boolean
	onFinish: (values: IFormValues) => void
	mode: 'edit'
}

interface IFormNewModeProps {
	formInstance: FormInstance
	initialValues?: Partial<IFormValues>
	isLoading: boolean
	isPending?: boolean
	onFinish: (values: IFormValues) => void
	mode: 'new'
}

interface IFormViewModeProps {
	formInstance: FormInstance
	initialValues: Partial<IFormValues> | undefined
	isLoading: boolean
	isPending?: never
	onFinish?: never
	mode: 'view'
}

export const submitButtonLabel = {
	edit: 'Enregistrer',
	new: 'Créer le rendez-vous',
	view: null,
} as const
