import { Router, Request, Response } from 'express';
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import fs from "fs"
import path from "path"


const router:Router = Router();

type TUser = {
    email:string,
    password:string
}

//ensure user.json exists
const userJsonFilepath = path.join(__dirname,"../../users.json")

if (!fs.existsSync(userJsonFilepath)){
    fs.writeFileSync(userJsonFilepath,"[]","utf8")
}

//test route
router.get('/hello', (req: Request, res: Response) => {
    res.send('Hello from my Express Router!');
})

router.post("/api/user/register",
    body("email").trim().isEmail().normalizeEmail().escape(),
    body("password").isLength({min:2}).escape(),
    async (req:Request,res:Response) => {
        const errors:ValidationError[] = validationResult(req).array()

        //check email and password viability
        if(errors.length>0){
            res.status(400).json({errors:errors})
        }

        //read user data
        let userData: TUser[] = []
        
        fs.readFile("users.json","utf8",(err: NodeJS.ErrnoException | null, data: string)=> {
            if (err){
                console.log(err)
                res.status(500).json({error:"file read error"})
                return
            }

            try {
                if (data.trim()){
                    userData = JSON.parse(data)
                }
            } catch (error: any) {
                console.error(`Json parse error ${error}`)
                res.json({"msg":"json parse error"})
                return
            }

            //do user saving
        try {
            const user:TUser | undefined = userData.find((user:TUser)=>user.email === req.body.email)
            console.log(req.body.email)
            if (user){
                res.status(400).json({error:"user already exists"})
                console.log("user already exists")
                return
            }

            const salt:string = bcrypt.genSaltSync(10)
            const hashedPassword:string = bcrypt.hashSync(req.body.password,salt)
            const newuser:TUser = {
                email:req.body.email,
                password:hashedPassword
            }
            userData.push(newuser)

            //write user data
            fs.writeFile(userJsonFilepath,JSON.stringify(userData),(err:NodeJS.ErrnoException | null)=>{
                if (err){
                    console.error(err)
                    res.status(500).json({error:"file write error"})
                    return
                }
            })

            res.status(200).json(newuser)
            return

        } catch (error:any) {
            res.status(500).json({error:error.message})
            return
        }

        })
})

router.get("/api/user/list",(req:Request,res:Response)=>{
    let userData:TUser[] = []

    fs.readFile(userJsonFilepath,"utf8",(err:NodeJS.ErrnoException | null,data:string)=>{
        if (err){
            console.error(err)
            res.status(500).json({error:"file read error"})
            return
        }

        try {
            if (data.trim()){
                userData = JSON.parse(data)
            }
        } catch (error: any) {
            console.error(`Json parse error ${error}`)
            res.json({"msg":"json parse error"})
            return
        }

        res.status(200).json(userData)
    })
})

export default router;