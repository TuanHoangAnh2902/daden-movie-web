import { Button, Checkbox, Form, Input } from 'antd'
const onFinish = (values) => {
	console.log('Success:', values)
}
const onFinishFailed = (errorInfo) => {
	console.log('Failed:', errorInfo)
}
function Home() {
	return (
		<div>
			<h2>Home</h2>
			<Form
				name='basic'
				labelCol={{
					span: 9,
				}}
				wrapperCol={{
					span: 16,
				}}
				style={{
					maxWidth: 600,
				}}
				initialValues={{
					remember: true,
				}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete='off'>
				<Form.Item
					label='Username'
					name='username'
					rules={[
						{
							required: true,
							message: 'Please input your username!',
						},
					]}>
					<Input />
				</Form.Item>

				<Form.Item
					label='Password'
					name='password'
					rules={[
						{
							required: true,
							message: 'Please input your password!',
						},
					]}>
					<Input.Password />
				</Form.Item>

				<Form.Item name='remember' valuePropName='checked' label={null}>
					<Checkbox>Remember me</Checkbox>
				</Form.Item>

				<Form.Item label={null}>
					<Button type='primary' htmlType='submit'>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}

export default Home
