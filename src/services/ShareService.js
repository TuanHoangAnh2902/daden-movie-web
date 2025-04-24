/**
 * Service chịu trách nhiệm xử lý các tính năng chia sẻ
 */

/**
 * Chia sẻ qua Facebook với thông tin đã được tối ưu
 * @param {Object} options - Thông tin chia sẻ
 * @param {string} options.url - URL để chia sẻ
 * @param {string} options.title - Tiêu đề nội dung chia sẻ
 * @param {string} options.description - Mô tả nội dung chia sẻ
 * @param {string} options.image - URL hình ảnh cho nội dung chia sẻ
 */
export const shareFacebook = (options) => {
  const { url, title } = options;
  
  // Facebook sử dụng OpenGraph meta tags để hiển thị thông tin
  // URL cơ bản để chia sẻ
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  
  // Mở cửa sổ chia sẻ Facebook
  const width = 550;
  const height = 450;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  
  window.open(
    fbShareUrl,
    'Chia sẻ lên Facebook',
    `width=${width},height=${height},top=${top},left=${left},toolbar=0,location=0,menubar=0,status=0`
  );
  
  // Theo dõi sự kiện chia sẻ nếu cần
  if (window.gtag) {
    window.gtag('event', 'share', {
      method: 'facebook',
      content_type: 'movie',
      content_id: title
    });
  }
};

/**
 * Chia sẻ qua Twitter
 * @param {Object} options - Thông tin chia sẻ
 * @param {string} options.url - URL để chia sẻ
 * @param {string} options.title - Tiêu đề nội dung chia sẻ
 * @param {string} options.description - Mô tả nội dung chia sẻ
 */
export const shareTwitter = (options) => {
  const { url, title, description = '' } = options;
  
  // Tạo nội dung tweet
  const text = description ? `${title} - ${description}` : title;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  
  // Mở cửa sổ chia sẻ Twitter
  const width = 550;
  const height = 420;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  
  window.open(
    twitterShareUrl,
    'Chia sẻ lên Twitter',
    `width=${width},height=${height},top=${top},left=${left}`
  );
  
  // Theo dõi sự kiện chia sẻ nếu cần
  if (window.gtag) {
    window.gtag('event', 'share', {
      method: 'twitter',
      content_type: 'movie',
      content_id: title
    });
  }
};

/**
 * Chia sẻ qua WhatsApp
 * @param {Object} options - Thông tin chia sẻ
 * @param {string} options.url - URL để chia sẻ
 * @param {string} options.title - Tiêu đề nội dung chia sẻ
 * @param {string} options.description - Mô tả nội dung chia sẻ
 */
export const shareWhatsApp = (options) => {
  const { url, title, description = '' } = options;
  
  // Tạo nội dung tin nhắn
  const text = `${title}${description ? ': ' + description : ''} ${url}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  
  window.open(whatsappShareUrl, '_blank');
  
  // Theo dõi sự kiện chia sẻ nếu cần
  if (window.gtag) {
    window.gtag('event', 'share', {
      method: 'whatsapp',
      content_type: 'movie',
      content_id: title
    });
  }
};

/**
 * Sử dụng Web Share API nếu có thể, nếu không thì chuyển sang các phương thức chia sẻ thông thường
 * @param {Object} options - Thông tin chia sẻ
 * @param {string} options.url - URL để chia sẻ
 * @param {string} options.title - Tiêu đề nội dung chia sẻ
 * @param {string} options.description - Mô tả nội dung chia sẻ
 * @param {string} options.platform - Nền tảng mục tiêu ('facebook', 'twitter', 'whatsapp')
 * @returns {Promise<boolean>} - Thành công hay không
 */
export const shareContent = async (options) => {
  const { platform, url, title, description } = options;
  
  // Thử sử dụng Web Share API nếu trình duyệt hỗ trợ
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: description,
        url: url,
      });
      return true;
    } catch (error) {
      console.log('Web Share API error:', error);
      // Fallback to traditional sharing methods
    }
  }
  
  // Sử dụng các phương thức chia sẻ truyền thống nếu Web Share API không khả dụng hoặc gặp lỗi
  switch (platform) {
    case 'facebook':
      shareFacebook(options);
      break;
    case 'twitter':
      shareTwitter(options);
      break;
    case 'whatsapp':
      shareWhatsApp(options);
      break;
    default:
      return false;
  }
  
  return true;
};