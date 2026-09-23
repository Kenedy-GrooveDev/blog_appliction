const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  let sum = blogs.reduce(reducer, 0)

  return sum
}

const favoriteBlog = (blogs) => {
  const likes = blogs.map((blog) => blog.likes)
  const mostLikes = Math.max(...likes)

  const favorite = blogs.find((blog) => blog.likes === mostLikes)

  return favorite
}

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => blog.author)

  //My first implementation, I have looked at it and I have noticed it has O(n^2)

  // const mostBlogger = [];
  // const theMost = [];

  // const sortedAuthors = [];
  // for (let i = 0; i < authors.length; i++) {
  //   const sort = [];
  //   for (let j = 0; j <= i; j++) {
  //     if (j <= i && authors[i] === authors[i - j]) {
  //       sort.push(authors[i]);
  //     }
  //   }

  //   sortedAuthors.push(sort);

  //   for (let k = 0; k <= i; k++) {
  //     if (sortedAuthors[i].length > sortedAuthors[i - k].length) {
  //       if (k === i) {
  //         mostBlogger.push(sortedAuthors[i]);
  //       }
  //     }
  //   }
  // }

  // for (let x = 0; x < mostBlogger.length ; x++) {
  //   for(let y = 0; y <= x; y++) {
  //     if (mostBlogger[x].length > mostBlogger[x - y].length) {
  //     if (y === x) {
  //       theMost.push(...mostBlogger[x]);
  //     }
  //   }
  //   }
  // }

  // console.log(theMost);

  // const theMostBlogger = {
  //   author: theMost[0],
  //   blogs: theMost.length,
  // };

  // return theMostBlogger;

  // After researching I have found an easy, more efficient way whict it has O(n)
  const authorCount = {}
  const mostBlogger = {
    author: '',
    blogs: 0,
  }
  let leaderHas = 0

  for (let i = 0; i < authors.length; i++) {
    authorCount[authors[i]] = (authorCount[authors[i]] || 0) + 1
    if (authorCount[authors[i]] > leaderHas) {
      leaderHas = authorCount[authors[i]]
    }

    if (leaderHas === authorCount[authors[i]]) {
      mostBlogger.author = authors[i]
      mostBlogger.blogs = leaderHas
    }
  }

  return mostBlogger
}

const mostLikes = (blogs) => {
  const likesCounter = {}
  let leadingLikes = 0
  const mostLikedAuthor = {}
  for (let i = 0; i < blogs.length; i++) {
    const authorName = blogs[i].author
    const likes = blogs[i].likes

    likesCounter[authorName] = (likesCounter[authorName] || 0) + likes

    if (likesCounter[authorName] > leadingLikes) {
      leadingLikes = likesCounter[authorName]
      mostLikedAuthor.author = authorName
      mostLikedAuthor.likes = leadingLikes
    }
  }

  return mostLikedAuthor
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
