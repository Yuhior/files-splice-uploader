import * as mysql from "mysql";
import config from './../modules/Config';


export interface MsqlResult {
    state: number;
    results: any;
    msg: string;
    error: mysql.MysqlError | null;
    fields: mysql.FieldInfo[] | null;
}

// 数据库连接池
const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: config.db.port,
    typeCast: function(field, next) {
        // 确保BLOB类型正确处理
        if (field.type === 'BLOB') {
            return field.buffer();
        }
        return next();
    },
     debug: true // 开发时启用
});

/**
 * 数据库操作
 */

export default function query(command: string, value?: Array<any>): Promise<MsqlResult> {
    const result: MsqlResult = {
        state: 0,
        results: null,
        msg: "",
        error: null,
        fields: null
    }
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                result.error = err;
                result.msg = "数据库连接出错";
                resolve(result);
            } else {
                const callback: mysql.queryCallback = (error, results, fields) => {
                    connection.release();
                    if (error) {
                        result.error = error;
                        result.msg = "数据库操作出错";
                        resolve(result);
                    } else {
                        result.state = 1;
                        result.msg = "数据库操作成功"
                        result.results = results;
                        result.fields = fields ?? null;
                        resolve(result);
                    }
                }
                if (value) {
                    connection.query(command, value, callback);
                } else {
                    connection.query(command, callback);
                }
            }
        })
    })
}