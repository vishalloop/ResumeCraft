"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { calculateAtsScore } from "../api/resume.api";
import { setAtsResult, setAtsLoading } from "../state/resume.slice";

interface AtsAnalyzerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AtsAnalyzer({ isOpen, onClose }: AtsAnalyzerProps) {
    const dispatch = useAppDispatch();
    const resume = useAppSelector((state) => state.resume.currentResume);
    const { atsResult, atsLoading } = useAppSelector((state) => state.resume);

    const [jobDescription, setJobDescription] = useState("");

    const handleAnalyze = async () => {
        if (!resume?._id || !jobDescription.trim()) return;

        dispatch(setAtsLoading(true));
        try {
            const response = await calculateAtsScore(resume._id, jobDescription);
            if (response.success && response.data) {
                dispatch(setAtsResult(response.data));
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to analyze resume ATS compatibility.");
        } finally {
            dispatch(setAtsLoading(false));
        }
    };

    if (!isOpen) return null;

    // Get color representing score range
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-500 stroke-emerald-500";
        if (score >= 60) return "text-amber-500 stroke-amber-500";
        return "text-rose-500 stroke-rose-500";
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        if (score >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end no-print">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Sidebar content */}
            <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl z-10 animate-slideLeft">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            ATS Optimizer
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold uppercase tracking-wider">
                                AI Powered
                            </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">Evaluate compatibility with target job descriptions.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Main panel scroll area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Target Job Description input */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Target Job Description
                        </label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the target job description requirements here (technologies, responsibilities, etc.)..."
                            className="w-full h-32 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 px-4 py-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none transition resize-none leading-relaxed"
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={atsLoading || !jobDescription.trim()}
                            className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/10"
                        >
                            {atsLoading ? (
                                <>
                                    <div className="animate-spin w-4 h-4 border-t-2 border-white rounded-full" />
                                    Analyzing compatibility...
                                </>
                            ) : (
                                "Calculate Match Score"
                            )}
                        </button>
                    </div>

                    {/* Results report */}
                    {atsResult && !atsLoading && (
                        <div className="space-y-6 pt-4 border-t border-slate-800 animate-fadeIn">
                            {/* Score card details */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                                {/* Circular progress bar dial */}
                                <div className="relative w-24 h-24 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        {/* Background Track */}
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-slate-800"
                                        />
                                        {/* Progress Circle */}
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={251.2}
                                            strokeDashoffset={251.2 - (251.2 * atsResult.score) / 100}
                                            className={`transition-all duration-1000 ease-out ${getScoreColor(atsResult.score)}`}
                                        />
                                    </svg>
                                    <span className="absolute text-xl font-black text-white">{atsResult.score}%</span>
                                </div>

                                <div className="text-center sm:text-left flex-1 space-y-1">
                                    <h4 className="text-sm font-bold text-slate-200">Compatibility Score</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Your resume matches {atsResult.score}% of the core keywords and qualifications in the job description.
                                    </p>
                                    <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider mt-1 ${getScoreBg(atsResult.score)}`}>
                                        {atsResult.score >= 80 ? "Highly Compatible" : atsResult.score >= 60 ? "Moderate Match" : "Needs Optimization"}
                                    </span>
                                </div>
                            </div>

                            {/* Overall Evaluation */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Evaluation</h4>
                                <p className="text-xs text-slate-350 bg-slate-950/20 border border-slate-800 p-4 rounded-xl leading-relaxed text-justify">
                                    {atsResult.overallEvaluation}
                                </p>
                            </div>

                            {/* Missing Keywords */}
                            {atsResult.missingKeywords && atsResult.missingKeywords.length > 0 && (
                                <div className="space-y-2.5">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Missing Keywords</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {atsResult.missingKeywords.map((kw, i) => (
                                            <span
                                                key={i}
                                                className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/15 text-[10px] font-bold tracking-wide"
                                            >
                                                + {kw}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-slate-500 italic">
                                        Add these skills or keywords to your resume to increase visibility with search systems.
                                    </p>
                                </div>
                            )}

                            {/* Positives */}
                            {atsResult.positives && atsResult.positives.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Strengths</h4>
                                    <ul className="space-y-1.5">
                                        {atsResult.positives.map((p, i) => (
                                            <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                                                <span className="text-emerald-500 mt-0.5">✔</span>
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Improvements */}
                            {atsResult.improvements && atsResult.improvements.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Actionable Improvements</h4>
                                    <ul className="space-y-1.5">
                                        {atsResult.improvements.map((imp, i) => (
                                            <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                                                <span className="text-amber-500 mt-0.5">▪</span>
                                                {imp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer close button */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/40">
                    <button
                        onClick={onClose}
                        className="w-full h-11 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition"
                    >
                        Close Panel
                    </button>
                </div>
            </div>
        </div>
    );
}
