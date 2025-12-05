"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setNewName(data.user?.user_metadata?.full_name || "");
      setLoading(false);
    }
    loadUser();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (!user) return <p>Erro ao carregar usuário.</p>;

  async function atualizarNome() {
    await supabase.auth.updateUser({
      data: { full_name: newName },
    });
    alert("Nome atualizado!");
  }

  async function alterarSenha() {
    const emailProvider = user.app_metadata.provider === "email";

    if (!emailProvider) {
      alert("Somente contas criadas por email podem alterar senha.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(user.email);

    if (error) {
      alert("Erro ao enviar email.");
      return;
    }

    alert("Email de redefinição enviado!");
  }

  async function excluirConta() {
    const confirmDelete = confirm("Tem certeza que deseja excluir sua conta?");
    if (!confirmDelete) return;

    const { error } = await supabase.rpc("delete_user_by_id", {
      user_id: user.id,
    });

    if (error) {
      alert("Erro ao excluir conta: " + error.message);
      return;
    }

    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Perfil</h1>
      <p><strong>Nome:</strong> {user.user_metadata.full_name || "Indefinido"}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Criado em:</strong> {new Date(user.created_at).toLocaleString()}</p>

      {user.user_metadata.avatar_url && (
        <img
          src={user.user_metadata.avatar_url}
          width={100}
          height={100}
          style={{ borderRadius: "50%", marginTop: 20 }}
        />
      )}

      <hr style={{ margin: "20px 0" }} />

      <h3>Alterar nome</h3>
      <input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        style={{ padding: 8, border: "1px solid #ccc", marginRight: 10 }}
      />
      <button onClick={atualizarNome}>Salvar</button>

      <hr style={{ margin: "20px 0" }} />

      <h3>Alterar senha</h3>
      <button onClick={alterarSenha}>Enviar email de redefinição</button>

      <hr style={{ margin: "20px 0" }} />

      <h3>Excluir conta</h3>
      <button style={{ color: "red" }} onClick={excluirConta}>
        Excluir permanentemente
      </button>
    </div>
  );
}
