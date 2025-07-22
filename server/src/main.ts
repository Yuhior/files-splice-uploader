// 导入koa， koa是一个类
import Koa from 'koa'
import KoaBody, {koaBody} from 'koa-body'
import router from './routes/main'  

import './routes/tags'
import './routes/files'




// 创建koa实例对象：app
const app = new Koa()

// 使用中间件处理 post 传参 和上传图片

app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: './uploads',
        keepExtensions: true,
    }
}))


// 使用 app.use() 方法添加中间件,且只能写一个中间件
// 注意：app.use 只能接收函数作为参数
app.use(async (ctx, next) => {
    /** 请求路径 */
    // const path = ctx.request.path;
    console.log("--------------------------");
    console.count("request count");
    const { origin, referer } = ctx.headers;
    ctx.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    })
    if (ctx.request.method === "OPTIONS") {
        ctx.response.status = 200;
    }
    try {
        await next();
    } catch (err: any) {
        console.log("Error: " + err);
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            message: err.message
        }
    }
});


// 路由 挂载

app.use(router.routes())

app.on("error", (err, ctx) => {
    console.log(`\x1B[91m server error !!!!!!!!!!!!! \x1B[0m`, err, ctx);
})

// 指定端口号并启动服务器
const port = 3000 // 表示服务器将监听的端口号
app.listen(port, () => {
    console.log('server is running on http://localhost:3000')
})
