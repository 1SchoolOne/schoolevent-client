import { Broom as ClearFiltersIcon } from '@phosphor-icons/react'
import { Button } from 'antd'
import classNames from 'classnames'

import { IResetFiltersButton } from './ResetFiltersButton-types'

export function ResetFiltersButton(props: IResetFiltersButton) {
	const { className, onClick } = props

	return (
		<Button
			className={classNames('se-table-clear-filters-btn', className)}
			type="primary"
			icon={<ClearFiltersIcon size="16px" />}
			onClick={onClick}
		>
			Réinitialiser les filtres
		</Button>
	)
}
