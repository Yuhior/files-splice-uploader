import query from "../utils/mysql";
import type { MsqlResult } from "../utils/mysql";

async function all(){
    const res: MsqlResult = await query("SELECT * FROM tags");
    console.log('res', res)
    return res.results;
}
export default {
    all
}
