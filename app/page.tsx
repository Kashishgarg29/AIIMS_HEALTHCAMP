import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex text-center flex-col">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-blue-700 dark:text-blue-400 mb-6">
                    Health Camp Management
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-[600px] text-center">
                    Streamlining school health records collaboratively and efficiently.
                </p>

                <div className="flex gap-4">
                    <Link
                        href="/login"
                        className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                    >
                        Staff Login
                    </Link>
                    <Link
                        href="/requests"
                        className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors dark:bg-slate-800 dark:ring-slate-700 dark:text-blue-400 dark:hover:bg-slate-700/50"
                    >
                        School Request
                    </Link>
                </div>
            </div>
        </main>
    );
}
