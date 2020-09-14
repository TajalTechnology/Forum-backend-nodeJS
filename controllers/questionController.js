// ---------------------------------IMPORTING---------------------------------
//model
const Question = require('../models').Question
const Answer = require('../models').Answer
//sequelize
const db = require('../models/index')
const {Op} = require("sequelize");

//controller
module.exports = {

    // http://localhost:3000/api/questions (POST)
    // http://localhost:3000/api/questions (PUT)
    // http://localhost:3000/api/questions (DELETE)
    questions: (req, res) => {

        let {title, body, tags} = req.body
        tags = tags.split(" ")

        let questionerId = req.user.id
        let questionerName = req.user.firstName
        let questionerEmail = req.user.email
        let id = req.params.id


        // http://localhost:3000/api/questions (POST)
        if (req.method === "POST") {

            Question.create({title, body, tags, questionerId})
                .then(questions => {

                    return res.status(201).json({
                        "question": {
                            "message": "Questions added!",
                            "details": {
                                "questionerName": questionerName,
                                "questionerEmail": questionerEmail,
                                "id": questions.id,
                                "title": questions.title,
                                "body": questions.body,
                                "tags": questions.tags
                            }
                        }
                    })//return

                }).catch(error => {
                return res.status(400).json({error})
            })

        }//if


        // http://localhost:3000/api/questions/:id (PUT)
        else if (req.method === "PUT") {

            Question.findOne({where: {id: id}})
                .then(question => {
                    question.update({title, body, tags, questionerId})
                        .then(questions => {

                            return res.status(202).json({
                                "question": {
                                    "message": "Questions updated!",
                                    "details": {
                                        "questionerName": questionerName,
                                        "questionerEmail": questionerEmail,
                                        "id": questions.id,
                                        "title": questions.title,
                                        "body": questions.body,
                                        "tags": questions.tags
                                    }
                                }
                            })//return

                        })
                }).catch(error => {
                return res.status(400).json({"error": error})
            })

        }//else if


        // http://localhost:3000/api/questions/:id (DELETE)
        else if (req.method === "DELETE") {

            Question.destroy({where: {id: id}})
                .then(() => {

                    return res.status(204).json({
                        "data": {
                            "message": "Question Deleted successfully"
                        }
                    })//return

                }).catch(error => {
                return res.status(400).json({error})
            })

        }//else if


        //bad request
        else {
            return res.status(400).json({
                "data": {
                    "message": "Sorry bad request!"
                }
            })//return
        }//else end

    },

    // http://localhost:3000/api/questions (GET)
    // http://localhost:3000/api/questions/:id (GET)
    questionList: (req, res) => {

        let title = req.query.title
        let tag = req.query.tag
        let limit =req.query.size
        let where = []

        if (title) {
            where.push({title:{[Op.like]: '%' + title + '%'}})
        }//if

        if (tag) {
            where.push({tags: {[Op.contains]: [tag]}})
        }//if

        Question.findAll({

            limit:limit,
            offset:3,
            where: where,
            attributes: ['id', 'title', 'body',
                [db.sequelize.fn('count(*) over()', db.sequelize.col('*')), 'co'],
                [db.sequelize.fn('COUNT', db.sequelize.col('Answers.id')), 'count'],
            ],
            include: [{model: Answer, attributes: []}],
            group: "Question.id",
            subQuery:false,

        })
            .then(questions => {

                // //pagination
                // let totalQuestion = questions.length
                // const totalPage = Math.ceil(totalQuestion / 5);
                // let page = parseInt(req.query.page);
                //
                // if (!page)
                //     page = 1//if
                //
                // if (page > totalPage)
                //     page = totalPage//if
                // let pagination = {
                //     "current_page": page,
                //     "totalPage": totalPage,
                //     "totalQuestion": totalQuestion,
                // }//pagination

                return res.status(201).json({

                    "questions": questions
                })//return

            }).catch(error => {
            return res.status(400).json({error})
        })

    },


    // http://localhost:3000/api/questions/:id (GET)(ok)
    questionDetails: (req, res) => {

        let id = req.params.id

        Question.findByPk(id, {include: [Answer]})
            .then(questions => {

                return res.status(200).json({
                    "details": {
                        "questionDetails": {
                            "id": questions.id,
                            "title": questions.title,
                            "body": questions.body,
                            "tags": questions.tags,
                        },
                        "total_answer": questions.Answers.length,
                        "answer_details": questions.Answers
                    }
                })//return

            }).catch(error => {
            return res.status(400).json({error})
        })

    },


    // http://localhost:3000/api/questions/tag-list (GET)
    tagList: (req, res) => {

        // let tag = req.query.tag
        const limit = 5;
        const offset = 5;
        // select distinct unnest(tags) as tag from public."Questions" limit 5 offset 5

        db.sequelize.query(`select distinct unnest(tags) as tag, count(*) over() from public."Questions" limit 5 offset 5`, {
            type: db.sequelize.QueryTypes.SELECT
        })
            .then(tags => {
                console.log(tags.length)

                return res.status(200).json({
                    "tags": tags,
                    "current_page":limit,
                    "offset":offset,

                })//return

            }).catch(error => {
            return res.status(400).json({error})
        })

    }

}

//