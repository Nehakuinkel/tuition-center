const express = require('express');
const ejs = require('ejs');
const mysql = require("mysql");
const cookieParser = require('cookie-parser')
// const session = require('express-session')
const { body, validationResult } = require('express-validator');
const {protect}=require('./middleware/authMiddleware');

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


require('dotenv').config();
const nodemailer = require('nodemailer');


var app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser())

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "records"

});


con.connect((err) => {
    if (!err) {
        console.log(" mysql connected");
    } else {
        console.log(" mysql connection failed");
    }
});

//to create database

app.get('/createDB', function(req, res) {

    var sql = 'CREATE DATABASE records';
    con.query(sql, (err, result) => {
        if (!err) {
            res.send("database created");
        }
    });
});

/////////////////////CREATE TABLESS/////////////////////////////////
//////////////////////////////////CREATE INQUIRY TABLE///////////////////////////////////////


app.get('/createTable', function(req, res) {
    // var sql = "CREATE table inquiry_tbl (id INT AUTO_INCREMENT , students_name VARCHAR(20) NOT NULL,class varchar(20) NOT NULL ,address VARCHAR(20) NOT NULL, subject VARCHAR(20) NOT NULL,phone_number DOUBLE NOT NULL, enroll VARCHAR(10), PRIMARY KEY(id) ) ";
    // con.query(sql, (err, result) => {
    //     if (!err) {
    //         console.log("Inquiry table created");
    //     } else {
    //         console.log(err);
    //     }
    // })

    // var sql = "CREATE table student_tbl (student_id INT AUTO_INCREMENT NOT NULL, students_name VARCHAR(20) NOT NULL, address VARCHAR(20) NOT NULL, class varchar(20) NOT NULL, subject varchar(20) NOT NULL, phone_number DOUBLE NOT NULL, total_fee DOUBLE , due DOUBLE, paid DOUBLE, PRIMARY KEY(student_id))";

    // con.query(sql, (err, result) => {
    //     if (!err) {
    //         console.log("Students table created");
    //     } else {
    //         console.log(err);
    //     }
    // })

    // var sql = "CREATE table teacher_tbl(teacher_id INT AUTO_INCREMENT, teachers_name VARCHAR(20), address VARCHAR(20), phone_number DOUBLE, salary DOUBLE, PRIMARY KEY(teacher_id) )";

    // con.query(sql, (err, result) => {
    //     if (!err) {
    //         console.log("teachers record created");
    //     } else {
    //         console.log(err);
    //     }
    // })

    // var sql = "CREATE table subject_tbl(subject_id INT AUTO_INCREMENT NOT NULL, subject_name VARCHAR(20),PRIMARY KEY(subject_id))";
    // con.query(sql, (err, result) => {
    //     if (!err) {
    //         console.log("subject table created");
    //     } else {
    //         console.log(err);
    //     }
    // })
    // var sql = "CREATE table class_records(id INT AUTO_INCREMENT NOT NULL, name VARCHAR(20),PRIMARY KEY(id))";
    // con.query(sql, (err, result) => {
    //     if (!err) {
    //         console.log("subject table created");
    //     } else {
    //         console.log(err);
    //     }
    // })

    // var sql = "CREATE table class_tbl(class_id INT AUTO_INCREMENT NOT NULL,id INT not null,class VARCHAR(20),time VARCHAR(20), teacher_id int not null, subject_id int not null,FOREIGN KEY(id) REFERENCES class_records(id),FOREIGN KEY(teacher_id) REFERENCES teacher_tbl(teacher_id), FOREIGN KEY(subject_id) REFERENCES subject_tbl(subject_id), PRIMARY KEY(class_id))";
    // con.query(sql, (err, result) => {
    //     if (!err) {
    //         console.log("class table created");
    //     } else {
    //         console.log(err);
    //     }
    // })

    // var sql = "CREATE table class_student_tbl( class_student_id INT AUTO_INCREMENT NOT NULL, class_id INT NOT NULL,student_id INT NOT NULL, FOREIGN KEY(student_id) REFERENCES student_tbl(student_id), FOREIGN KEY(class_id) REFERENCES class_tbl(class_id), PRIMARY KEY(class_student_id))";
    // con.query(sql, (err, result) => {
    //     if (!err) {
    //         console.log("class table created");
    //     } else {
    //         console.log(err);
    //     }
    // })



    // var sql = "CREATE TABLE subject_class_tbl(subject_id INT NOT NULL,class_id INT NOT NULL, teacher_id INT NOT NULL, FOREIGN KEY(subject_id) REFERENCES subject_tbl(subject_id), FOREIGN KEY(class_id) REFERENCES class_tbl(class_id) , FOREIGN KEY(teacher_id) REFERENCES teacher_tbl(teacher_id))";
    // con.query(sql, (err, result) => {
    //     if (!err) {
    //         res.send("class and subject recorded");
    //     } else {
    //         console.log(err);
    //     }
    // })


    // var sql = "create table user_tbl(user_id INT AUTO_INCREMENT NOT NULL , username VARCHAR(20), password VARCHAR(20), PRIMARY KEY(user_id))";
    // con.query(sql, (err, result) => {
    //     if (!err) {
    //         res.send("USER TABLE CREATED");
    //     } else {
    //         throw err;
    //     }
    // })

    // var sql = `create table attendance_tbl(att_id INT AUTO_INCREMENT NOT NULL, date VARCHAR(255),student_id  INT NOT NULL, class_id INT NOT NULL, attendance boolean, FOREIGN KEY(student_id) REFERENCES student_tbl(student_id),FOREIGN KEY(class_id) REFERENCES class_tbl(class_id), PRIMARY KEY(att_id))`;
    // con.query(sql, (err, result) => {
    //     if (!err) {
    //         res.send("attendance table created");
    //     } else {
    //         throw err;
    //     }
    // })
    
   

    var sql = `create table teacher_fee(t_id INT NOT NULL AUTO_INCREMENT,date VARCHAR(50), teacher_id INT NOT NULL,salary DOUBLE,paid boolean,FOREIGN KEY(teacher_id) REFERENCES teacher_tbl(teacher_id) ,PRIMARY KEY(t_id))`;

    con.query(sql, (err, result) => {
        if (!err) {
            res.send("Tecaher payment created");
        } else {
            throw err;
        }
    })

    var sql = `create table student_fee(s_id INT NOT NULL AUTO_INCREMENT, student_id INT NOT NULL,student_name VARCHAR(255),total_fee int,due int,paid int, FOREIGN KEY(student_id) REFERENCES student_tbl(student_id),PRIMARY KEY(s_id))`;
    con.query(sql, (err, result) => {
        if (!err) {
            res.send("student payment created");
        } else {
            throw err;
        }
    })
 });





