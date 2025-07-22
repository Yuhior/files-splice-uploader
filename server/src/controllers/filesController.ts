import { Context, Next } from 'koa';
import files from '../models/Files'
import { MsqlResult } from '../utils/mysql';
import * as path from 'path'
import * as fs from 'fs'
async function checkChuncks(ctx: Context) {
	try {
		const { md5 } = ctx.request.body;
		 const queryStr = `SELECT 
                (SELECT count(*)  FROM chunck_list WHERE file_hash = ?) as all_count, 
                id as chunck_id,
                file_hash,
                chunck_number,
                chunck_total_number 
            FROM chunck_list  
            WHERE file_hash = ? 
            GROUP BY id 
            ORDER BY chunck_number
            `
        const res = await files.checkChuncks(queryStr, [md5, md5])
		ctx.body = {
			result: 200,
			msg: "获取成功",
			data: res ?? []
		}
	}
	catch (err: any) {
		ctx.body = {
			result: 500,
			msg: "获取失败",
			data: err.message
		}
	}
}


const projectRoot = process.cwd(); // 返回 Node.js 进程的当前工作目录
const uploadPath = path.join(projectRoot, 'uploads');


async function handleFileUpload(ctx: Context) {
	try {
		const { totalNumber, chunckNumber, chunkSize, md5, name } = ctx.request.body;
		// 指定 hash 文件路径
		const chunckPath = path.join(uploadPath, 'chunks', md5, '/');
		console.log(chunckPath)
		if (!fs.existsSync(chunckPath)) {
			fs.mkdirSync(chunckPath, { recursive: true })
		}
		console.log(totalNumber, 'totalNumber')
		// 移动文件到指定目录
		// 重点修改处：从 files 中获取上传的文件
		const fileField = ctx.request.files?.file;
		if (!fileField) {
			throw new Error('未接收到文件');
		}
		const file = Array.isArray(fileField) ? fileField[0] : fileField;
		// 5. 直接移动文件到目标位置
		const targetPath = path.join(chunckPath, `${md5}-${chunckNumber}`);
		fs.renameSync(file.filepath, targetPath);

		// 插入数据到数据库
		const sql = `
            INSERT INTO file_split.chunck_list 
            (file_hash,file_name, chunck_total_number, chunck_size ,chunck_number ) 
            VALUES (?, ?, ?, ?, ?)
        `;
		const result = await files.insertFileChunks(sql, [md5, name, totalNumber, chunkSize, chunckNumber]);
		console.log(result, '数据插入成功')

		ctx.body = {
			result: 200,
			msg: "上传成功",
			data: null
		}
	}
	catch (err: any) {
		console.error('文件上传出错:', err);
		ctx.body = {
			result: 500,
			msg: "上传失败",
			data: err.message
		}
	}
}
async function mergeFile(ctx: Context) {
	const { totalNumber, md5, name } = ctx.request.body;
	const ext = path.extname(name);  // 获取文件扩展名
	try {
		// 1. 构建基于MD5的物理路径
		const filePath = `uploads/${md5}${ext}`;
		const fullPath = path.join(process.cwd(), filePath);
		// 2. 查询数据库中所有相同MD5的记录
		const md5Records = await checkMergeStatusInDB(md5) as Array<{
			file_name: string
			stored_name: string
			file_hash: string
			file_path: string
			file_size: number
		}>;
		console.log(md5Records,'md5Records',name)
		// 3. 检查是否已存在同名记录
		const sameNameRecord = md5Records.find(record => record.file_name === name);
		console.log(sameNameRecord,'sameNameRecord')
		if (sameNameRecord) {
			console.log(sameNameRecord,'sameNameRecord')
			ctx.body = {
				result: 200,
				msg: "文件已存在",
				data: {
					fileName: sameNameRecord.file_name,
					filePath: sameNameRecord.file_path,
					fileSize: sameNameRecord.file_size,
					md5: sameNameRecord.file_hash
				}
			};
			return;
		}
		// 4. 检查物理文件是否存在
		const physicalFileExists = fs.existsSync(fullPath);
		if (physicalFileExists && md5Records.length > 0) {
			// 情况2：物理文件存在，但不同名
			// 使用第一条记录的文件大小（所有记录大小相同）
			const fileSize = md5Records[0].file_size;

			// 创建新记录
			await createFileRecord(name, md5, filePath, fileSize)
			ctx.body = {
				result: 200,
				msg: "文件关联成功",
				data: {
					fileName: name,
					filePath: filePath,
					fileSize: fileSize,
					md5
				}
			};
			return;
		}
		// 5. 文件不存在，执行合并
		const chunckPath = path.join(uploadPath, 'chunks', md5, '/');
		//读取对应hash文件夹下的所有分片文件名称
		const chunckList = fs.existsSync(chunckPath) ? fs.readdirSync(chunckPath) : [];
		//判断切片是否完整
		console.log(chunckList.length, totalNumber, '我是总地址，和分片地址')
		if (chunckList.length !== totalNumber) { // 没有传完
			ctx.body = {
				result: 500,
				msg: "Merge failed, missing file slices",
				data: null
			}
			process.exit();
		}
		// 创建可写流
		const writeStream = fs.createWriteStream(filePath);
		for (let index = 0; index < totalNumber; index++) {
			const chunkFilePath = path.join(chunckPath, `${md5}-${index}`);
			const readStream = fs.createReadStream(chunkFilePath);
			// 使用promise来等待该分片完成
			await new Promise<void>((resolve, reject) => {
				readStream.pipe(writeStream, { end: false }); // 不自动结束可写流
				readStream.on('end', () => {
					// 删除分片文件
					fs.unlink(chunkFilePath, (err) => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				});
				readStream.on('error', reject);
			});
		}
		// 关闭可写流
		writeStream.end();
		// 等待流结束
		await new Promise<void>((resolve) => writeStream.on('finish', resolve));
		// 删除空文件夹
		await fs.promises.rmdir(chunckPath);
		// 7. 获取文件大小
        const fileSize = fs.statSync(fullPath).size;
		await createFileRecord(name, md5, filePath, fileSize)
		ctx.body = {
			result: 200,
			msg: "文件合并成功",
			data: {
				fileName: name,
				filePath: filePath,
				fileSize: fileSize,
				md5
			}
		}
	} catch (error) {
		ctx.body = {
			result: 500,
			msg: "合并失败",
			data: null
		}
	}
}
// 添加文件合并状态检查
async function checkMergeStatusInDB(md5: string): Promise<[]> {
	try {
		const sql = `SELECT * FROM files WHERE file_hash = ?`;
		const { results } = await files.checkMergeStatus(sql, [md5]);
		return results;
	} catch (error) {
		console.error(`检查合并状态失败: ${error}`);
		return [];
	}
}
// 辅助方法：创建文件记录
async function createFileRecord(fileName: string, fileHash: string, filePath: string, fileSize: number) {
    const sql = `INSERT INTO files (file_name, file_hash, file_path, file_size) VALUES (?, ?, ?, ?)`;
	await files.insertFile(sql, [fileName, fileHash, filePath, fileSize]);
}
export default {
	checkChuncks,
	handleFileUpload,
	mergeFile
}