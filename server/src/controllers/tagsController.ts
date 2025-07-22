import tag from '../models/Tags'

async function getTagsList(ctx: { body: { result: number; msg: string, data: any; }; }) {
    const tags = await tag.all();
    ctx.body = {
        result: 200,
        msg: "获取成功",
        data: tags
    }
}

export default {
    getTagsList
}