app.get("/register", function(req, res) {
    var errors = [];
    var message = [];
    return res.render("register",{errors,message});
});
app.post("/register",
body('password').matches(/\d/).withMessage('password must contain a number').isStrongPassword().withMessage('Your password is too weak'),
async(req, res) => {
    var message =[]
     var errors = validationResult(req);
    if (!errors.isEmpty()) {
    console.log(errors.array());
     
     return res.render('register',{errors:errors.array(),message})
    }
    if(errors.isEmpty()){
        const username = req.body.uname.trim();
        const pwd = req.body.password.trim();
        var message = [];
        var errors = [];
        var salt = await bcrypt.genSalt(10);
        var sql1 = `SELECT *FROM user_tbl WHERE username= '${req.body.uname}'`;
        con.query(sql1,(err,result)=>{
            if(err){
                throw err;

            }
            if(result){
            if(result.length!=0 ){
               message.push("username already exists try different Username")
               return res.render('register',{message,errors})
            }  
            else{
        bcrypt.hash(pwd, salt, function(err, hash) {
            var sql = `INSERT INTO user_tbl(username,password) values ?`;
            var values = [
                [username, hash]
            ];    
            con.query(sql, [values], (err) => {
                if (err) {
                    throw err;
                } else {
                    //console.log(hash)
                   return res.redirect('/');
                }
            })
        })
    }
}
        });
  }
});

app.get("/login", function(req, res) {
   var Successmessage =[]
    var message = [];
    var passwordError =[]
    return res.render("login",{message,passwordError,Successmessage});
});

app.post("/login",async(req, res) => {
   var uname = req.body.uname.trim();
    var pwd = req.body.password.trim();
    var user_id = req.body.user_id;
    var message =[]
    var passwordError =[]
    var Successmessage =[]
    //console.log(req.body);
    var foundUser = [];
    var sql = `SELECT *FROM user_tbl WHERE username= '${req.body.uname}'`;

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
                    bcrypt.compare(pwd,foundUser[0].password,function(err,isMatch){
                        if(err){throw err;}
                         else if(isMatch) {
                            const token = jwt.sign({user_id: user_id }, process.env.JWT_SECRET, {
                                expiresIn: process.env.JWT_EXPIRE,
                            });
                            
                             console.log(token);
                            const options = {
                                expires: new Date(
                                    Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                                ),
                                httpOnly: true,
                            }
                            res.cookie('token', token, options)
                        
                            return res.redirect('/count')
                          } else{
                            passwordError.push('Invalid Credentials')
                            return res.render("login",{passwordError,message,Successmessage});
                          }
                    })
                }
                else{
                 message.push("Invalid Credentials");
                 return res.render("login",{message,passwordError,Successmessage});
                }
            }
    });
 
});
    ///////////////////////////////////////autheniticate user///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////CREATING TOKEN AND ASSIGN TOKEN/////////////////////////////////
app.get('/logout',(req,res)=>{
    var Successmessage =[]
    var message = [];
    var passwordError =[];
    res.clearCookie('token')
    return res.render('login',{Successmessage,message,passwordError})
   })
app.get('/editUsername', (req,res)=>{
    var errors = [];
    var message = [];
   
      return res.render('editLogin',{message,errors});
   })
  
app.post('/updatePassword',
body('uname').not().isEmpty().withMessage("please enter username"),
body('password').isStrongPassword().withMessage('Your password is too weak'),
body('Cpassword').matches('password').withMessage("Incorrect Password"),
async(req,res)=>{
  
    var message =[]
    var passwordError =[];
    var errors = validationResult(req);
   if (!errors.isEmpty()) {
   console.log(errors.array());
    
    return res.render('editLogin',{errors:errors.array(),message})
   }
    
    if(errors.isEmpty()){
       let userData = [];
       var salt = await bcrypt.genSalt(10);
       console.log(req.body);
       var sql = `select * from user_tbl where username= '${req.body.uname}'`;
       con.query(sql,(err,result)=>{
           if(err){
               throw err;
           }
           else if(result.length!=0){
               userData = result[0].username;
           }
           else{
            return res.render('editLogin',{message:"username does not exist"});
          }
          if(userData.length!=0){
              var pwd =  req.body.password;
             
              bcrypt.hash(pwd, salt, function(err, hash) {
                var sql1 = `UPDATE user_tbl SET password='${hash}' where username='${userData}'`;
                  
                con.query(sql1, (err) => {
                    if (err) {
                        throw err;
                    } else { 
                     return res.render('login',{Successmessage:"Updated Successfully", passwordError,message});
                    }
                })
            })

          }
         
       })
    }
   })
   app.get("/sendMail",(req,res)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'sharma.neha.ns729@gmail.com',
          pass: 'Im@gin@ry12345'
        }
      });
      var mailOptions = {
        from: 'sharma.neha.ns729@gmail.com',
        to: 'spiritual2055@gmail.com',
        subject: 'Sending Email using Node.js',
        text: `That was easy!`
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
   })
///////////////INQUIRY RECORDS////////////////

//////////////////////////////////insert records////////////////////////////////////////////

