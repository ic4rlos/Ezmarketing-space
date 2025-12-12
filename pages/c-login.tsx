export default function CLogin() {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Company Login Page</h1>

      <form style={{ display: "flex", flexDirection: "column", width: 300 }}>
        <input 
          type="email" 
          placeholder="Email" 
          style={{ marginBottom: 10, padding: 8 }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          style={{ marginBottom: 10, padding: 8 }}
        />

        <button style={{ padding: 10 }}>
          Login
        </button>
      </form>
    </div>
  );
}
