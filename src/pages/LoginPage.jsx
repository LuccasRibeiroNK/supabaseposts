import "../index.css";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { useNavigate } from "react-router-dom";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const supabase = createClient(
  import.meta.env.VITE_REACT_APP_SUPABASE_URL,
  import.meta.env.VITE_REACT_APP_ANON_KEY
);

function LoginPage() {
  const navigate = useNavigate();
  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN") {
      navigate("/compilation");
    } else if (event === "SIGNED_OUT") {
      navigate("/");
    }
  });

  return (
    <div className="App mt-44 border-2 w-80 h- border-gray-400 p-5 rounded-l bg-gray-200">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          style: {
            button: { background: "red", color: "white" },
            input: { background: "white", color: "black" },
            anchor: { color: "blue" },
            divider: { color: "red" },
            label: { color: "black" },
          },
        }}
        theme="dark"
        providers={["google"]}
      />
    </div>
  );
}

export default LoginPage;