app.get("/add",protect, function(req, res) {
 
    var sql = `select  *from subject_tbl`;
    con.query(sql, (err, result) => {
        if (!err) {
            //console.log(result);
        } else {
            throw err;
        }
        var resu = [];
        for (i = 0; i < result.length; i++) {
            resu.push(result[i]);
        }
        var sql = "SELECT *FROM class_records";
        con.query(sql, (err, result) => {
            if (!err) {
                // console.log(result);

            } else {
                throw err;
            }
            var classData = [];

            for (i = 0; i < result.length; i++) {
                classData.push(result[i]);

            }
            //console.log(resu);
            return res.render('insertRecords/inquiryRecords', { resu: resu, classData: classData });
        });
    });
});
app.post("/submit",protect,function(req, res) {
    var today = new Date().toISOString().toString().substring(0, 10);
    let enroll;
    if (req.body.enroll == 'on') {
        enroll = 1
    } else {
        enroll = 0
    }
    var sql = `INSERT INTO inquiry_tbl(date,students_name,class,address,subject,phone_number,enroll) values( '${today}','${req.body.StudentsName}','${req.body.inputClass}', '${req.body.address}' , '${req.body.subject}','${req.body.phoneNumber}','${enroll}')`;
    con.query(sql, (err) => {
        if (err) {
            throw err;
        } else {
            if (req.body.enroll == 'on') {
                console.log("inserted")
                var sql2 = "INSERT IGNORE INTO student_tbl(student_id,students_name, address,class,subject, phone_number) SELECT DISTINCT id,students_name,address,class,subject, phone_number FROM inquiry_tbl WHERE enroll='1'";
                con.query(sql2, (err, result) => {
                    if (result) {

                        console.log(result.insertId);
                        var sql3= `insert into student_fee(date,student_id) values('${today}','${result.insertId}')`;
                        con.query(sql3,(err,result3)=>{
                            if(err){
                                throw err;
                            }
                            else{
                                
                                return res.redirect('/inquiryRecords');
                            }
                        })
                        //res.redirect('studentRecords');
                        //return res.redirect('/studentRecords');
                        //res.render('studentRecords',{data:result});
                        
                    } else {
                        throw err;
                    }
                });

             } else {
                return res.redirect('/inquiryRecords');
            }
            
        }
    })
})
   
////////////////////////////////////////UPDATE THE RECORDS/////////////////////////////////////////////////


app.get("/editInquiry/:id",protect, (req, res) => {
    
    var sql = `select *from subject_tbl`;
    con.query(sql, (err, result) => {
        if (!err) {
            // console.log(result);
        } else {
            throw err;
        }
        var resultArr = [];
        for (i = 0; i < result.length; i++) {
            resultArr.push(result[i]);
        }
        var sql = "SELECT *FROM class_records";
        con.query(sql, (err, result) => {
            if (!err) {
                // console.log(result);

            } else {
                throw err;
            }
            var classData = [];

            for (i = 0; i < result.length; i++) {
                classData.push(result[i]);

            }
            //console.log(resultArr);
            var sql = `SELECT *FROM inquiry_tbl where id=${req.params.id}`;
            con.query(sql, (err, result) => {
                if (!err) {
                    //console.log(result);
                    return res.render('./insertRecords/editInquiry', { data: result[0], classData, resultArr: resultArr });
                } else {
                    throw err;
                }
            });
        });
    });
});


app.post("/update/:id",protect, function(req, res) {
   
    let enroll;
    //console.log(req.body.enroll);
    if (req.body.enroll == 'on') {
        enroll = 1
    } else {
        enroll = 0
    }
//console.log(req.body);
    var sql = `Update inquiry_tbl SET students_name='${req.body.StudentsName}',class='${req.body.inputClass}', address='${req.body.address}' , subject='${req.body.subject}',phone_number='${req.body.phoneNumber}',enroll='${enroll}' where id='${req.params.id}'`;
    con.query(sql, (err) => {
        if (err) {
            throw err;
        } else {
            if (req.body.enroll == 'on') {
                console.log("inserted")
                var sql2 = "INSERT IGNORE INTO student_tbl(student_id,students_name, address,class,subject, phone_number) SELECT DISTINCT id,students_name,address,class,subject, phone_number FROM inquiry_tbl WHERE enroll='1'";
                con.query(sql2, (err, result) => {
                    if (!err) {

                        console.log("inserted successfully in student records");
                        //res.redirect('studentRecords');
                        //return res.redirect('/studentRecords');
                        //res.render('studentRecords',{data:result});
                        return res.redirect('/inquiryRecords');
                    } else {
                        throw err;
                    }
                });

            } else {
                return res.redirect('/inquiryRecords');
            }
        }
    });
});

/////////////////////////////////////////////DELETE THE RECORDS/////////////////////////////////

app.get("/deleteRecords/:id",protect, (req, res) => {
    let inq_id = req.params.id;

    var sql = `DELETE FROM inquiry_tbl WHERE id='${inq_id}'`;
    con.query(sql, (err, result) => {
        if (err) console.log(err);
        if (result) {
            return res.redirect('/inquiryRecords');

        }
    });
    //console.log(req.params)
});

app.get('/changeEnroll', (req, res) => {
    console.log("clicked")
});

//////////fetch the data to table///////////////////
app.get("/inquiryRecords",protect, function(req, res) {

    var sql = "SELECT * FROM inquiry_tbl";
    con.query(sql, (err, result) => {
        if (!err) {
            var sql = "SELECT * FROM class_records";
            con.query(sql, (err, result2) => {
                if (!err) {
                    var sql = `select *from subject_tbl`;
                    con.query(sql, (err, result3) => {
                        if (!err) {
                          //  console.log(result3);


                            return res.render('inquiryRecords', { data: result, classData: result2, subjectData: result3 });
                        } else {
                            throw err;
                        }
                    });
                }
            });


        } else {
            throw err;
        }
    });

});

