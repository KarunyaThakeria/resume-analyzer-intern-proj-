import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Resumind" },
        { name: "description", content: "Smart feedback for your dream job!" },
    ];
}

export default function Home() {
    const { auth, kv } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    useEffect(() => {
        if (!auth.isAuthenticated) navigate("/auth?next=/");
    }, [auth.isAuthenticated]);

    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);
            const resumes = (await kv.list("resume:*", true)) as KVItem[];
            const parsedResumes = resumes?.map(
                (resume) => JSON.parse(resume.value) as Resume
            );
            setResumes(parsedResumes || []);
            setLoadingResumes(false);
        };

        loadResumes();
    }, []);

    // 🧠 Function to handle sign out
    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate("/auth?next=/");
        } catch (err) {
            console.error("Sign out failed:", err);
            alert("Sign out failed. Try again.");
        }
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Track Your Applications & Resume Ratings</h1>
                    {!loadingResumes && resumes?.length === 0 ? (
                        <h2>No resumes found. Upload your first resume to get feedback.</h2>
                    ) : (
                        <h2>Review your submissions and check AI-powered feedback.</h2>
                    )}
                </div>

                {loadingResumes && (
                    <div className="flex flex-col items-center justify-center">
                        <img src="/images/resume-scan-2.gif" className="w-[200px]" />
                    </div>
                )}

                {!loadingResumes && resumes.length > 0 && (
                    <div className="resumes-section">
                        {resumes.map((resume) => (
                            <ResumeCard key={resume.id} resume={resume} />
                        ))}
                    </div>
                )}

                {!loadingResumes && resumes?.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-10 gap-4">
                        <div className="flex flex-row items-center gap-4">
                            {/* ✅ Sign Out button linked to Puter store */}
                            <button
                                onClick={handleSignOut}
                                className="secondary-button w-fit text-lg font-medium bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full shadow"
                            >
                                Sign Out
                            </button>

                            {/* Shifted Upload Resume button slightly inward */}
                            <Link
                                to="/upload"
                                className="primary-button w-fit text-xl font-semibold ml-2"
                            >
                                Upload Resume
                            </Link>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}