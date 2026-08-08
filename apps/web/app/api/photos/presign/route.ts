import { auth } from "@/auth"
import { supabaseAdmin } from "@/lib/supabase/server"
import { randomUUID } from "crypto"
import { NextResponse } from "next/server"


const ALLOWED_TYPES =   ["image/jpeg", "image/png", "image/webp" ]
const Max_size_mb = 8 

export async function POST(req: Request) { 
    const session = await auth()
    if (!session?.user?.id) { 
        return NextResponse.json("user not authenticated", {status: 401})
    }
    const {fileType, fileSize} = await req.json() 

    if(!ALLOWED_TYPES.includes(fileType)) { 
        return NextResponse.json("unsupported File type", {status: 400})
    } 
    if(fileSize > Max_size_mb * 1024 * 1024) { 
        return NextResponse.json("File too large must be less than 8 mb", {status: 400})
    } 

    const extension = fileType.split("/")[1] 
    const path = `profiles/${session.user.id}/${randomUUID()}.${extension}`

    const {data, error} = await supabaseAdmin.storage
    .from("photos")
    .createSignedUploadUrl(path)

    if (error || !data) {  
        console.error("Presign err", error)
        return NextResponse.json({message: "could not create upload url"}, {status: 500} )
    } 

    return NextResponse.json({
        signedUrl: data.signedUrl, 
        token: data.token, 
        path: data.path
    })
}