////////////////////////////////////////////////Student Records////////////////////////////////////////////////////
///////////////////////////////////////////// FETCH  STUDENT RECORDS TO THE TABLE ///////////////////////////////////////////
app.get("/studentRecords",protect, function(req, res) {

    var sql = "SELECT *FROM student_tbl";
    con.query(sql, (err, result) => {
        //console.log(result);
        if (!err) {
            var sql2 = "SELECT * FROM class_tbl";
            con.query(sql2, (err, result2) => {
                var sql2 = "SELECT * FROM class_records";
                con.query(sql2, (err, result3) => {
                    var sql2 = `select *from subject_tbl`;
                    con.query(sql2, (err, result4) => {
                       // console.log(result);
                        return res.render('studentRecords', { data: result, classData: result2, className: result3, subjectName: result4 });

                    })
                })

            })

        } else {
            throw err;
        }
    });
})


///////////////////////////////////////////// update student Records //////////////////////////////////////////////////////////

app.get("/editStudent/:student_id",protect, (req, res) => {
    //var classArr=['THREE','FOUR','FIVE','SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];
    var a = `Select *FROM subject_tbl`;
    con.query(a, (err, result) => {
        if (!err) {
            // console.log(result);
        } else {
            throw err;
        }
        var Subj = [];

        for (i = 0; i < result.length; i++) {
            Subj.push(result[i]);
            // console.log(Subj);
        }
        var sql = "SELECT *FROM class_records";
        con.query(sql, (err, result) => {
            if (!err) {
                // console.log(result);

            } else {
                throw err;
            }
            var classData = [];

            for (i = 0; i < result.length; i++) {
                classData.push(result[i]);

            }

            var sql = `SELECT *FROM student_tbl where student_id=${req.params.student_id}`;
            con.query(sql, (err, result) => {
                if (!err) {
               //  console.log(result[0]);
                    return res.render('./insertRecords/editStudent', { data: result[0], Subj: Subj, classData });
                } else {
                    throw err;
                }
            });
        });
    });
});
app.post("/updateStudent/:student_id",protect,function(req, res) {
    console.log(req.body);
    var sql = `Update student_tbl SET students_name='${req.body.StudentsName}',address='${req.body.address}',class='${req.body.class}',subject='${req.body.subject}',phone_number='${req.body.phoneNumber}' where student_id='${req.params.student_id}'`;
    con.query(sql, (err) => {
        if (err) {
            throw err;
        } else {
            //console.log("Updated");
            return res.redirect('/studentRecords');
        }
    });
});
///////////////////////////////////DELETE STUDENT RECORDS//////////////////////////////    

app.get("/deleteStudentRecords/:student_id",protect, (req, res) => {
    console.log(req.params);
    let stu_id = req.params.student_id;
    var sql1 = `delete from student_tbl where student_id = '${stu_id}'`;
    var sql4 = `delete from student_fee where student_id = '${stu_id}'`;
    var sql2 = `delete from attendance_tbl where student_id = '${stu_id}'`;
    var sql3 = `delete from class_student_tbl where student_id = '${stu_id}'`;
    con.query(sql2, (err, result) => {
        if (err) {
            throw err;
        }
        if (result) {
            con.query(sql3, (err, result) => {
                if (err) {
                    throw err;
                }
                if (result) {
                    con.query(sql4,(err,result3)=>{
                        if(err){
                            throw err;
                        }
                        if(result3){

                       
                    con.query(sql1, (err, result) => {
                        if (err) {
                            throw err;
                        }
                        if (result) {
                            return res.redirect('/studentRecords');
                        }
                    });
                }
            })
                }
            });

        }
    });
});

//////////////////////////////////////////////TEACHER RECORDS///////////////////////////////////////

//////////////////  INSERT RECORDS IN TABLE TEACHER////////////////////////
app.get("/addTeacher",protect, (req, res) => {
    return res.render('insertRecords/teacherRecords');
});

app.post("/submitTeacher",protect,function(req, res) {
    var today= new Date().toISOString().toString().substring(0,10);
   
        var sql = `INSERT INTO teacher_tbl (date,teachers_name,address,phone_number)values('${today}','${req.body.teacherName}', '${req.body.address}','${req.body.phoneNumber}')`;
        con.query(sql, (err,result) => {
           // console.log(req.body);
            if (err) {
                throw err;
            } if(result) {
                return res.redirect('teacherRecords');
               // console.log(result.insertId);  
            }
        });
    }

);

///////////////////////////////////////FETCH DATA TO TABLE FROM TEACHER TABLE ////////////////////////////////////

app.get("/teacherRecords",protect, (req, res) => {
    var sql = "SELECT *FROM teacher_tbl";
    con.query(sql, (err, result) => {
        if (!err) {
           //console.log(result);
            return res.render('teacherRecords', { data: result });
        } else {
            throw err;
        }
    });
});

/////////////////////////////////////UPDATE TEACHER RECORDS/////////////////////////////////////////////////////////////////
app.get("/editTeacher/:teacher_id",protect, (req, res) => {
    //console.log(req.params)
    var sql = `SELECT *FROM teacher_tbl where teacher_id=${req.params.teacher_id}`;
    con.query(sql, (err, result) => {
        if (!err) {
            // console.log(result);
            return res.render('./insertRecords/editTeacher', { data: result[0] });
        } else {
            throw err;
        }
    });

});

app.post("/updateTeacher/:teacher_id",protect,function(req, res) {
    // console.log(req.params.id);
    //console.log(req.body)
    var sql = `Update teacher_tbl SET teachers_name='${req.body.teacherName}', address='${req.body.address}' ,phone_number='${req.body.phoneNumber}' where teacher_id='${req.params.teacher_id}'`;
    con.query(sql, (err) => {
        if (err) {
            throw err;
        } else {
            //console.log("Updated");
            return res.redirect('/teacherRecords');
        }
    });
});

