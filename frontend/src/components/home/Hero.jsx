import HeroIllustration from "../../assets/illustrations/job-hunt.svg";
export default function Hero() {
  return (
    <section className="bg-linear-to-br from-blue-50 via-white to-indigo-100 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="flex flex-col items-center gap-12 md:flex-row md:justify-between">

          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              ✨ Trusted by Students & Recruiters
            </div>
            <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight text-gray-900">
              Build Your Career,
              <br />
              Not Just Your Resume.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-08 text-gray-700">
              CareerHelp connects ambitious candidates with trusted recruiters,
              helping them discover meaningful opportunities and build successful careers.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="rounded-xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-blue-700">
                Search Jobs
              </button>
              <button className="rounded-xl border border-gray-600 px-6 py-3 text-lg font-semibold transition hover:bg-gray-100">
                Learn More
              </button>
            </div>
          </div>

          {/* <div className="relative flex-1">
            <div className="mx-auto h-96 max-w-md rounded-3xl bg-linear-to-br from-blue-100 to-indigo-200 p-1 shadow-lg">
              <div className="flex h-full items-center justify-center text-8xl">💼</div>
            </div>

            <div className="absolute -left-6 top-10 rounded-2xl bg-white p-4 shadow-lg">
              <h3 className="font-bold">150+</h3>
              <p className="text-sm text-gray-500">Active Jobs</p>
            </div>

            <div className="absolute -bottom-6 right-0 rounded-2xl bg-white p-4 shadow-lg">
              <h3 className="font-bold">100+</h3>
              <p className="text-sm text-gray-500">Recruiters</p>
            </div>
          </div> */}

          <div className="relative flex-1 h-[300px] flex items-center justify-center">

            <div
              className=" absolute h-full w-72 rounded-full bg-blue-200 blur-2xl opacity-40">
            </div>

            <img src={HeroIllustration} alt="Hero Illustration" className="relative z-10 h-full w-full max-w-lg" />

            <div className="absolute right-0 top-7 z-20 rounded-2xl bg-white p-4 shadow-lg">
              <h3 className="font-bold">150+</h3>
              <p className="text-sm text-gray-500">Active Jobs</p>
            </div>

            <div className="absolute left-0 -top-5 z-20 rounded-2xl bg-white p-4 shadow-lg">
              <h3 className="font-bold">80%</h3>
              <p className="text-sm text-gray-500">Success Rate</p>
            </div>

            <div className="absolute left-6 bottom-0 z-20 rounded-2xl bg-white p-4 shadow-lg">
              <h3 className="font-bold">100+</h3>
              <p className="text-sm text-gray-500">Recruiters</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}