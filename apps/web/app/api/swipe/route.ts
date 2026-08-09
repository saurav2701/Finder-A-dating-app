import { SwipeAction } from "@/app/generated/prisma/enums";
import { auth } from "@/auth";
import {prisma} from "@finder/db" 
import { NextResponse } from "next/server";


export async function POST(req: Request) {  

    const session = await auth();  

    if (!session?.user?.id) { 
        return NextResponse.json({message: "User not authenticated"}, {status: 401} )
    } 

    const {targetId, action} = await req.json()  

    if (!targetId || typeof(targetId) !== "string" ) { 
        return NextResponse.json({message: "Target id is required"}, {status: 400} )
    } 

    if (!["LIKE", "PASS", "SUPER_LIKE"].includes(action)) { 
        return NextResponse.json({message: "Invalide action"}, {status: 400})

    }

    const swiperId = session.user.id 

    if (swiperId === targetId) { 
        return NextResponse.json({message: "Cannot swipe on yourself"}, {status: 400
        })
    } 

    try { 
        await prisma.swipe.upsert({ 
            where: {swiperId_targetId: {swiperId, targetId}}, 
            update: {action: action as SwipeAction},
            create: {swiperId, targetId, action: action as SwipeAction},

        }) 

        let match = null 

        if (action === "LIKE" || action === "SUPER_LIKE" ) { 
            const reciprocal = await prisma.swipe.findUnique({ 
                where: {swiperId_targetId: {swiperId: targetId, targetId: swiperId}}, 
            }) 

            const theyLikeBack = reciprocal && (reciprocal.action === "LIKE" || reciprocal.action === "SUPER_LIKE") 
            if (theyLikeBack) { 
                const [userAId, userBId] = [swiperId, targetId].sort()

                match = await prisma.match.upsert({ 
                   where:  {userAId_userBId: {userAId, userBId}}, 
                   update: {}, 
                   create: {userAId, userBId}

                })
            }
        }  
        return NextResponse.json({match}, {status: 200} )  
    } 

    catch(err) { 
        console.error("Swipe Err", err);
        return NextResponse.json({message: "Something went wrong"}, {status: 500});
    }
}