///////////////////////////////////Delete teacher Records /////////////////////////
app.get("/deleteTeacherRecords/:teacher_id",protect, (req, res) => {
    console.log(req.params);
    var sql1 = `delete from teacher_tbl where teacher_id = '${req.params.teacher_id}'`;
    var sql2 = `delete from class_tbl where teacher_id = '${req.params.teacher_id}'`;
    var sql3 = `select * from class_tbl where teacher_id = '${req.params.teacher_id}'`;
    var sql5=`delete from teacher_fee where teacher_id= '${req.params.teacher_id}'`;
    var class_id;
    con.query(sql3, (err, result1) => {
        if (err) {
           // console.log(err);
        }
        if (result1) {
           
            if (result1.length != 0) {
                class_id = result1[0].class_id
            } else {
                class_id = ''
            }

            var sql4 = `delete from attendance_tbl where class_id = '${class_id}'`;
            con.query(sql4, (err, result2) => {
                if (err) {
                    console.log(err);
                }
                if (result2) {
                    var sql4 = `delete from class_student_tbl where class_id = '${class_id}'`;
                    con.query(sql4, (err, result5) => {
                        if (err) {
                            console.log(err);
                        }
                        if (result5) {
                            con.query(sql2, (err, result3) => {
                                if (err) {
                                    console.log(err);
                                }
                                if (result3) {
                                    con.query(sql5,(err,result5)=>{
                                        if(err){
                                            console.log(err);
                                        }
                                        if(result5){
                                    con.query(sql1, (err, result4) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                        if (result4) {
                                 return res.redirect('/teacherRecords');
                                }
                            })  
                                        }
                                    });
                                }
                            });

                        }
                    });
                }
            });
        }
    });
});

////////////////////////////subject Records////////////////////////////////////

app.get("/addSubject",protect, (req, res) => {
    return res.render('insertRecords/subjectRecords');
});

app.post("/submitSubject",protect, (req, res) => {
    var sql = `INSERT INTO subject_tbl values( '${req.body.id}','${req.body.SubjectName}')`;
    con.query(sql, (err) => {
        if (err) {
            throw err;
        } else {
            //console.log("inserted")
            return res.redirect('/addSubject');
        }
    });
});

app.get("/subjectRecords",protect, (req, res) => {
    var sql = "SELECT *FROM subject_tbl";
    con.query(sql, (err, result) => {
        if (!err) {
            //console.log(result);
            res.render('subjectRecords', { data: result });
        } else {
            throw err;
        }
    });
});
app.get("/deleteSubjectRecords/:subject_id",protect, (req, res) => {
    //console.log(req.params);
    var sql = `delete from subject_tbl where subject_id = '${req.params.subject_id}'`;
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {
            return res.redirect('/subjectRecords');
        }
    });
});
//////////////////////////////////////////////////ADD CLASS//////////////////////////////////////////////
app.get("/addClassRecords",protect, (req, res) => {
    res.render('insertRecords/class');
});

app.post("/submitClassRecords",protect, (req, res) => {
    var sql = `INSERT INTO class_records values( '${req.body.id}','${req.body.className}')`;
    con.query(sql, (err) => {
        if (err) {
            throw err;
        } else {
            //res.send("inserted")
            return res.redirect('/addClassRecords');
        }
    });
});

/////////////////////////////////////////////////Class Records//////////////////////////////////////////////////////////

app.get("/addClass",protect, (req, res) => {
   
    //var addClass = ['THREE','FOUR','FIVE','SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];
    var sql = "SELECT *FROM class_records";
    con.query(sql, (err, result) => {
        if (!err) {
            //console.log(result);

        } else {
            throw err;
        }
        var classData = [];

        for (i = 0; i < result.length; i++) {
            classData.push(result[i]);
        }
        //console.log(classData);
        var a = `SELECT teacher_id, teachers_name FROM teacher_tbl`;
        con.query(a, (err, result) => {
            if (!err) {
                // console.log(result);
            } else {
                throw err;
            }
            var teacherData = [];

            for (i = 0; i < result.length; i++) {
                teacherData.push(result[i]);
                //console.log(teacherData);
            }

            var b = `SELECT subject_id, subject_name FROM subject_tbl`;
            con.query(b, (err, result) => {
                if (!err) {
                    //console.log(result);

                } else {
                    throw err;
                }
                var subjectData = [];
                for (i = 0; i < result.length; i++) {
                    subjectData.push(result[i]);
                    //console.log(subjectData);
                }

                return res.render('insertRecords/classRecords', { classData: classData, teacherData: teacherData, subjectData: subjectData });
            });
        })
    });
});



app.post("/submitClass",protect,(req, res) => {
    var today= new Date().toISOString().toString().substring(0,10);
    var sql = `insert into class_tbl (date,id,class,time,teacher_id,subject_id,total_student) values('${today}','${req.body.className}','${req.body.name}','${req.body.time}','${req.body.teacher}','${req.body.subject}','${req.body.capacity}')`;
    con.query(sql, (err, result) => {
        if(err){throw err}
        if (result) {
            var sql2 = `INSERT INTO teacher_fee (teacher_id,class_id) values('${req.body.teacher}','${result.insertId}')`;
            con.query(sql2,(err,result1)=>{
                if(result1){
                    return res.redirect('/classRecords')
                }
           else {
            throw err;
        }
    });
}
});
})

app.get("/deleteClass/:class_id/:teacher_id",protect,(req,res)=>{
    console.log(req.params)
    
    var sql1 =`delete from teacher_fee where teacher_id='${req.params.teacher_id}' AND class_id='${req.params.class_id}'`;
    var sql2 =`delete from class_student_tbl where class_id='${req.params.class_id}'`
    var sql3 = `delete from attendance_tbl where class_id='${req.params.class_id}'`
    var sql = `delete from class_tbl where class_id ='${req.params.class_id}'`;
    con.query(sql1,(err,result1)=>{
        if(err){
            throw err;
        }
        if(result1){
            
                con.query(sql2,(err,result2)=>{
                    if(err){
                        throw err;
                    }
                    if(result2){
                        
                        con.query(sql3,(err,result3)=>{
                            if(err){
                                throw err;
                            }
                            if(result3){
                                console.log("deleted successfully")
                         
                        con.query(sql,(err,result)=>{
                            if(err){
                                throw err;
                            }
                            if(result){
                                res.redirect('/classRecords');
                            }
                        })
                    }
                })
              }
            })
        }
    })
})

