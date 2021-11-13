const jwt = require('jsonwebtoken');
const mysql = require('mysql')
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "records"

});

exports.protect = async(req, res, next) => {
    const token = req.cookies.token;
   // console.log(token);
    if (!token) {
       // console.log("no token")
        return res.redirect('/login')
    }

     try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       // console.log(decoded);
        var foundUser = [];
        var sql = `SELECT *FROM user_tbl WHERE user_id= '${decoded.user_id}'`;
    
        con.query(sql, (err, result) => {
            if (err) {
                throw err;
            } 
    
                if (result) {
                    for(i=0;i<result.length;i++){
                        if(result[i].username === uname){
                            foundUser.push(result[i]);
                            
                        }
                    }
                    if(foundUser.length!=0){
                        //console.log(foundUser)
                        res.user= foundUser;
                    }
                   
                }
        });
         next()
    } catch (err) {
        console.log(err)
        return res.redirect('/login')
    }
}