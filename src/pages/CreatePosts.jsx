import { useState, useContext } from "react";
import { createClient } from "@supabase/supabase-js";
import { CounterContext } from "../contexts/Counter";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // importando a biblioteca uuid

const supabase = createClient(
  import.meta.env.VITE_REACT_APP_SUPABASE_URL,
  import.meta.env.VITE_REACT_APP_ANON_KEY
);

function CreatePosts() {
  const navigate = useNavigate();
  const { user } = useContext(CounterContext);
  console.log(user.user_metadata.full_name);

  const [postDetails, setPostDetails] = useState({
    title: "",
    text: "",
    image: null,
  });

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    // gerando um nome único para a imagem usando uuid
    const imageName = uuidv4() + postDetails.image.name;

    // fazendo o upload da imagem para o bucket de posts no supabase
    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(imageName, postDetails.image);

    // verificando se houve algum erro no upload
    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    // obtendo a url pública da imagem que foi salva no supabase
    const { data: imageUrl, error: urlError } = await supabase.storage
      .from("posts")
      .getPublicUrl(imageName);

    // verificando se houve algum erro ao obter a url
    if (urlError) {
      alert(urlError.message);
      return;
    }

    // inserindo os dados do post na tabela Posts, incluindo a url da imagem
    const { error } = await supabase.from("Posts").insert(
      [
        {
          id: uuidv4(),
          title: postDetails.title,
          text: postDetails.text,
          date: new Date(),
          imagem_url: imageUrl, // passando a url da imagem para o campo imagem_url
          autor_id: user.id,
          autor_name: user.user_metadata.full_name,
        },
      ],
      { onConflict: "id" }
    );

    // verificando se houve algum erro ao inserir os dados
    if (error) {
      alert(error.message);
      return;
    }

    // redirecionando para a página inicial
    navigate("/success");
  };

  return (
    <div className="flex mt-12">
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-4">Criar novo post</h1>
        <form onSubmit={handlePostSubmit}>
          <input
            className="mb-4 w-full"
            type="text"
            placeholder="Título do post"
            value={postDetails.title}
            onChange={(e) =>
              setPostDetails({ ...postDetails, title: e.target.value })
            }
            required
          />
          <textarea
            className="mb-4 w-full h-60"
            placeholder="Texto do post"
            value={postDetails.text}
            onChange={(e) =>
              setPostDetails({ ...postDetails, text: e.target.value })
            }
            required
          />
          <input
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            onChange={(e) =>
              setPostDetails({ ...postDetails, image: e.target.files[0] })
            }
            required
          />
          <div>
            <button
              className="bg-yellow-500 hover:bg-yellow-700  font-bold py-2 px-4 rounded mt-6"
              type="submit"
            >
              Criar Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePosts;
