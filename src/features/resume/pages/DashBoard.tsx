"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    fetchResumes as apiFetchResumes,
    createResume as apiCreateResume,
    deleteResume as apiDeleteResume
} from "../api/resume.api";
import { setResumes, setLoading, setError } from "../state/resume.slice";
import { IResume } from "@/types/resume.types";

export default function DashBoard() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { handleLogout } = useAuth();

    const user = useAppSelector((state) => state.auth.user);
    const { resumes, loading, error } = useAppSelector((state) => state.resume);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const loadResumes = async () => {
        dispatch(setLoading(true));
        try {
            const response = await apiFetchResumes();
            if (response.success && response.data) {
                dispatch(setResumes(response.data));
            }
        } catch (err: any) {
            dispatch(setError(err.message || "Failed to load resumes."));
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        loadResumes();
    }, [dispatch]);

    const handleCreateResume = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        setActionLoading("create");
        try {
            const response = await apiCreateResume(newTitle.trim());
            if (response.success && response.data) {
                setIsCreateModalOpen(false);
                setNewTitle("");
                // Redirect straight to editing it
                router.push(`/resume/${response.data._id}`);
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to create resume.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteResume = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Avoid triggering card click
        if (!confirm("Are you sure you want to delete this resume?")) return;

        setActionLoading(id);
        try {
            const response = await apiDeleteResume(id);
            if (response.success) {
                dispatch(setResumes(resumes.filter((r) => r._id !== id)));
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete resume.");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            {/* Navbar */}
            <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-white shadow-lg shadow-rose-500/20">
                        RC
                    </div>
                    <div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-rose-400">
                            ResumeCraft
                        </span>
                        <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold tracking-wider uppercase">
                            Pro
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-rose-400">
                            {user?.name ? user.name[0].toUpperCase() : "U"}
                        </div>
                        <div className="text-left leading-none">
                            <p className="text-sm font-semibold text-slate-200">{user?.name}</p>
                            <p className="text-[11px] text-slate-500">{user?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={async () => {
                            await handleLogout();
                            router.push("/login");
                        }}
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-700 hover:border-rose-900/60 transition duration-300 text-xs font-semibold"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
                <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 border border-slate-800 p-8 sm:p-12 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full filter blur-[80px]" />
                    <div className="absolute bottom-0 left-20 w-80 h-80 bg-purple-500/5 rounded-full filter blur-[80px]" />

                    <div className="max-w-xl z-10">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                            Build Your Perfect,{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-amber-400">
                                ATS-Ready Resume
                            </span>
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                            Create professional templates, score your resume against real job descriptions using Gemini AI, and export in print-ready PDF instantly.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="z-10 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-bold text-white shadow-lg shadow-rose-500/20 hover:scale-[1.02] transition duration-300 flex items-center gap-2 whitespace-nowrap self-start md:self-auto"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Resume
                    </button>
                </div>

                {/* Resume List Title */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                        Your Workspaces
                        <span className="px-2 py-0.5 text-xs rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                            {resumes.length}
                        </span>
                    </h3>
                </div>

                {/* Resumes Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-48 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />
                        ))}
                    </div>
                ) : resumes.length === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center text-center p-16 rounded-3xl border border-dashed border-slate-800 bg-slate-900/20 max-w-xl mx-auto my-12">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-6 shadow-inner">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h4 className="text-xl font-bold text-slate-200 mb-2">No resumes found</h4>
                        <p className="text-slate-400 text-sm mb-6 max-w-xs leading-relaxed">
                            Start coding your career! Create your first resume using our premium fields or Gemini AI autofill.
                        </p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-5 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition"
                        >
                            Create Resume
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume) => (
                            <div
                                key={resume._id}
                                onClick={() => router.push(`/resume/${resume._id}`)}
                                className="group relative rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/40 p-6 cursor-pointer shadow-lg transition-all duration-300 flex flex-col justify-between h-48 hover:-translate-y-1"
                            >
                                <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => handleDeleteResume(resume._id!, e)}
                                        disabled={actionLoading === resume._id}
                                        className="p-2 rounded-lg bg-slate-950/60 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/60 transition"
                                    >
                                        {actionLoading === resume._id ? (
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-slate-100 group-hover:text-rose-400 transition duration-200 line-clamp-1">
                                        {resume.title || "Untitled Resume"}
                                    </h4>
                                    <p className="text-slate-400 text-xs mt-1.5 font-medium flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {resume.personalInfo?.fullname || "No Name Set"}
                                    </p>
                                </div>

                                <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between mt-auto">
                                    <span className="text-[11px] text-slate-500 font-medium">
                                        Updated: {new Date(resume.updatedAt!).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                        {resume.skills && resume.skills.length > 0 && (
                                            <span className="px-2 py-0.5 text-[9px] rounded bg-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                                                {resume.skills.length} Skills
                                            </span>
                                        )}
                                        {resume.workExperience && resume.workExperience.length > 0 && (
                                            <span className="px-2 py-0.5 text-[9px] rounded bg-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                                                {resume.workExperience.length} Exp
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Resume Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">Create New Workspace</h3>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-slate-400 hover:text-white transition"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleCreateResume} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    Resume Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newTitle}
                                    placeholder="e.g. Senior Frontend Engineer, Business Analyst"
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full h-12 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 px-4 text-sm text-slate-200 outline-none transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={actionLoading === "create"}
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-bold text-white shadow-lg shadow-rose-500/25 transition duration-300"
                            >
                                {actionLoading === "create" ? "Initializing..." : "Create & Start Designing"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}