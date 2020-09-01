// -------------------------IMPORTING-------------------------
//import express
const express = require('express')
//import registerController
const questionController = require('../controllers/questionController')

// -------------------------DEFINE ROUTER-------------------------
const router = express.Router()

// -------------------------CUSTOM ROUTE-------------------------
router.post('/questions', questionController.addQuestions)
router.get('/get/:id', questionController.getQuestion)


// -------------------------EXPORT ROUTER-------------------------
module.exports = router


