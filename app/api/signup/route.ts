import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcrypt'

interface RegisterRequest {
    email: string;
    password: string;
  }

export async function POST(request: NextRequest) { 
    try { 
      const  { email, password }: RegisterRequest = await request.json() 

      const existing = await prisma.user.findUnique({where: {email}})  

      if (existing) { 
        return NextResponse.json({message: "Email Already exists"}, {status: 400})
      } 

      const hashedPassword = await bcrypt.hash(password, 10) 

      const user = await prisma.user.create({ 
        data: { email, passwordHash: hashedPassword}
      }) 
      return NextResponse.json({message: "User created successfully", user }, {status: 201})

    }  
    catch(err) {  
        console.error("SIGNUP ERROR:", err);
        return NextResponse.json({ message: err instanceof Error ? err.message : "Unknown Error" }, { status: 500 })

    }

    
    
}