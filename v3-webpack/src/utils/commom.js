/**
 * @Author: ruanlin
 * @Descripttion: 获取当前星期几
 * @param {*}
 */
export function getCurrentWeek() {
  const now = new Date();
  const day = now.getDay();
  const weeks = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
  const week = weeks[day];
  return week;
}
