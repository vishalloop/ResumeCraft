"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchResumeById, updateResume } from "@/features/resume/api/resume.api";
import { setCurrentResume, setError, setLoading } from "@/features/resume/state/resume.slice";
import ResumeWizard from "@/features/resume/components/ResumeWizard";
import ResumePreview from "@/features/resume/components/ResumePreview";
import AtsAnalyzer from "@/features/resume/components/AtsAnalyzer";
import Protected from "@/features/auth/components/Protected";

export default function ResumeWorkspacePage() {
    return (
        <Protected>
            <WorkspaceContent />
        </Protected>
    );
}

function WorkspaceContent() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { currentResume, loading, error } = useAppSelector((state) => state.resume);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"edit" | "preview" | "ats">("edit");
    const [isAtsOpen, setIsAtsOpen] = useState(false);

    // Fetch resume on load
    useEffect(() => {
        if (!id || typeof id !== "string") return;

        const loadResume = async () => {
            dispatch(setLoading(true));
            try {
                const response = await fetchResumeById(id);
                if (response.success && response.data) {
                    dispatch(setCurrentResume(response.data));
                } else {
                    dispatch(setError("Failed to fetch resume."));
                }
            } catch (err: any) {
                dispatch(setError(err.message || "An error occurred."));
                alert("Error loading resume details.");
                router.push("/");
            } finally {
                dispatch(setLoading(false));
            }
        };

        loadResume();
    }, [id, dispatch, router]);

    // Auto-save handler
    const triggerSave = async () => {
        if (!currentResume || !id || typeof id !== "string") return;
        setSaving(true);
        try {
            await updateResume(id, currentResume);
        } catch (err) {
            console.error("Auto-save failed:", err);
        } finally {
            setSaving(false);
        }
    };

    // Trigger printing
    const handleDownloadPdf = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
                <div className="animate-spin w-10 h-10 border-t-2 border-rose-500 rounded-full mb-4" />
                <p className="text-sm font-semibold tracking-wider text-slate-400">Loading Workspace...</p>
            </div>
        );
    }

    if (error || !currentResume) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-6 text-center">
                <svg className="w-12 h-12 text-rose-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Resume Not Found</h3>
                <p className="text-slate-400 text-sm mb-6 max-w-sm">{error || "This resume workspace is empty or inaccessible."}</p>
                <Link href="/" className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 font-bold text-white transition text-sm">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans workspace-root">
            {/* Header - Hidden during print */}
            <header className="no-print border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition"
                        title="Back to Dashboard"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>

                    <div className="flex items-center gap-2">
                        <h2 className="text-sm sm:text-base font-bold text-slate-200 line-clamp-1 max-w-[200px] sm:max-w-xs">
                            {currentResume.title || "Untitled Resume"}
                        </h2>
                        <div className="flex items-center gap-1.5 ml-2.5">
                            {saving ? (
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                            ) : (
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                            )}
                            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                                {saving ? "Saving" : "Cloud Saved"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Workspace Navigation Tabs (Mobile-only selector) */}
                <div className="flex sm:hidden rounded-lg bg-slate-900 border border-slate-800 p-0.5">
                    <button
                        onClick={() => setActiveTab("edit")}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${activeTab === "edit" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                        Editor
                    </button>
                    <button
                        onClick={() => setActiveTab("preview")}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${activeTab === "preview" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                        Preview
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {/* Manual Save / Trigger AutoSave manually */}
                    <button
                        onClick={triggerSave}
                        className="hidden md:flex px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 transition"
                    >
                        Save Version
                    </button>

                    <button
                        onClick={() => setIsAtsOpen(true)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-purple-950/40 hover:text-purple-400 border border-slate-800 hover:border-purple-900/60 text-xs font-bold text-slate-300 transition flex items-center gap-1.5"
                    >
                        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                        </svg>
                        ATS Score
                    </button>

                    <button
                        onClick={handleDownloadPdf}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-xs font-bold text-white shadow-lg shadow-rose-500/20 transition flex items-center gap-1.5"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF
                    </button>
                </div>
            </header>

            {/* Editor Workspace Panel */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* Left Side: Wizard Form Editor */}
                <section
                    className={`w-full lg:w-[48%] xl:w-[45%] h-full overflow-y-auto border-r border-slate-900 no-print transition-all duration-300 ${
                        activeTab === "edit" ? "block" : "hidden sm:block"
                    }`}
                >
                    <ResumeWizard onAutoSave={triggerSave} />
                </section>

                {/* Right Side: Paper A4 Live Preview */}
                <section
                    className={`flex-1 h-full overflow-y-auto bg-slate-950 p-4 sm:p-8 flex justify-center items-start print-override ${
                        activeTab === "preview" ? "block" : "hidden sm:flex"
                    }`}
                >
                    <div className="w-full max-w-[820px] shadow-2xl relative">
                        <ResumePreview />
                    </div>
                </section>

                {/* ATS Drawer */}
                <AtsAnalyzer
                    isOpen={isAtsOpen}
                    onClose={() => setIsAtsOpen(false)}
                />
            </main>
        </div>
    );
}
