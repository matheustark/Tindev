const Dev = require('../models/Dev');

module.exports = {
   async store(req, res) {
       console.log(req.io,  req.connectedUsers)
 
         const { devId } = req.params;
         const { user } = req.headers;

         const loggedDev = await Dev.findById(user);
         const targetDev = await Dev.findById(devId);

        if(!targetDev) {
            return res.status(400).json({ error: 'Dev not exists' })
        }

        req.io.emit('message', { title: "🥰 Loves in the air...", message: `${loggedDev.nome} curtiu ${targetDev.nome} ` })

        if (targetDev.likes.includes(loggedDev._id)) {
         const loggedSocket = req.connectedUsers[user];
         const targetSocket = req.connectedUsers[devId]
         
         req.io.emit('message', { title: "❤❤❤❤❤❤❤❤", message: `${loggedDev.nome} e ${targetDev.nome} deram MATCH` })

         if(loggedSocket) {
             req.io.to(loggedSocket).emit('match', targetDev);
         }

         if(targetSocket) {
            req.io.to(targetSocket).emit('match', loggedDev);
        }

        }

        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();  

         return res.json(loggedDev)
    }
}