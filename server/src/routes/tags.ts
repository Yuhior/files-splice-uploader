import router from './main'
import tagsController from '../controllers/tagsController'
router.get('/tags', tagsController.getTagsList)
