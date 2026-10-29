
"use client";

import { useEffect, useState, type SubmitEvent } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  company?: { name: string };
};

export default function UsersCrud() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Could not load users");
        setUsers(await res.json());
      } catch {
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const isEditing = editingId !== null;

    try {
      const res = await fetch(
        isEditing ? `/api/user/${editingId}` : "/api/user",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        }
      );

      if (!res.ok) throw new Error("Request failed");

      const savedUser: User = await res.json();

      if (isEditing) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === editingId ? { ...user, name, email } : user
          )
        );
      } else {
        setUsers((prev) => [
          { ...savedUser, name, email },
          ...prev,
        ]);
      }

      setName("");
      setEmail("");
      setEditingId(null);
    } catch {
      setError("Could not save user. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(user: User) {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setError("");
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this user?")) return;

    setError("");

    try {
      const res = await fetch(`/api/user/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setUsers((prev) => prev.filter((user) => user.id !== id));

      if (editingId === id) {
        setEditingId(null);
        setName("");
        setEmail("");
      }
    } catch {
      setError("Could not delete user.");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setEmail("");
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Users Dashboard
          </h1>
          <p className="mt-2 text-slate-500">
            Manage your users in one place.
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold">
            {editingId !== null ? "Edit User" : "Add New User"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <input
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Update User"
                    : "Add User"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <h2 className="text-xl font-semibold">All Users</h2>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              {users.length} users
            </span>
          </div>

          {loading ? (
            <p className="p-8 text-center text-slate-500">
              Loading users...
            </p>
          ) : users.length === 0 ? (
            <p className="p-8 text-center text-slate-500">
              No users found. Add your first user above.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {users.map((user) => (
                <article
                  key={user.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {user.name}
                      </h3>
                      <p className="break-all text-sm text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
