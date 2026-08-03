/**
 * Wave 65.05b — feature bundle cho LazyMotion, tách RIÊNG file để dynamic
 * import tạo được async chunk: `domAnimation` (~15-20KB gz) rời khỏi First
 * Load JS của mọi trang, chỉ tải khi feature bundle được LazyMotion yêu cầu
 * lần đầu ở client. (Import động thẳng 'motion/react' trong provider không
 * tách chunk được vì entry đó đã bị import tĩnh cùng module graph.)
 */
import { domAnimation } from 'motion/react';

export default domAnimation;
