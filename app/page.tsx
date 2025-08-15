export default async function Page() {
  return (
    <main className="space-y-4 sm:space-y-6">
      <section className="card p-4 sm:p-6 flex flex-col items-center text-center gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Welkom bij Rijschool Pawiro
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Kies hoe je wilt verdergaan
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <a href="/portal" className="btn btn-secondary w-full sm:w-auto">
            Ik ben student
          </a>
          <a
            href="/instructor/login"
            className="btn btn-accent w-full sm:w-auto"
          >
            Ik ben instructeur
          </a>
          <a href="/login" className="btn btn-primary w-full sm:w-auto">
            Ik ben admin
          </a>
        </div>
      </section>
    </main>
  );
}
