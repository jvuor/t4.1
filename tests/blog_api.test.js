const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogArray = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]

beforeAll(async () => {
    await Blog.remove({})

    for (var blog of initialBlogArray) {
        var BlogObject = new Blog(blog)
        await BlogObject.save()
    }
})
describe('/get tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are six blogs', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(6)
  })

  test('the first blog is by Chan-man', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body[0].author).toBe("Michael Chan")
  })


  test('specific note can be viewed', async () => {
    const resultAll = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogFromAll = resultAll.body[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogFromAll._id}`)
    
    const blogSpecific = resultBlog.body

    expect(blogSpecific).toEqual(blogFromAll)

  })
})

describe('/post tests', () => {
  test ('a new blog can be posted', async () => {
    const newBlog = {
      title: 'Testi Blogi',
      author: 'Testi Kirjoittaja',
      url: 'www.example.com',
      likes: 23
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allBlogs = await api.get('/api/blogs')

    const titles = allBlogs.body.map(r => r.title)

    expect(allBlogs.body.length).toBe(initialBlogArray.length + 1)
    expect(titles).toContain('Testi Blogi')
  })

  test ('POST without title fails', async () => {
    const newBlog = {
      author: 'Testi Kirjoittaja',
      url: 'www.example.com',
      likes: 23
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test ('POST without author fails', async () => {
    const newBlog = {
      title: 'Testi Blogi',
      url: 'www.example.com',
      likes: 23
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
  
  test ('POST without url fails', async () => {
    const newBlog = {
      title: 'Testi Blogi',
      author: 'Testi Kirjoittaja',
      likes: 23
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test ('in a POST without likes, the likes are set as 0', async () => {
    const newBlog = {
      title: 'Testblog 2',
      author: 'Testauthor',
      url: 'www.example.com/exampleblog',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allBlogs = await api.get('/api/blogs')
    const testBlog = allBlogs.body.find(x => x.title === 'Testblog 2')
    console.log(testBlog)
    savedBlog = await api
      .get(`/api/blogs/${testBlog._id}`)

    expect(savedBlog.body.author).toBe(newBlog.author)
    expect(savedBlog.body.title).toBe(newBlog.title)
    expect(savedBlog.body.url).toBe(newBlog.url)
    expect(savedBlog.body.likes).toEqual(0)

  })
})
  
afterAll(() => {
  server.close()
})