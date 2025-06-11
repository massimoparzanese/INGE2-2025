import { useState, useEffect } from "react";

export default function UpdatePassword() {
  const [accessToken, setAccessToken] = useState(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  // Extraer el access_token del hash de la URL
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get("access_token");
    if (token) setAccessToken(token);
    else setMessage("No se encontró el token de acceso.");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !accessToken) return;

    const response = await fetch("http://localhost:3001/acceso/actualizar-psw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken, new_password: password }),
    });
    const result = await response.json();

    if (response.ok) {
      setMessage("✅ Contraseña actualizada correctamente.");
    } else {
      setMessage("❌ Error: " + result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Actualizar contraseña</h2>

        {message && <div className="mb-4 text-sm text-gray-700">{message}</div>}

        {accessToken && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nueva contraseña
              </label>
              <input
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700"
            >
              Cambiar contraseña
            </button>
          </form>
        )}
      </div>
    </div>
  );
}