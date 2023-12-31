import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "y/server/api/trpc";
import { use } from "react";
import { auth, clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { TRPCError } from "@trpc/server";

const fliterUserForClient = (user: User)=>{
  return {id: user.id, username: user.username,profileImageUrl: user.profileImageUrl}
}

export const postsRouter = createTRPCRouter({

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts= await ctx.prisma.post.findMany({
    
    });

    const users =( await clerkClient.users.getUserList({

      userId: posts.map((post)=> post.authorId),  limit:100,  })).map(fliterUserForClient);
      console.log(users);
      return posts.map((post)=> {
        const author=users.find((user)=> user.id === post.authorId);
        if(!author || !author.username) throw new TRPCError({code: "INTERNAL_SERVER_ERROR",message:"Author for post not found"});
       return{ 
        post,
        author}
  }); 
  }),
});
