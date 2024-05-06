import { Button, Input, Space } from 'antd'

import { ISearchDropdownProps } from './SearchDropdown-types'

export function SearchDropdown(props: ISearchDropdownProps) {
	const { inputRef, selectedKeys, setSelectedKeys, clearFilters, confirm } = props

	// Even though selectedKeys is used as an array, it corresponds to the current
	// filter value. It allows to have a controlled input value without declaring
	// a state ourselves.
	return (
		<Space className="se-filter-dropdown search" direction="vertical">
			<Input
				ref={inputRef}
				value={selectedKeys[0]}
				placeholder="Rechercher"
				onChange={(e) => {
					setSelectedKeys(e.target.value ? [e.target.value] : [])
				}}
				onPressEnter={() => confirm()}
			/>
			<Space className="se-filter-dropdown__btns-container">
				<Button
					type="link"
					size="small"
					onClick={() => {
						clearFilters?.()
						// confirm() is important here because if we don't call it the input
						// won't be cleared properly.
						confirm()
					}}
				>
					Réinitialiser
				</Button>
				<Button
					type="primary"
					size="small"
					onClick={() => {
						confirm()
					}}
				>
					OK
				</Button>
			</Space>
		</Space>
	)
}
