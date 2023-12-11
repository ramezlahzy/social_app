const express = require('express');
const router = express.Router();
const whatIlearnedCtrl = require('../controller/whatIlearned');


router.post('/add', whatIlearnedCtrl.addWhatIlearned);
router.get('/get', whatIlearnedCtrl.getWhatIlearned);
router.get('/getone', whatIlearnedCtrl.getOneWhatIlearned);
router.post('/agreeWhatIlearned', whatIlearnedCtrl.agreeWhatIlearned);
router.post('/disagreeWhatIlearned', whatIlearnedCtrl.disagreeWhatIlearned);
router.post('/reportWhatIlearned', whatIlearnedCtrl.reportWhatIlearned);
router.post('/addComment', whatIlearnedCtrl.addComment);
router.get('/getComment', whatIlearnedCtrl.getComment);
router.post('/updateWhatIlearned', whatIlearnedCtrl.updateWhatIlearned);
router.delete('/deleteWhatIlearned/:id', whatIlearnedCtrl.deleteWhatIlearned);
router.get('/getAgreeUserList', whatIlearnedCtrl.getAgreeUserList);
router.get('/getDisagreeUserList', whatIlearnedCtrl.getDisAgreeUserList);
module.exports = router;
