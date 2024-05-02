import { Button, Checkbox, Radio, Space } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import classNames from 'classnames'

import { generateRowKey } from '../../Table-utils'
import { IRadioOrCheckboxDropdownProps } from './RadioOrCheckboxDropdown-types'

export function RadioOrCheckboxDropdown(props: IRadioOrCheckboxDropdownProps) {
	const { useCheckbox, options, selectedKeys, setSelectedKeys, clearFilters, confirm } = props

	const radioOrCheckbox = useCheckbox ? (
		<Checkbox.Group
			value={selectedKeys as unknown as CheckboxValueType[]}
			onChange={(values) => {
				setSelectedKeys(values as any[])
			}}
		>
			<Space direction="vertical" size="small">
				{options.map(({ value, label }) => (
					<Checkbox key={generateRowKey(value + label)} value={value}>
						{label}
					</Checkbox>
				))}
			</Space>
		</Checkbox.Group>
	) : (
		<Radio.Group
			value={selectedKeys[0]}
			onChange={({ target }) => {
				setSelectedKeys([target.value])
			}}
		>
			<Space direction="vertical" size="small">
				{options.map(({ value, label }) => (
					<Radio key={generateRowKey(value + label)} value={value}>
						{label}
					</Radio>
				))}
			</Space>
		</Radio.Group>
	)

	return (
		<Space
			className={classNames('custom-filter-dropdown', {
				radio: !useCheckbox,
				checkbox: useCheckbox,
			})}
			direction="vertical"
		>
			{radioOrCheckbox}
			<Space className="custom-filter-dropdown__btns-container">
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
