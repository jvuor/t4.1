const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    const sum = (sum, item) => sum + item.likes

    return blogs.reduce(sum, 0)
}

const favoriteBlog = (blogs) => {

    const mostLiked = (result, item) => {
        if (result === undefined || item.likes > result.likes) { result = item }
        return result
    }

    return blogs.reduce(mostLiked, undefined)
}

const mostBlogs = (blogs) => {

    var blogCount = []

    blogs.forEach(blog => {

        var matchingAuthor = blogCount.findIndex(x => x.author === blog.author)

        if (matchingAuthor === -1) {
            blogCount.push({
                author: blog.author,
                count: 1
            })
        } else {
            blogCount[matchingAuthor].count += 1
        }
                
    });

    return blogCount

}

const mostLikes = (blogs) => {
    var likeCount = []

    blogs.forEach(blog => {

        var matchingAuthor = likeCount.findIndex(x => x.author === blog.author)

        if (matchingAuthor === -1) {
            likeCount.push({
                author: blog.author,
                likes: blog.likes
            })
        } else {
            likeCount[matchingAuthor].likes += blog.likes
        }
                
    })

    var topLikes = (result, item) => {
        if (result === undefined || item.likes > result.likes) { result = item }
        return result
    }

    return likeCount.reduce(topLikes, undefined)
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}