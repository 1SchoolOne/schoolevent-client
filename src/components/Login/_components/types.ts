export interface ILoginFormFields {
	email?: string
	password?: string
}

export interface IMagicLinkFormFields extends Omit<ILoginFormFields, 'password'> {}
