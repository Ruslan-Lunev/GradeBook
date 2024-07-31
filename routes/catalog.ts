import * as express from 'express'
import * as subjectController from '../controllers/subjectController'
import * as studentController from '../controllers/studentController'
import * as scoreController from '../controllers/scoreController'
const router = express.Router();

router.get('/subject', subjectController.list)
router.post('/subject/edit', subjectController.edit)
router.get('/subject/create', subjectController.new_item)
router.post('/subject/create', subjectController.add)
router.post('/subject/update', subjectController.update)
router.post('/subject/delete', subjectController.deleteItem)

router.get('/student', studentController.list)
router.post('/student/edit', studentController.edit)
router.get('/student/create', studentController.new_item)
router.post('/student/create', studentController.add)
router.post('/student/update', studentController.update)
router.post('/student/delete', studentController.deleteItem)

router.post('/score', scoreController.list)
router.post('/score/new', scoreController.new_item)
router.post('/score/create', scoreController.add)
router.post('/score/update', scoreController.update)
router.post('/score/delete', scoreController.deleteItem)


export default router;