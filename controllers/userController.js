const { User, Post } = require('../models');

async function createUser(req, res) {
  try {
    const { name } = req.body;
    const user = await User.create({ name });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



// async function createPost(req, res) {
//   try {
//     const { title,content,userId } = req.body;
//     const user = await User.create({ name });
//     res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }


async function createPost (req, res) {

try{
  const info = {
      title: req.body.title,
      content: req.body.content,
      userId: req.body.userId,
      // roll_no: req.body.roll_no
  }
 
  const post = await Post.create(info)
  res.status(200).json({post})
  console.log(post)

}catch(error){
  console.error(error);
    res.status(500).json({ error: 'Internal server error' });
}
  
}


async function getUserPosts(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, { include: 'posts' });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    
    }
    res.status(200).json({
      userData:user,
      // postData:user.posts
    });

    console.log("***************************")
    console.log(user)
    console.log("*****************************")


    console.log("----------------------------")
    console.log(user.posts)
    console.log("-------------------------------------")

    // console.log("##################################")
    // console.log(user.posts.user)
    // console.log("#################################")

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createPost,
  createUser,
  getUserPosts,
};
