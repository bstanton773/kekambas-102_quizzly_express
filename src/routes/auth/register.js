const { User } = require('../../models');

module.exports = (req, res) => {
    if (req.body.password !== req.body.confirmPass){
        res.send({error: "Your passwords do not match"})
        return
    }
    const { username, email, password } = req.body
    const user = new User({ username, email, password });
    user.save();
    res.send(`New User Created - ${user.username}`);
}