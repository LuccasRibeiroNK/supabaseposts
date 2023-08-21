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
      <div className="mt-8 compilationGrid">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`p-5 border border-gray-300 mb-4 bg-gray-200
                ${expandedPostId === post.id ? "expanded" : "collapsed"}`} // Adicione a classe "expanded" ou "collapsed" dependendo do estado do post
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
                  className="w-56 mt-4" // Defina um tamanho fixo (40 unidades) e use object-cover para ajustar a imagem
                />
              )}
              <p className="text-gray-500 mt-2 ">
                {expandedPostId === post.id
                  ? post.text
                  : post.text.slice(0, 60)}
                {post.text.length > 60 && expandedPostId !== post.id && "..."}
              </p>
              <p className="text-gray-500 mt-2 text-sm italic">
                Originalmente postado em: {formatDate(post.date)}
              </p>
              <div className="flex items-center">
                <p className="text-gray-500 text-sm italic">
                  por: {post.autor_name}
                </p>
                <img
                  src={post.autor_avatar_url}
                  alt={post.autor_name}
                  className="w-6 rounded-full mt-2 ml-0.5" // Adicione margem à esquerda para separação
                />
              </div>
              {/* Botão de exclusão */}
              <div className="inline-block align-baseline">
                <ul>
                  <li>
                    <button
                      className="bg-red-500 text-white px-3 py-1 mt-2 rounded "
                      onClick={async () => {
                        // Chame a função para excluir o post passando o ID do post
                        await deletePost(post.id);
                      }}
                    >
                      Excluir
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Compilation;
