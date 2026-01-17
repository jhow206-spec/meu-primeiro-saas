"use client";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        🚀 Meu Primeiro SaaS JHOW
      </h1>

      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Next.js está funcionando corretamente!
      </p>

      <button
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          backgroundColor: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={() => alert("Botão funcionando!")}
      >
        Testar botão
      </button>
    </main>
  );
}
