import { Spin, Typography } from 'antd'
import classNames from 'classnames'
import { ElementRef, useEffect, useRef, useState } from 'react'

import { useAppointmentForm } from '@contexts'

import { FileCard } from '../FileCard/FileCard'
import { IFileListProps } from './FileList-types'

import './FileList-styles.less'

export function FileList(props: IFileListProps) {
	const { files, loading } = props

	const { appointmentId } = useAppointmentForm()
	const listRef = useRef<ElementRef<'div'>>(null)
	const [showLeftShadow, setShowLeftShadow] = useState(false)
	const [showRightShadow, setShowRightShadow] = useState(false)

	const handleScroll = () => {
		if (!listRef?.current) {
			return
		}

		if (listRef.current.scrollLeft > 0) {
			setShowLeftShadow(true)
		} else {
			setShowLeftShadow(false)
		}

		if (listRef.current.scrollWidth > listRef.current.clientWidth + listRef.current.scrollLeft) {
			setShowRightShadow(true)
		} else {
			setShowRightShadow(false)
		}
	}

	useEffect(() => {
		// Initial check
		handleScroll()

		const ref = listRef

		if (ref?.current) {
			ref.current.addEventListener('scroll', handleScroll)
		}

		return () => {
			ref.current?.removeEventListener('scroll', handleScroll)
		}
	}, [])

	const renderListContent = () => {
		if (loading) {
			return <Spin />
		} else if (files.length === 0) {
			return (
				<Typography.Text className="file-list--no-data" type="secondary">
					Aucune pièce jointe.
				</Typography.Text>
			)
		} else {
			return (
				<>
					<div
						className={classNames('scroll-shadow', 'left', {
							visible: showLeftShadow,
						})}
					></div>
					<div className="file-list">
						{files.map((file) => (
							<FileCard
								key={file.id}
								file={file}
								path={`appointment_${appointmentId}/${file.name}`}
							/>
						))}
					</div>
					<div
						className={classNames('scroll-shadow', 'right', {
							visible: showRightShadow,
						})}
					></div>
				</>
			)
		}
	}

	return (
		<div className="file-list-container" ref={listRef}>
			{renderListContent()}
		</div>
	)
}
