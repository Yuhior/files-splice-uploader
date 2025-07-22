export function RndNum(n) {
	const rnd = Math.floor(n * Math.random())
	return rnd
}

/**
 * 角度换算到180机制
 * @param degree
 */
export function _get_degre180(degree) {
	degree = parseFloat(degree)
	if (degree > 360) degree = degree % 360 //先保证数据不要大于360度
	if (degree > 180) degree = degree - 360 //再保证数据不要大于180度，因为kr旋转基于180或-180
	if (degree < -360) degree = degree % 360
	if (degree < -180) degree = degree + 360
	degree = degree.toFixed(2)
	return degree
}
