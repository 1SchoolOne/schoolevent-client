export interface IGlobalSearchProps {
	className?: string
	onChange: (value: string) => void
	value: string
	searchedFields: Array<string>
}
