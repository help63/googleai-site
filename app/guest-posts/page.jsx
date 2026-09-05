import { getPosts } from "../../lib/posts";

export default async function Page(){

 const posts = await getPosts("guest");

 return (
  <main style={{padding:30}}>
   <h1>✍️ Guest Posts</h1>

   {posts.length === 0 ? (
    <p>No posts available.</p>
   ) : (

    posts.map(post => (
     <article key={post.id} style={{
       marginBottom:20,
       padding:20,
       border:"1px solid #ddd",
       borderRadius:12
     }}>

      <h2>{post.title}</h2>

      <p>{post.content}</p>

      {post.url && (
       <a href={post.url} target="_blank">
        Open Link
       </a>
      )}

     </article>
    ))

   )}

  </main>
 );
}
