import { auth } from "@/auth";
import {prisma} from "@finder/db" 
import { NextResponse } from "next/server";

export async function GET() { 

    try { 
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json("User not authenticated", {status: 201} )
        } 

        const currentUserId = session.user.id  

        const swiped = await prisma.swipe.findMany({ 
            where: {swiperId: currentUserId}, 
            select: {targetId: true},
        })  

        const excludedIds = swiped.map((s) => s.targetId ) 
    
        const users = await prisma.user.findMany({
            where: {
                id: {notIn: [currentUserId, ...excludedIds]},
                isActive: true, 
                profile: {isNot: null},
            }, 
            include: {profile: {include: {photos: true}}}, 
            take: 10, 
            orderBy: {lastActiveAt: 'desc'}

        }) 
        return NextResponse.json({users}, {status: 200} )

    } 
    catch(err) { 
        return NextResponse.json(
            { message: err instanceof Error ? err.message : "Something went wrong" },
            { status: 500 }
            );
    }



}