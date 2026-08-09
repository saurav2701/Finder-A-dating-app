import { auth } from "@/auth";
import {prisma} from "@finder/db" 
import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const session = await auth()
    if (!session) { 
        return NextResponse.json("user not authenticated", {status: 401} )   
    } 

    const {path} = await req.json() 

    const profile = await prisma.profile.findUnique({
        where: { 
            userId: session.user?.id
        }
    }) 

    if (!profile) { 
        return NextResponse.json("profile not found ", {status: 404}) 
    } 

    const {data, error} = await supabaseAdmin.storage
    .from("photos")
    .createSignedUrl(path,60 * 60 * 24 * 365) 

    if (error || !data) { 
        return NextResponse.json({ message: "Could not generate photo URL" }, { status: 500 });

    } 

    const photo = await prisma.photo.create({
        data: {profileId: profile.id, url: data.signedUrl  }
    }) 

    return NextResponse.json({photo}, {status: 201} )
}