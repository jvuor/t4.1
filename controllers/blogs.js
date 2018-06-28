const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

blogRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog
            .find({})
            .populate('user', {username: 1, name: 1})
        const formattedBlogs = blogs.map(Blog.format)

        if (blogs) {
            response.json(formattedBlogs)
        } else {
            response.status(404).end()
        }
    } catch (exception) {
        console.log(exception)
        response.status(404)
    }
})
    

blogRouter.get('/:id', async (request, response) => {
    const id = request.params.id
    
    try {
        const blog = await Blog.findById(id)

        if (blog) {
            response.json(Blog.format(blog))
        } else {
            response.status(404).end()
        }

    } catch (exception) {
        console.log(error.message)
        response.status(400).send({error: 'malformed id'})
    }  
})

blogRouter.post('/', async (request, response) => {
    const body = request.body

    //checking authentication first
    try {
        const token = getTokenFrom(request)
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!token || !decodedToken.id) {
            return response.status(401).json({error: "token missing or invalid"})
        }   
        if(body.title === undefined) {
            return response.status(400).json({error: "title missing"})
        }
        if(body.author === undefined) {
            return response.status(400).json({error: "author missing"})
        }
        if(body.url === undefined) {
            return response.status(400).json({error: "url missing"})
        }

        const postingUser = await User.findById(decodedToken.id)
        
        const blog = new Blog({
            author: body.author,
            title: body.title,
            url: body.url,
            likes: body.likes === undefined ? 0 : body.likes,
            user: postingUser._id
        })

        const blogResponse = await blog.save()
        response.status(201).json(blogResponse)

        const user = await User.findById(postingUser._id)
        user.blogs = user.blogs.concat(blogResponse._id)

        await user.save()

    } catch (exception) {
        if (exception.name === 'JsonWebTokenError') {
            response.status(401).json({error: exception.message})
        } else {
            console.log(exception)
            response.status(500).json({error: 'error in post request'})
        }
    }
})

blogRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    try {
        await Blog.findByIdAndRemove(id)

        response.status(204).end()

    } catch(exception) {
        //console.log(exception)
        response.status(400).send({error: 'bad id'})
    }
})
  
blogRouter.put('/:id', async (request, response) => {
    try {
        const id = request.params.id
        const changedBlog = {
            author: request.body.author,
            title: request.body.title,
            url: request.body.url,
            likes: request.body.likes
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, changedBlog)

        response.status(200).json(updatedBlog)
    } catch (exception) {
        response.status(400).end()
    }
})

module.exports = blogRouter