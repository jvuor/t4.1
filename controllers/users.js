const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        if (body.password.length < 4) {
            return response.status(500).json({error: 'password too short'})
        }

        const oldUser = await User.find({username: body.username})
        console.log('olduser:', oldUser)
        if (oldUser.length > 0) {
            return response.status(500).json({error: 'username already taken'})
        }

        const saltRounds = 10
        console.log("password:", body.password)
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        var user = new User({
            username: body.username,
            name: body.name,
            adult: body.adult,
            passwordHash
        })

        if (user.adult === undefined) {user.adult = true}

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    } catch (exception) {
        console.log(exception)
        response.status(500).json({error: 'error happened'})
    }
})

usersRouter.get('/', async (request, response) => {
    try {
        const users = await User.find({})
        userList = users.map(m => User.format(m))

        response
            .status(200)
            .json(userList)

    } catch (exception) {
        console.log(exception)
        response.status(400).json({error:'error happened while getting users'})
    }
})

module.exports = usersRouter