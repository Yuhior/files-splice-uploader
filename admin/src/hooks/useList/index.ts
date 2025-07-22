/**
 * @Author: Yuhior
 * @Date: 2024/11/15
 * @LastEditors: author
 * @Description: desc
 */
/**
 *
 * @param listRequestFn 请求方法 must
 * @param filterOption 筛选条件 must
 * @param size 自定义一个分页的size
 * @param overlay 非下拉加载更多
 */
export function useList(listRequestFn, filterOption = {}, size = 10, overlay = false) {
	// 加载状态
	const loading = ref(false)
	//当前页面
	const page = ref(1)
	// 总条数
	const total = ref(0)
	//每页多少条
	const pageSize = ref(size)
	// 数据list
	const list = ref([])
	// 初始筛选条件
	const query = ref({ ...filterOption }) // 初始筛选条件

	const finished = ref(false)

	function handleChangePage(val: number) {
		page.value = val
		return handleLoadMore()
	}

	// 加载更多
	async function handleLoadMore() {
		loading.value = true
		try {
			const params = {
				...query.value,
				pageSize: pageSize.value,
				pageNum: page.value
			}
			const { data } = await listRequestFn(params)
			if (data.list.length < pageSize.value) {
				finished.value = true
			}
			if(overlay){
				list.value = data.list
			}else{
				if (page.value === 1) {
					list.value = data.list
				} else {
					list.value.push(...data.list as [])
				}
			}
			total.value = data.totalNum
		} catch (error) {
			throw error
		} finally {
			// 关闭加载中
			loading.value = false
		}
	}

	// 筛选条件变化时重置分页并重新获取列表
	const updateQuery = (newQuery) => {
		finished.value = false
		page.value = 1
		list.value = []
		query.value = { ...query.value, ...newQuery }
		return handleLoadMore() // 如果 page 已经是 1，手动调用一次
	}
	return {
		list,
		page,
		finished,
		total,
		loading,
		updateQuery,
		handleChangePage,
		handleLoadMore
	}
}