app.get("/classRecords",protect, function(req, res) {
 var sql = `select class_id,t.teacher_id,class,name,time,teachers_name,subject_name,total_student from class_tbl c join class_records r ON c.id=r.id join teacher_tbl t ON c.teacher_id=t.teacher_id join subject_tbl s ON c.subject_id=s.subject_id `;
    con.query(sql, (err, result) => {
        if(err){throw err;}
        if (result) {
         //console.log(result);
            var data = [];
            for (i = 0; i < result.length; i++) {
                data.push(result[i]);
            }
            console.log(data);
            
                return res.render('class', { data: data ,studentClass:result});
              
        } 
    });
});



app.get("/",protect, function(req, res) {
    return res.render("home");
});







app.get('/addClassName/:student_id/:class_id',protect, function(req, res) {
    // var sql1=`select *from class_records where id=${req.params.class_id}`;
    // con.query(sql1,(err,result3)=>{
    //     if(!err){
    //         //console.log(result3);
    //     }
    //     else{
    //         throw err;
    //     }
    
    //var msg = "No class Available"
    console.log(req.params.class_id, req.params.student_id);
    var message =[]
    var sql = `Select * from class_tbl c join class_records cr ON c.id=cr.id join subject_tbl s  ON c.subject_id=s.subject_id where c.id=${req.params.class_id}`;
    con.query(sql, (err, result1) => {
        if(err){
            throw err;
        }
        // if(result1.length==0){
        //     res.send(msg);
        // }
        if (result1) {
            var sql = `Select * from student_tbl where student_id=${req.params.student_id}`;
            con.query(sql, (err, result2) => {
                if(err){throw err;}
                if (result2) {
                    
                    return res.render('insertRecords/manageClass',{classRecord:result1,studentRecords:result2,message})
                }

            });
        } 
     });
});


app.post('/insertClassStudent',protect, function(req, res) {
    //console.log(req.body);
    var a=[]
    var message =[]
   console.log(req.body);
    var sql1=`SELECT COUNT(student_id) FROM class_student_tbl where class_id = '${req.body.class_id}' `;
    con.query(sql1,(err,result1)=>{
        if(err){
            throw err;
        }
        if(result1){
            a=Object.values(result1[0])[0];
           var sql2 = `select * from class_tbl where class_id='${req.body.class_id}'`;
           con.query(sql2,(err,result2)=>{
               if(err){
                   throw err;
               }
               if(result2){
                  // console.log(result2[0].total_student);




                   if(result2[0].total_student<=a){
                     // message.push("class is Full")
                       //res.send(message);
                       var message =[]
                        var sql = `Select * from class_tbl c join class_records cr ON c.id=cr.id join subject_tbl s  ON c.subject_id=s.subject_id where c.id=${result2[0].id}`;
                        con.query(sql, (err, result3) => {
                            if(err){
                                throw err;
                            }
                            // if(result3.length==0){
                            //     res.send(msg);
                            // }
                            if (result3) {
                                var sql = `Select * from student_tbl where student_id=${req.body.student_id}`;
                                con.query(sql, (err, result4) => {
                                    if(err){throw err;}
                                    if (result4) {
                                        
                                        return res.render('insertRecords/manageClass',{classRecord:result3,studentRecords:result4,message:"Class is full"})
                                    }

                                });
                            } 
                        });



                        //return res.redirect(`/addClassName/${req.body.student_id}/${result2[0].id}`);
                       // return res.render('insertRecords/manageClass',{classRecord:req.body.student_id,studentRecords:result2,message})
                     //  return res.render('insertRecords/manageClass',{classRecord:result1,studentRecords:result2,message:'Class is full'})
                   }
                   else if(result2[0].total_student>a){
                   var sql = `Insert into class_student_tbl (class_id,student_id) values(${req.body.class_id},${req.body.student_id})`;
                    con.query(sql, (err, result) => {
                        if(err){throw err;}
                            if(result){return res.redirect('/studentRecords');}
                        })  
                    } 
                    else{
                        res.redirect('/studentRecords')
                    }
                    } 
                })
               }
           })
      
});

app.get('/manageStudentRecord/:class_id',protect, function(req, res) {
    var stu = [];

    var sql = `select name,subject_name,total_student from class_tbl c join class_records cr ON c.id=cr.id join subject_tbl s ON c.subject_id=s.subject_id where class_id='${req.params.class_id}'`;
    con.query(sql, (err, result3) => {
        if (!err) {
            console.log(result3);
            var sql1 = `select *from class_student_tbl cs join class_tbl c ON cs.class_id=c.class_id join student_tbl s ON cs.student_id=s.student_id where cs.class_id='${req.params.class_id}'`
            con.query(sql1, (err, result) => {
                if (!err) {
                    console.log(result);

                    return res.render('ManageStudent', { data: result, records: result3 });

                } else {
                    throw err;
                }
            })


        }
    })

});

app.get('/viewClassRecord/:student_id',protect, function(req, res) {
    //console.log(req.params);

    var sql = `select *from class_student_tbl cs join class_tbl c ON cs.class_id=c.class_id join student_tbl s ON cs.student_id=s.student_id where cs.student_id= '${req.params.student_id}' `;

    con.query(sql, (err, result) => {
        if (!err) {
            // console.log(result);
            var data = [];
            for (i = 0; i < result.length; i++) {
                data.push(result[0].class_id);
            }

            console.log(data);
            var sql1 = `select class,name,subject_name,teachers_name from class_tbl c join subject_tbl s ON c.subject_id=s.subject_id join teacher_tbl t ON c.teacher_id=t.teacher_id join class_records cr ON c.id=cr.id where c.class_id='${data}'`;
            con.query(sql1, (err, result1) => {
                if (!err) {
                    console.log(result1);

                    return res.render('data', { classStudentRecords: result, Name: result1 });

                } else {
                    throw err;
                }
            })
        }
    });


});



