export type TCheckMessageParams =
	| ICheckMessageShouldBeVisibleParams
	| ICheckMessageShouldExistParams

interface ICheckMessageCommonParams {
	message?: string
}

interface ICheckMessageShouldBeVisibleParams extends ICheckMessageCommonParams {
	shouldBeVisible?: boolean
	shouldExist?: never
}

interface ICheckMessageShouldExistParams extends ICheckMessageCommonParams {
	shouldBeVisible?: never
	shouldExist?: boolean
}
