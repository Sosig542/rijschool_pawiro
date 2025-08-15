"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InstructorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("instructor");
  const [password, setPassword] = useState("pawiro");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      role: "instructor",
    });
    if (res?.ok) router.push("/instructor");
    else setError("Invalid credentials");
  }

  return (
    <main className="max-w-sm mx-auto bg-white border rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Instructor Login</h2>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="btn btn-primary w-full">
          Sign in
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Default credentials:</p>
        <p>Email: instructor</p>
        <p>Password: pawiro</p>
      </div>
    </main>
  );
}
