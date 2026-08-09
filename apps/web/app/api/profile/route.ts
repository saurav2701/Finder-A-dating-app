import { Gender } from "@/app/generated/prisma/enums";
import { auth } from "@/auth";
import {prisma} from "@finder/db" 
import { NextRequest, NextResponse } from "next/server";

interface RegisterRequest {
    name: string;
    birthdate: Date; 
    gender: Gender;
    bio: string;
    jobTitle: string;
    school: string;
    locationName: string;
    interestedIn: Gender[];
    minAgePref: number;
    maxAgePref: number;
    maxDistanceKm: number;
  } 


export async function GET() { 
    try { 
        const session = await auth()
        if (!session) { 
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }   

        const profile = await prisma.profile.findUnique({ 
            where: {userId: session.user?.id},
            include: { photos: { orderBy: { position: "asc" } } },
        })  


        return NextResponse.json({profile}, {status: 200} )
    } 
    catch(err) { 
        return NextResponse.json(
            { message: err instanceof Error ? err.message : "Something went wrong" },
            { status: 500 }
          );
    }
    
}

export async function POST(request: NextRequest) {    

    try {  
        const session = await auth()
        if (!session) { 
            return NextResponse.json({message: "User not authenticated"}, {status: 401} )
        } 
        const body: RegisterRequest = await request.json(); 

        const profile = await prisma.profile.upsert({    
            where: {userId: session.user?.id},
            update: {
                ...body, 
                birthdate: new Date(body.birthdate),
            }, 
            create: { 
                ...body,
                birthdate: new Date(body.birthdate),
                userId: session.user?.id,
            }
        }) 
     
        return NextResponse.json({message: "User created successfully", profile}, {status: 201}) 

    } 
    catch(err) {  
        return NextResponse.json({message: err instanceof Error ? err.message : "Something went wrong"}, {status: 500})
        console.error("profile error", err )

    }  
}


