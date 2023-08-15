import React, { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { CounterContext } from "../contexts/Counter";
import { useContext } from "react";
import { useState } from "react";

const supabase = createClient(
  import.meta.env.VITE_REACT_APP_SUPABASE_URL,
  import.meta.env.VITE_REACT_APP_ANON_KEY
);

const { user, setUser } = useContext(CounterContext);
const [posts, setPosts] = useState([]);

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
    .eq("autor_id", user?.i)
    .order("date", { ascending: false });

  if (data !== null) {
    setPosts(data);
  } else {
    console.error("Erro ao buscar posts:", error);
  }
}

useEffect(() => {
  if (user) {
    getPosts();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user]);

return (
  <div className="container">
    <h1>Posts</h1>
    <div className="row">
      {posts.map((post) => (
        <div className="col-md-4" key={post.id}>
          <div className="card mb-4 shadow-sm">
            <img
              src={post.image}
              className="card-img-top"
              alt={post.title}
              style={{ height: "225px", objectFit: "cover" }}
            />
            <div className="card-body">
              <p className="card-text">{post.title}</p>
              <div className="d-flex justify-content-between align-items-center">
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Excluir
                  </button>
                </div>
                <small className="text-muted">{post.date}</small>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