app.get('/attendanceRecords/:class_id',protect, function(req, res) {
    console.log(req.params);
    var classRecords = req.params.class_id;
    var data = [];
    var sql = `select *from class_student_tbl cs join class_tbl c ON cs.class_id=c.class_id join student_tbl s ON cs.student_id=s.student_id where cs.class_id=${req.params.class_id}`;
    con.query(sql, (err, result) => {
        if (!err) {
            console.log(result)
            for (i = 0; i < result.length; i++) {
                data.push(result[i]);
            }
            
            var sql2 = `select * from attendance_tbl`;
            con.query(sql2, (err, result2) => {
                var checkDate = [];

                var today = new Date().toISOString().toString().substring(0, 10);
                //console.log(today);
                if (!err) {
                    for (i = 0; i < result2.length; i++) {
                        if (result2[i].date == today && result2[i].attendance == '1') {
                            checkDate.push(result2[i].student_id);
                        }

                    }
                    console.log(checkDate);

                    return res.render('insertRecords/attendance', { data, classRecords, checkDate, today });

                }
            })

        } else {
            throw err;
        }
    })


});



app.post('/submitAttendance',protect, (req, res) => {
 // console.log(req.body);
  var sql;
  var studentType = typeof(req.body.students);
  console.log(studentType)
 // var studentId=[]
  var studentId = req.body.student_id;
  console.log(studentId);
  var students = req.body.students;
  console.log(students);
  console.log(studentId.length)
  var today = new Date().toISOString().toString().substring(0,10);
  if(studentId.length == 2){
    if(studentType ==="undefined"){
        sql = `insert into attendance_tbl(date,student_id,class_id,attendance) values('${today}','${studentId}','${req.body.class_id}','0')`;
      }
      else{
      if(students.includes(studentId)){
          sql = `insert into attendance_tbl(date,student_id,class_id,attendance) values('${today}','${studentId}','${req.body.class_id}','1')`;
      }
      else{
        sql = `insert into attendance_tbl(date,student_id,class_id,attendance) values('${today}','${studentId}','${req.body.class_id}','0')`
      }
    }
      con.query(sql,(err,result)=>{
          if(err){
              throw err;
          }
  })
  return res.redirect('/classrecords');
  }
  else{
  studentId.forEach((c)=>{
      if(studentType ==="undefined"){
        sql = `insert into attendance_tbl(date,student_id,class_id,attendance) values('${today}','${c}','${req.body.class_id}','0')`;
      }
      else{
      if(students.includes(c)){
          sql = `insert into attendance_tbl(date,student_id,class_id,attendance) values('${today}','${c}','${req.body.class_id}','1')`;
      }
      else{
        sql = `insert into attendance_tbl(date,student_id,class_id,attendance) values('${today}','${c}','${req.body.class_id}','0')`
      }
    }
      con.query(sql,(err,result)=>{
          if(err){
              throw err;
          }
          
      })
      
  })
  return res.redirect('/classrecords');
}
});

app.get('/viewAttendance/:class_id',protect, (req, res) => {
    var classRecord = req.params.class_id;
    var sql = `select *from class_student_tbl cs join class_tbl c ON cs.class_id=c.class_id join student_tbl s ON s.student_id=cs.student_id where cs.class_id='${req.params.class_id}'`;
    con.query(sql, (err, result) => {
        if (!err) {
            console.log(result);
            con.query(sql, (err, result) => {
                let studentRecords = [];
                if (!err) {
                    result.forEach((s) => {
                        studentRecords.push(s);
                    })
                    return res.render('calendar', { classRecord, studentRecords });

                }
            })

        }
    });
});



app.post('/viewAttendee',protect, (req, res) => {
  // console.log(req.body);
    var dateRecord = req.body.date;
    var classRecords = req.body.class_id;
    var studentRecords = [];
    var viewRecords = [];
    var message =[];
  var sql = `select *from attendance_tbl a join student_tbl s ON a.student_id=s.student_id where a.class_id='${req.body.class_id}'`;
  con.query(sql,(err,result)=>{
      if(err){
          throw err;
      }
      if(!err){
          //console.log(result);
         if(result.length!=0){
          result.forEach((n) => {
              console.log(n)
                        if (req.body.date == n.date) {
                            console.log(n);
                            viewRecords.push(n);
                            studentRecords.push(n.student_id);
                         } 
                        
                        else if(req.body.date != n.date){
                            console.log("hello")
                          message="Todays Record Not Found"
                        }
                       
                        console.log(message);
                     })
                    }
                     
                     return res.render('attendance', { viewRecords, dateRecord, classRecords, studentRecords,message});  
      }
      res.end();
  })
})



app.get('/count',protect,(req,res)=>{
    var a,b,c,d,e,f;
    var sql=`SELECT COUNT(student_id) FROM student_tbl `;
    con.query(sql,(err,result1)=>{
        if(!err){
             a=Object.values(result1[0])[0];
           
        }
 
    var sql=`SELECT COUNT(teacher_id) FROM teacher_tbl `;
    con.query(sql,(err,result2)=>{
        if(!err){
             b=Object.values(result2[0])[0];
        }
    
    var sql=`SELECT COUNT(id) FROM inquiry_tbl `;
    con.query(sql,(err,result3)=>{
        if(!err){
            console.log(result3)
             c=Object.values(result3[0])[0];
        }
      var sql = `select COUNT(class_id) FROM class_tbl`;
      con.query(sql,(err,result4)=>{
          if(!err){
              console.log(result4)
              d=Object.values(result3[0])[0];
          }
          var sql = `select COUNT(id) FROM class_records`;
      con.query(sql,(err,result5)=>{
          if(!err){
              console.log(result5)
              e=Object.values(result5[0])[0];
          }
          var sql = `select COUNT(subject_id) FROM subject_tbl`;
          con.query(sql,(err,result6)=>{
              if(!err){
                  console.log(result6)
                  f=Object.values(result6[0])[0];
              }
     
  console.log(a);
  console.log(b);
  console.log(c);
  console.log(d);
   return res.render('dashboard',{a,b,c,d,e,f});
        })
    })
}) 
})
})
})
})


app.get('/viewFee',protect,(req,res)=>{
   var sql = `select *from teacher_tbl`;
   con.query(sql,(err,result)=>{
       if(err){
           throw err;
       }
       if(result){
       
            return res.render('insertRecords/feeRecords',{teacherData:result})
            }
        })
})


