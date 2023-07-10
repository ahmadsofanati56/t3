import { SignIn, SignInButton, SignOutButton, auth, useUser } from "@clerk/nextjs";
import Head from "next/head";
import {type NextPage} from "next";
import Link from "next/link";
import { RouterOutputs, api } from "y/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "y/components/loading";
dayjs.extend(relativeTime)




export default function Home() {
  
  type PostWithUser = RouterOutputs["posts"]["getAll"][number];
  const PostView = (props: PostWithUser)=> {
    const {post, author} = props;
    return (
      <div key={post.id} className="flex p-4 border-b border-slate-400 gap-3">
      <Image width={56} height={56} src={author.profileImageUrl} alt="Profile Image" className="w-14 h-14 rounded-full" /> 
      <div className="flex felx-col">
        <div className="flex text-slate-300 gap-2 font-bold">
          <span>{`@${author.username}`}</span>
          <span className="font-thin">{`  . ${dayjs(post.createdAt).fromNow()}`}</span>

          </div>
          <span>{post.content}</span>
      </div>
      </div>
    
    ) 
  }
  const {isLoaded: userLoaded,isSignedIn} = useUser();

  const CreatePostWizard = () => {
    const {user} = useUser();
    console.log(user);
    if(!user) return null;

    return <div className="flex w-full gap-4 ">
            <Image width={56} height={56} src={user.profileImageUrl} alt="Profile Image" className="w-14 h-14 rounded-full" /> 

      <input type="text" placeholder="Type Something" className="bg-transparent grow p-2 outline-none"  />
    </div>
  }
  const Feed = ()=> {
    const {data ,isLoading: postsLoading} = api.posts.getAll.useQuery();
    
  
    if(postsLoading ) return <LoadingPage/>;
    if(!data) return <div>Something went wrong</div>

  
    return(
      <div className="flex flex-col">
      {[...data!]?.map((fullPost)=> (<PostView {...fullPost} key={fullPost.post.id}/>))}
    </div>
    )
  
  }
  api.posts.getAll.useQuery();

  // Return empty div if user isn't loaded
  if(!userLoaded) return <div/>;
  return (
    <> 
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app bg-red" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full md:max-w-2xl border-x border-slate-400">
          <div className="flex border-b p-4 border-slate-400">
      {!isSignedIn &&<div className="flex justify-center"> <SignInButton /></div>}
      {/* {!!user.isSignedIn &&<div className="flex justify-center p-4"> <SignOutButton /></div>} */}
      
      {isSignedIn && <CreatePostWizard/>} 
    
      </div>
      <Feed/>
      </div>
      </main>
    </>
  );
}
