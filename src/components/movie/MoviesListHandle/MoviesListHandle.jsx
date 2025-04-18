import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, message, Popconfirm, Space } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import styles from './MoviesListHandle.module.scss'
import classNames from 'classnames/bind'
import { FaCheck } from 'react-icons/fa'

const cx = classNames.bind(styles)

const MoviesListHandle = ({
	initialValues = { name: '', description: '' },
	isEditing = false,
	onSubmit,
	onDelete,
	onCancel,
	loading = false,
}) => {
	const [form] = Form.useForm()
	const [submitLoading, setSubmitLoading] = useState(false)
	const [deleteLoading, setDeleteLoading] = useState(false)

	// Set initial form values
	useState(() => {
		form.setFieldsValue(initialValues)
	}, [form, initialValues])

	// Handle form submission
	const handleFinish = useCallback(
		async (values) => {
			try {
				setSubmitLoading(true)
				await onSubmit(values)
				form.resetFields()
			} catch (error) {
				console.error('Lỗi khi xử lý danh sách:', error)
				message.error('Không thể xử lý yêu cầu. Vui lòng thử lại sau.')
			} finally {
				setSubmitLoading(false)
			}
		},
		[form, onSubmit],
	)

	// Handle delete action
	const handleDelete = useCallback(async () => {
		if (onDelete) {
			try {
				setDeleteLoading(true)
				await onDelete()
			} catch (error) {
				console.error('Lỗi khi xóa danh sách:', error)
				message.error('Không thể xóa danh sách. Vui lòng thử lại sau.')
			} finally {
				setDeleteLoading(false)
			}
		}
	}, [onDelete])

	// Handle cancel action
	const handleCancel = useCallback(() => {
		form.resetFields()
		onCancel()
	}, [form, onCancel])

	return (
		<Form form={form} layout='vertical' className={cx('list-form')} onFinish={handleFinish} disabled={loading}>
			<Form.Item name='name' label='Tên danh sách' rules={[{ required: true, message: 'Vui lòng nhập tên danh sách' }]}>
				<Input placeholder='Nhập tên danh sách' />
			</Form.Item>

			<Form.Item name='description' label='Mô tả (tùy chọn)'>
				<Input.TextArea rows={3} placeholder='Mô tả về danh sách này' />
			</Form.Item>

			<div className={cx('form-actions', { 'with-delete': isEditing })}>
				{isEditing && onDelete && (
					<Popconfirm
						title='Xóa danh sách'
						description='Bạn có chắc chắn muốn xóa danh sách này?'
						onConfirm={handleDelete}
						okText='Xóa'
						cancelText='Hủy'
						placement='topRight'
						okButtonProps={{ danger: true }}>
						<Button danger type='primary' icon={<DeleteOutlined />} loading={deleteLoading}>
							Xóa
						</Button>
					</Popconfirm>
				)}
				<Space>
					<Button className={cx('cancel-btn')} onClick={handleCancel}>
						Hủy
					</Button>
					<Button
						icon={<FaCheck />}
						className={cx('active-btn')}
						type='primary'
						htmlType='submit'
						loading={submitLoading || loading}>
						{isEditing ? 'Cập nhật' : 'Tạo danh sách'}
					</Button>
				</Space>
			</div>
		</Form>
	)
}

MoviesListHandle.propTypes = {
	initialValues: PropTypes.shape({
		name: PropTypes.string,
		description: PropTypes.string,
	}),
	isEditing: PropTypes.bool,
	onSubmit: PropTypes.func.isRequired,
	onDelete: PropTypes.func,
	onCancel: PropTypes.func.isRequired,
	loading: PropTypes.bool,
}

export default MoviesListHandle