app.get('/viewDetails/:teacher_id',protect,(req,res)=>{
    var subjectData = []
    var classData = []
    var salary = 0
    var due= 0
    
    var teacherData=[];
    var teacherId= req.params.teacher_id;
    var sql = `select *from class_tbl where teacher_id = '${req.params.teacher_id}'`;
    con.query(sql,(err,result)=>{
        if(err){
            throw err;
        }
        if(result){
            //console.log(result)
           for(i=0;i<result.length;i++){
               classData.push(result[i]);
           }
            var sql1 = `select  teachers_name from teacher_tbl where teacher_id = '${req.params.teacher_id}'`;
            con.query(sql1,(err,result1)=>{
                if(err){
                    throw err;
                }
                if(result1){
                  result1.forEach((r)=>{
                      teacherData.push(r.teachers_name);
                  })
                   // console.log(teacherData)
                    var sql2 = `select *from subject_tbl`;
                    con.query(sql2,(err,result2)=>{
                        if(err){
                            throw err;
                        }
                        if(result2){
                            //console.log(result2);
                            for(i=0;i<result2.length;i++){
                                subjectData.push(result2[i]);
                               
                            }
                    //      console.log(subjectData)
                          var sql3 =`select *from teacher_fee where teacher_id = '${req.params.teacher_id}'`;
                          con.query(sql3,(err,result3)=>{
                              if(err){
                                  throw err;
                              }
                              if(result3){
                               for(i=0;i<result3.length;i++){
                                  // console.log(result3);
                                
                                   salary+=result3[i].salary
                                   due+=result3[i].due 
                               }
                         
                          
                         return res.render('insertRecords/salaryDetails',{classData,teacherData, subjectData,teacherId,feeData:result3,salary,due});
                        
                          }
                        })
                        }
                    })
                }
            })
        }
    })

   
})

app.get('/editTeacherFee/:teacher_id/:class_id',protect,(req,res)=>{
 console.log(req.params);
 var classId=[]
 var teacherId = []
 var sql = `select *from class_tbl c join teacher_tbl t ON c.teacher_id=t.teacher_id join subject_tbl s ON s.subject_id=c.subject_id where c.class_id='${req.params.class_id}'`;
 con.query(sql,(err,result)=>{
     if(err){
         throw err;
     }
     if(result){
        for(i=0;i<result.length;i++){
            classId.push(result[i].class_id)
            teacherId.push(result[i].teacher_id)
        }
        var sql1 = `select *from teacher_fee where class_id = '${classId}' AND teacher_id = '${teacherId}'`;
        con.query(sql1,(err,result1)=>{
            if(err){
                throw err;
            }
            if(result1){
                console.log(result1)
               return res.render('insertRecords/editFee',{data:result, salaryData:result1})
            }
        })
         
     }
 })
})
app.post('/updateSalary/:teacher_id/:class_id',protect,(req,res)=>{
    console.log(req.body);
    let paid;
    let due;
    if (req.body.paid == 'on') {
        paid = 1
        due = 0
    } else {
        paid = 0
    }
   
    var today= new Date().toISOString().toString().substring(0,10);
    var sql= `update teacher_fee SET date='${today}',salary='${req.body.salary}',due='${due}',paid='${paid}' where class_id='${req.params.class_id}' AND teacher_id='${req.params.teacher_id}'`;
    con.query(sql,(err,result)=>{
        if(result){
           console.log(result)
            return res.redirect('/viewFee');
        }
        else{
            throw err;
        }
    })
})





app.get('/chooseStudentClass',protect,(req,res)=>{
    var data=[];
    var sql=`select *from class_records`;
    con.query(sql,(err,result)=>{
        if(err){
            throw err;
        }
        else{
            console.log(result);
            var sql1=`select *from subject_tbl `;
            con.query(sql1,(err,result1)=>{
                if(err){
                    throw err;
                }
                if(result1){
                         res.render('insertRecords/chooseClass',{classData:result,subjectData:result1});
                }
               })
               }
           })
         });


app.post('/viewStudentFee',protect,(req,res)=>{
    var data=[];
    var sql=`select *from student_tbl s join student_fee sf ON s.student_id=sf.student_id where class='${req.body.inputClass}'`;
    con.query(sql,(err,result)=>{
        if(err){
            throw err;
        }
        if(result){
            console.log(result);
            for(i=0;i<result.length;i++){
                if(result[i].subject==req.body.subject){
                    data.push(result[i]);
                    console.log(data);
                }
            }
                   return res.render('insertRecords/studentFee',{data});
        }
                else{
                    console.log("No student Records");
                }
            
    })

})

app.get('/editStudentFee/:student_id',protect,(req,res)=>{
   //console.log(req.params);
    var sql=`select *from student_tbl s join student_fee sf ON s.student_id=sf.student_id where sf.student_id='${req.params.student_id}'`;
    con.query(sql,(err,result)=>{
    if(err){
        throw err;
    }
    if(result){
        //console.log(result);
        return res.render('insertRecords/editStudentFees',{data:result});
    }
})
})
app.get('/viewStudentPayment',protect,(req,res)=>{
    var data=[];
    var sql=`select *from student_fee sf join student_tbl s ON sf.student_id=s.student_id`;
    con.query(sql,(err,result)=>{
        if(err){
            throw err;
        }
        if(result){
            for(i=0;i<result.length;i++){
               
                    data.push(result[i]);
            }
            return res.render('viewStudentFee',{data});
        }
    });
});
app.post('/updateStudentFees/:student_id',protect,(req,res)=>{
   // console.log(req.body);
   var due = (req.body.total_fee)-(req.body.paid);
    var today = new Date().toISOString().toString().substring(0, 10);
    var sql=`update student_fee SET date='${today}',total_fee='${req.body.total_fee}',due='${due}',paid='${req.body.paid}' where student_id='${req.params.student_id}'`;
    con.query(sql,(err,result)=>{
        if(err){
            throw err;
        }
        else{
           return res.redirect('/viewStudentPayment');
        }
    })
})




app.listen(3000, function() {
    console.log("server started at port 3000");
});