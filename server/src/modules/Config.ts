// readonly  只读

class ModuleConfig {
    constructor() {

    }
    readonly db = {
        host: "localhost",
        user: "root",
        password: "ServBay.dev",
        database: "file_split",
        port: 3306,
        maxLimit: 200,
    }
    /**
     * 接口前缀
     */
    readonly apiPrefix = ""
}

const config  = new ModuleConfig();
export default config;