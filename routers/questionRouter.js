// -------------------------IMPORTING-------------------------
//import express
const express = require('express')
//import registerController
const question = require('../controllers/questionController')
//authentication check
const authMiddleware = require('../middlewares/auth')
const {questionValidators} = require('../validators/questionValidator')
const {validationResult} = require('../validators/validationResult')


// -------------------------DEFINE ROUTER-------------------------
const router = express.Router()


// -------------------------CUSTOM ROUTE-------------------------
router.post('/questions',questionValidators,validationResult, authMiddleware.Auth, question.questions)
router.get('/questions', question.questionDetails)
router.get('/questions/:id', question.questionDetails)
router.get('/questions-s/:id', question.questions)//extra
router.put('/questions/:id', authMiddleware.Auth, question.questions)
router.delete('/questions/:id', authMiddleware.Auth, question.questions)



// -------------------------EXPORT ROUTER-------------------------
module.exports = router


