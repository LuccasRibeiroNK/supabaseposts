import React, { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { CounterContext } from "../contexts/Counter";
import { useContext } from "react";
import { useState } from "react";

const supabase = createClient(
  import.meta.env.VITE_REACT_APP_SUPABASE_URL,
  import.meta.env.VITE_REACT_APP_ANON_KEY
);

function Compilation() {
  const { user, setUser } = useContext(CounterContext);
  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);

  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }

  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          setUser(value.data.user);
        }
      });
    }
    getUserData();
  }, []);
  async function getPosts() {
    const { data, error } = await supabase
      .from("Posts")
      .select("*")
      .order("date", { ascending: false });

    if (data !== null) {
      setPosts(data);
    } else {
      console.error("Erro ao buscar posts:", error);
    }
  }
  async function deletePost(postId) {
    const { data, error } = await supabase
      .from("Posts")
      .delete()
      .eq("id", postId);

    if (data == null) {
      console.log("Post deletado com sucesso!");
      getPosts();
    } else {
      console.error("Erro ao deletar post:", error);
    }
  }
  useEffect(() => {
    if (user) {
      getPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="App mt-16 ">
      <header className="App-header text-center">
        <h1 className="text-4xl font-semibold">Confira todos os posts!</h1>
      </header>
      <aside className="App-aside text-center">
        <h1 className="text-4xl font-semibold">
          Confira todos os usuarios que criam um post.
        </h1>
      </aside>

      <div className="container max-w-4xl">
        <div className="row columns-3 col- mt-24">
          <ul className="list-group">
            <div className="mt-8 max-w-xl">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`p-4 border border-gray-300 mb-4 ${
                    expandedPostId === post.id ? "expanded" : "collapsed"
                  }`} // Adicione a classe "expanded" ou "collapsed" dependendo do estado do post
                  onClick={() => {
                    // Altere o estado do post para o ID do post clicado
                    if (expandedPostId === post.id) {
                      setExpandedPostId(null);
                    } else {
                      setExpandedPostId(post.id);
                    }
                  }}
                >
                  <div className="postsWindows">
                    <h2 className="text-2xl font-semibold">{post.title}</h2>
                    {post.imagem_url && (
                      <img
                        src={JSON.parse(post.imagem_url).publicUrl}
                        alt="post Alt"
                        className="w-56 mt-4"
                      />
                    )}
                    <p className="text-gray-500 mt-2 ">
                      {expandedPostId === post.id
                        ? post.text
                        : post.text.slice(0, 60)}
                      {post.text.length > 60 &&
                        expandedPostId !== post.id &&
                        "..."}
                    </p>
                    <p className="text-gray-500 mt-2 text-sm italic">
                      Originalmente postado em: {formatDate(post.date)}
                    </p>
                    <p className="text-gray-500 text-sm italic">
                      por: {post.autor_name}
                    </p>

                    {/* Botão de exclusão */}
                    <button
                      className="bg-red-500 text-white px-3 py-1 mt-2 rounded"
                      onClick={async () => {
                        // Chame a função para excluir o post passando o ID do post
                        await deletePost(post.id);
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Compilation;
