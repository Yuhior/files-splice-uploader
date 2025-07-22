import router from './main'
import filesController from '../controllers/filesController'
router.post('/checkChuncks',filesController.checkChuncks)
router.post('/upload',  filesController.handleFileUpload)
router.post('/merge',  filesController.mergeFile)
