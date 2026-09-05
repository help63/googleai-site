import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request) {

  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      {success:false,error:"Unauthorized"},
      {status:401}
    );
  }

  try {

    const body = await request.json();

    const type = String(body.type || "").trim();
    const title = String(body.title || "").trim();
    const content = String(body.content || "").trim();
    const url = String(body.url || "").trim();

    if(!type || !title){
      return NextResponse.json(
        {success:false,error:"Type and title required"},
        {status:400}
      );
    }

    const file = path.join(
      process.cwd(),
      "data",
      "posts.json"
    );

    let posts=[];

    try{
      posts = JSON.parse(
        await fs.readFile(file,"utf8")
      );
    }catch{
      posts=[];
    }


    const post={
      id:crypto.randomUUID(),
      type,
      title,
      content,
      url,
      slug:title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/^-|-$/g,""),
      published:true,
      createdAt:new Date().toISOString()
    };


    posts.unshift(post);


    await fs.writeFile(
      file,
      JSON.stringify(posts,null,2)
    );


    return NextResponse.json({
      success:true,
      post
    });


  }catch(error){

    return NextResponse.json(
      {success:false,error:"Server error"},
      {status:500}
    );

  }
}

