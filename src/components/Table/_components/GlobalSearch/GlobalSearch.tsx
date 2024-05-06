import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { Input, Space } from 'antd'
import classNames from 'classnames'

import { Info } from '@components'

import { IGlobalSearchProps } from './GlobalSearch-types'

export function GlobalSearch(props: IGlobalSearchProps) {
	const { className, onChange, value, searchedFields } = props

	return (
		<Space direction="horizontal" className={classNames('se-table-global-search', className)}>
			<Info tooltip tooltipProps={{ placement: 'bottom' }}>
				<Space direction="vertical">
					<h4>Recherche globale</h4>
					<div>
						Ignore les filtres et recherche dans les champs suivants :
						<ul>
							{searchedFields.map((field) => (
								<li key={field}>{field}</li>
							))}
						</ul>
					</div>
				</Space>
			</Info>
			<Input
				placeholder="Recherche globale"
				allowClear
				prefix={<SearchIcon />}
				value={value}
				onChange={({ target }) => {
					onChange(target.value)
				}}
			/>
		</Space>
	)
}
