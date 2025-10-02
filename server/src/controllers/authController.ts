import { Request, Response } from "express"
import { prisma } from "../server"
import jwt from "jsonwebtoken"
import {v4 as uuidv4} from "uuid"
import bcrypt from "bcryptjs"



function generateToken(userId: string,email: string,role: string) {
     const accessToken = jwt.sign({
        userId,email,role
     },process.env.JWT_SECRET!, {expiresIn : "60m"})

     const refreshToken = uuidv4()
     return {accessToken,refreshToken}
}

async function setTokens(res: Response, accessToken: string, refreshToken: string, userId?: string) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",   // safer for dev
    path: "/",
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}






export const register = async (req:Request,res: Response) : Promise<void> => {
    try {
        const {name,email,password} = req.body
        const existingUser = await prisma.user.findUnique({where: {email}})
        if (existingUser) {
            res.status(400).json({
                success:false,
                error: 'user with this email allready exists'
            })
        }  
        
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await prisma.user.create({
            data : {
                name,email,password : hashedPassword,role : 'USER'
            }
        })

        res.status(201).json({
                success : true,
                message : 'user registered successfully',
                userId  : user.id
            })


    } catch (error) {
        console.error(error)
        res.status(500).json({
            error:"Registration Failed"
        })
    }
}

export const login = async (req: Request,res: Response) : Promise<void> => {
    try {
      
     const {email,password} = req.body
     const extractCurrentUser = await prisma.user.findUnique({where: {email}})
     
     if(!extractCurrentUser || !(await bcrypt.compare(password,extractCurrentUser.password))) {
        res.status(401).json({
            success : false,
            error : "Invalid Credintials"
        })

        return
     }

     const {accessToken,refreshToken} = generateToken(extractCurrentUser.id,extractCurrentUser.email,extractCurrentUser.role)
    
     await setTokens(res, accessToken, refreshToken, extractCurrentUser.id);

            res.status(200).json({
        success: true,
        message: "Logged In Successfully",
        user: {
            id: extractCurrentUser.id,
            name: extractCurrentUser.name,
            email: extractCurrentUser.email,
            role: extractCurrentUser.role,
        },
        accessToken,         // return in body as fallback
        refreshToken,
        });
    } catch (error) {
      console.error(error)
      res.status(500).json({
        error : "Login Failed"
      })
    }
}



export const refereshAccessToken = async (req: Request, res: Response) : Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ success:false, error:'No refresh token' });
    return;
  }

  try {
    const user = await prisma.user.findFirst({ where: { refreshToken } });
    if (!user) {
      res.status(401).json({ success:false, error:'Invalid refresh token' });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateToken(user.id, user.email, user.role);
    await setTokens(res, accessToken, newRefreshToken, user.id);

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
      message: "Token refreshed successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Refresh token error" });
  }
}

export const logout = async  (req:Request,res: Response) : Promise<void> => {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(200).json({
        success:true,
        message:"user logged out successfully"
    })
}