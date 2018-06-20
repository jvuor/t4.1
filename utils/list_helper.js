const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    const sum = (sum, item) => sum + item.likes

    return blogs.reduce(sum, 0)
}

const favoriteBlog = (blogs) => {

    const mostLiked = (result, item) => {
        if (result === undefined) {
            result = item
        } else {
            if (item.likes > result.likes) {
                result = item
            }
        }
        return result
    }

    return blogs.reduce(mostLiked, undefined)
}

module.exports = {
    dummy, totalLikes, favoriteBlog
}