import Router from "koa-router";
import config from "../modules/Config";

const router  = new Router({
    prefix:config.apiPrefix
})

export default router