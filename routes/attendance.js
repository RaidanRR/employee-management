const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router({ mergeParams: true });
const attendance = require('../controllers/attendance');
const isAuth = require('../middlewares/isAuth');
const { isAuthor } = require('../middlewares/isAuthor');
const isValidObjectId = require('../middlewares/isValidObjectId');
const { validateAttendance } = require('../middlewares/validator');

router.get('/', isAuth, attendance.index); // Ini untuk /attendance
router.get('/index', isAuth, attendance.index);
router.post('/', isAuth, validateAttendance, wrapAsync(attendance.createAttendance));
router.get('/create', isAuth, attendance.renderNewForm);

router.get('/:id', isAuth, isValidObjectId('/employees'), attendance.showAttendance);
router.get('/:id/edit', isAuth, isValidObjectId('/employees'), attendance.renderEditForm);
router.put('/:id', isAuth, isValidObjectId('/attendance'), validateAttendance, wrapAsync(attendance.updateAttendance));
router.delete('/:id',isAuth, isValidObjectId('/attendance'), wrapAsync(attendance.deleteAttendance));

module.exports = router;
