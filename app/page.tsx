export default async function Page() {
  return (
    <main className="space-y-6">
      <section className="card p-6 flex flex-col items-center text-center gap-4">
        <h2 className="text-2xl font-semibold">Welkom bij Rijschool</h2>
        <p className="text-gray-600">Kies hoe je wilt verdergaan</p>
        <div className="flex flex-wrap gap-3">
          <a href="/portal" className="btn btn-secondary">
            Ik ben student
          </a>
          <a href="/login" className="btn btn-primary">
            Ik ben admin
          </a>
        </div>
      </section>
    </main>
  );
}
