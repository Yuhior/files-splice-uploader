/**
 * @Author: Yuhior
 * @Date: 2024/11/15
 * @LastEditors: author
 * @Description: desc
 */
import { dayjs } from 'element-plus'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'yyyy-MM-dd '

export function formatToDateTime(date: number | Date, formatStr = DATE_TIME_FORMAT): string {

	return dayjs(date).format(formatStr)
}

/**
 * 时间转化成时间戳
 * @param date
 */
export function dateToUnix(date: Date): number {
	return dayjs(date).unix()
}



/**
 * 转化成时分秒
 * @param time
 */
export function formatTime(time) {
	const hrs = ~~(time / 3600); // 3600 秒为 1 小时
	const mins = ~~((time % 3600) / 60); // 剩余时间除以 60 得到分钟数
	const secs = ~~(time % 60); // 剩余时间即为秒数

	// Output like "1:01" or "4:03:59" or "123:03:59"
	let ret = "";
	if (hrs > 0) {
		ret += "" + hrs + ":" + (mins < 10 ? "0" : ""); // 小时部分添加前导零
	}
	ret += "" + mins + ":" + (secs < 10 ? "0" : ""); // 分钟部分添加前导零
	ret += "" + secs; // 秒数
	return ret;
}
