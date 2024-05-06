import { AnyObject } from 'antd/lib/_util/type'
import { ReactElement } from 'react'

import { ColumnsType } from '../../Table-types'

export interface ILoadingTableProps<T extends AnyObject> {
	className?: string
	columns: ColumnsType<T>
	tableHeader: ReactElement | null
}
