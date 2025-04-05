import { Divider, Flex, Space, Watermark } from 'antd'
import classNames from 'classnames/bind'
import { AiOutlineTikTok } from 'react-icons/ai'
import { BiLogoFacebook } from 'react-icons/bi'
import { BsThreads } from 'react-icons/bs'
import { FaTelegramPlane } from 'react-icons/fa'
import { FiYoutube } from 'react-icons/fi'
import { RiTwitterXFill } from 'react-icons/ri'

import Logo from '~/assets/Logo'
import { useThemeColors } from '~/themes/useThemeColors'
import styles from './FooterLayout.module.scss'
import { FaGithub } from 'react-icons/fa6'

const cx = classNames.bind(styles)
function FooterLayout() {
	const { bgColorLayoutLight } = useThemeColors()

	return (
		<Watermark
			font={{ color: bgColorLayoutLight, fontSize: 30 }}
			height={30}
			width={130}
			zIndex={1}
			className={cx('footer-container')}
			content='Daden'>
			<div className={cx('footer-layout')}>
				<Space size={'large'}>
					<Flex align='center' className={cx('logo')} gap={10}>
						<Logo width={70} height={70} />
						<div className={cx('logo-text')}>
							<h5>BlackFlix</h5>
							<p>Cam on vi Da Den</p>
						</div>
					</Flex>
					<Divider type='vertical' style={{ borderColor: '#aaa', height: '40px' }} />
					<Flex className={cx('social-icons')} gap={10}>
						<a href='https://www.facebook.com/MrTuan.2902' target='_blank' rel='noopener noreferrer'>
							<Flex align='center' justify='center'>
								<BiLogoFacebook className={cx('icon')} />
							</Flex>
						</a>
						<a href='https://www.tiktok.com/@tuanhoanganh2902' target='_blank' rel='noopener noreferrer'>
							<Flex align='center' justify='center'>
								<AiOutlineTikTok className={cx('icon')} />
							</Flex>
						</a>
						<a>
							<Flex align='center' justify='center'>
								<BsThreads className={cx('icon')} />
							</Flex>
						</a>
						<a>
							<Flex align='center' justify='center'>
								<FiYoutube className={cx('icon')} />
							</Flex>
						</a>
						<a>
							<Flex align='center' justify='center'>
								<FaTelegramPlane className={cx('icon')} />
							</Flex>
						</a>
						<a>
							<Flex align='center' justify='center'>
								<RiTwitterXFill className={cx('icon')} />
							</Flex>
						</a>
						<a href='https://github.com/TuanHoangAnh2902' target='_blank' rel='noopener noreferrer'>
							<Flex align='center' justify='center'>
								<FaGithub className={cx('icon')} />
							</Flex>
						</a>
					</Flex>
				</Space>
				<div className={cx('footer-text')}>
					<p>© 2025 BlackFlix. Xây dựng bởi tình bạn, dòng code và 1 tông da khiến cả dark mode phải ghen tị.</p>
				</div>
			</div>
		</Watermark>
	)
}

export default FooterLayout
