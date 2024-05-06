import { AnyObject } from 'antd/lib/_util/type'

import { ColumnsType } from '../../Table-types'

export interface ILoadingTableProps<T extends AnyObject> {
	className?: string
	columns: ColumnsType<T>
}
