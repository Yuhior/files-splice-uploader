import query from "../utils/mysql";
import type { MsqlResult } from "../utils/mysql";

async function checkChuncks(queryStr: string, values: any[]): Promise<MsqlResult> {
    const res: MsqlResult = await query(queryStr, values);
    return res.results;
}

async function insertFileChunks(queryStr: string, values: any[]): Promise<MsqlResult> {
    const res: MsqlResult = await query(queryStr, values);
    return res.results;
}
async function insertFile(queryStr: string, values: any[]): Promise<MsqlResult> {
    const res: MsqlResult = await query(queryStr, values);
    return res.results;
}
async function checkMergeStatus(queryStr: string, values: any[]): Promise<MsqlResult> {
    const res: MsqlResult = await query(queryStr, values);
    return res;
}
export default {
    checkChuncks,
    insertFileChunks,
    insertFile,
    checkMergeStatus
}
