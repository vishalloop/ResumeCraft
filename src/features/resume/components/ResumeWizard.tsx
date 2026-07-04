"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useState } from "react";
import {
    updateCurrentResume,
    updatePersonalInfo,
    setCurrentResume
} from "../state/resume.slice";
import { generateAiResume } from "../api/resume.api";
import { IWorkExperience, IProjects, IEducation } from "@/types/resume.types";

interface ResumeWizardProps {
    onAutoSave: () => void;
}

export default function ResumeWizard({ onAutoSave }: ResumeWizardProps) {
    const dispatch = useAppDispatch();
    const resume = useAppSelector((state) => state.resume.currentResume);

    const [currentStep, setCurrentStep] = useState(1);
    const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    // Helpers to dispatch and save
    const handleChange = (payload: any) => {
        dispatch(updateCurrentResume(payload));
        onAutoSave();
    };

    const handlePersonalChange = (payload: any) => {
        dispatch(updatePersonalInfo(payload));
        onAutoSave();
    };

    // AI Generation call
    const handleAiGenerate = async () => {
        if (!aiPrompt.trim()) return;
        setAiLoading(true);
        try {
            const response = await generateAiResume(aiPrompt);
            if (response.success && response.data) {
                // Populate the whole resume
                const mergedResume = {
                    ...resume,
                    ...response.data
                };
                dispatch(setCurrentResume(mergedResume as any));
                setIsAiPanelOpen(false);
                setAiPrompt("");
                onAutoSave();
                alert("Gemini AI successfully populated your resume details! Feel free to edit below.");
            } else {
                alert("AI generation completed but returned invalid data structure.");
            }
        } catch (err: any) {
            console.error("AI Generation error:", err);
            // Show the actual error message returned from the server
            const serverMsg =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to generate resume with Gemini AI.";
            alert(serverMsg);
        } finally {
            setAiLoading(false);
        }
    };

    if (!resume) return null;

    const steps = [
        { num: 1, label: "Title & Summary" },
        { num: 2, label: "Personal Details" },
        { num: 3, label: "Experience" },
        { num: 4, label: "Projects" },
        { num: 5, label: "Education" },
        { num: 6, label: "Skills & Certs" }
    ];

    const nextStep = () => {
        if (currentStep < 6) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    return (
        <div className="p-6 space-y-6 select-none">
            {/* AI Assistant Floating Button / Section */}
            <div className="rounded-2xl border border-purple-500/30 bg-purple-950/10 p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-xl" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 z-10 relative">
                    <div>
                        <h4 className="text-sm font-bold text-purple-300 flex items-center gap-1.5">
                            <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                            Gemini AI Resume Copilot
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                            Don't want to type? Paste your raw text details or job profile and let AI write your complete resume.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                        className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs tracking-wide transition flex items-center justify-center gap-1.5"
                    >
                        {isAiPanelOpen ? "Close AI Writer" : "Write with AI"}
                    </button>
                </div>

                {isAiPanelOpen && (
                    <div className="mt-4 pt-4 border-t border-purple-900/50 space-y-3 z-10 relative">
                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Describe your career history, roles, skills, projects, and target profile in plain sentences. (e.g., 'My name is John. I have 3 years of experience as a software engineer at IBM working with Node.js and React...')"
                            className="w-full h-24 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 px-4 py-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none transition resize-none"
                        />
                        <button
                            onClick={handleAiGenerate}
                            disabled={aiLoading || !aiPrompt.trim()}
                            className="w-full h-10 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                        >
                            {aiLoading ? (
                                <>
                                    <div className="animate-spin w-4 h-4 border-t-2 border-white rounded-full" />
                                    Gemini is drafting your resume...
                                </>
                            ) : (
                                "Generate ATS Optimized Resume"
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Stepper Progress bar */}
            <div className="flex justify-between items-center bg-slate-900/30 border border-slate-900 p-4 rounded-2xl overflow-x-auto gap-4 scrollbar-none">
                {steps.map((s) => (
                    <button
                        key={s.num}
                        onClick={() => setCurrentStep(s.num)}
                        className="flex flex-col items-center gap-1.5 text-center min-w-[70px] transition-all"
                    >
                        <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all border ${
                                currentStep === s.num
                                    ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30"
                                    : currentStep > s.num
                                    ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                                    : "bg-slate-900 border-slate-800 text-slate-500"
                            }`}
                        >
                            {s.num}
                        </div>
                        <span
                            className={`text-[10px] font-bold tracking-tight whitespace-nowrap transition-colors ${
                                currentStep === s.num ? "text-rose-400" : "text-slate-500"
                            }`}
                        >
                            {s.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Steps Forms Container */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 min-h-[380px] flex flex-col justify-between">
                <div>
                    {/* STEP 1: TITLE & SUMMARY */}
                    {currentStep === 1 && (
                        <div className="space-y-5">
                            <h3 className="text-base font-bold text-slate-200">Resume Metadata</h3>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    Resume Title / Role Profile
                                </label>
                                <input
                                    type="text"
                                    value={resume.title}
                                    onChange={(e) => handleChange({ title: e.target.value })}
                                    placeholder="e.g. Senior Fullstack Developer"
                                    className="w-full h-11 rounded-lg bg-slate-950 border border-slate-800 focus:border-rose-500 px-4 text-xs text-slate-200 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                    Professional Summary
                                </label>
                                <textarea
                                    value={resume.summary}
                                    onChange={(e) => handleChange({ summary: e.target.value })}
                                    placeholder="Briefly summarize your key skills, experience, and value proposition."
                                    className="w-full h-36 rounded-lg bg-slate-950 border border-slate-800 focus:border-rose-500 px-4 py-3 text-xs text-slate-200 outline-none transition resize-none leading-relaxed"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: PERSONAL DETAILS */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-base font-bold text-slate-200">Personal & Contact Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={resume.personalInfo?.fullname || ""}
                                        onChange={(e) => handlePersonalChange({ fullname: e.target.value })}
                                        className="w-full h-11 rounded-lg bg-slate-950 border border-slate-800 focus:border-rose-500 px-4 text-xs text-slate-200 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={resume.personalInfo?.email || ""}
                                        onChange={(e) => handlePersonalChange({ email: e.target.value })}
                                        className="w-full h-11 rounded-lg bg-slate-950 border border-slate-800 focus:border-rose-500 px-4 text-xs text-slate-200 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="text"
                                        value={resume.personalInfo?.mobile || ""}
                                        onChange={(e) => handlePersonalChange({ mobile: e.target.value })}
                                        className="w-full h-11 rounded-lg bg-slate-950 border border-slate-800 focus:border-rose-500 px-4 text-xs text-slate-200 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="City, Country"
                                        value={resume.personalInfo?.location || ""}
                                        onChange={(e) => handlePersonalChange({ location: e.target.value })}
                                        className="w-full h-11 rounded-lg bg-slate-950 border border-slate-800 focus:border-rose-500 px-4 text-xs text-slate-200 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <div>
                                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                        GitHub Link
                                    </label>
                                    <input
                                        type="text"
                                        value={resume.personalInfo?.github || ""}
                                        onChange={(e) => handlePersonalChange({ github: e.target.value })}
                                        placeholder="github.com/..."
                                        className="w-full h-11 rounded-lg bg-slate-950 border border-slate-800 focus:border-rose-500 px-4 text-xs text-slate-200 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                        LinkedIn Link
                                    </label>
                                    <input
                                        type="text"
                                        value={resume.personalInfo?.linkedIn || ""}
                                        onChange={(e) => handlePersonalChange({ linkedIn: e.target.value })}
                                        placeholder="linkedin.com/in/..."
                                        className="w-full h-11 rounded-lg bg-slate-950 border border-slate-800 focus:border-rose-500 px-4 text-xs text-slate-200 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                        Portfolio Link
                                    </label>
                                    <input
                                        type="text"
                                        value={resume.personalInfo?.portfolio || ""}
                                        onChange={(e) => handlePersonalChange({ portfolio: e.target.value })}
                                        placeholder="portfolio.me"
                                        className="w-full h-11 rounded-lg bg-slate-950 border border-slate-800 focus:border-rose-500 px-4 text-xs text-slate-200 outline-none transition"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: WORK EXPERIENCE */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-slate-200">Work Experience</h3>
                                <button
                                    onClick={() => {
                                        const list = [...(resume.workExperience || [])];
                                        list.push({ company: "", position: "", startDate: "", endDate: "", description: "" });
                                        handleChange({ workExperience: list });
                                    }}
                                    className="px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-[10px] font-bold tracking-wider uppercase transition"
                                >
                                    + Add Role
                                </button>
                            </div>

                            {(!resume.workExperience || resume.workExperience.length === 0) ? (
                                <p className="text-slate-500 text-xs py-8 text-center italic">No work experience entries added.</p>
                            ) : (
                                <div className="space-y-6 max-h-[380px] overflow-y-auto pr-2">
                                    {resume.workExperience.map((exp, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 relative group">
                                            <button
                                                onClick={() => {
                                                    const list = (resume.workExperience || []).filter((_, idx) => idx !== index);
                                                    handleChange({ workExperience: list });
                                                }}
                                                className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-rose-950/30 text-slate-500 hover:text-rose-400 border border-transparent hover:border-rose-900/30 transition opacity-0 group-hover:opacity-100"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company</label>
                                                    <input
                                                        type="text"
                                                        value={exp.company}
                                                        onChange={(e) => {
                                                            const list = [...(resume.workExperience || [])];
                                                            list[index] = { ...list[index], company: e.target.value };
                                                            handleChange({ workExperience: list });
                                                        }}
                                                        className="w-full h-9 rounded bg-slate-900 border border-slate-800 focus:border-rose-500 px-3 text-xs text-slate-200 outline-none transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Position</label>
                                                    <input
                                                        type="text"
                                                        value={exp.position}
                                                        onChange={(e) => {
                                                            const list = [...(resume.workExperience || [])];
                                                            list[index] = { ...list[index], position: e.target.value };
                                                            handleChange({ workExperience: list });
                                                        }}
                                                        className="w-full h-9 rounded bg-slate-900 border border-slate-800 focus:border-rose-500 px-3 text-xs text-slate-200 outline-none transition"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Date</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. June 2021"
                                                        value={exp.startDate}
                                                        onChange={(e) => {
                                                            const list = [...(resume.workExperience || [])];
                                                            list[index] = { ...list[index], startDate: e.target.value };
                                                            handleChange({ workExperience: list });
                                                        }}
                                                        className="w-full h-9 rounded bg-slate-900 border border-slate-800 focus:border-rose-500 px-3 text-xs text-slate-200 outline-none transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">End Date</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Present"
                                                        value={exp.endDate}
                                                        onChange={(e) => {
                                                            const list = [...(resume.workExperience || [])];
                                                            list[index] = { ...list[index], endDate: e.target.value };
                                                            handleChange({ workExperience: list });
                                                        }}
                                                        className="w-full h-9 rounded bg-slate-900 border border-slate-800 focus:border-rose-500 px-3 text-xs text-slate-200 outline-none transition"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                                                    Responsibilities (separate bullet points with newlines)
                                                </label>
                                                <textarea
                                                    value={exp.description}
                                                    onChange={(e) => {
                                                        const list = [...(resume.workExperience || [])];
                                                        list[index] = { ...list[index], description: e.target.value };
                                                        handleChange({ workExperience: list });
                                                    }}
                                                    placeholder="Developed features using React...&#10;Collaborated with backend teams..."
                                                    className="w-full h-24 rounded bg-slate-900 border border-slate-800 focus:border-rose-500 px-3 py-2 text-xs text-slate-200 outline-none transition resize-none leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 4: PROJECTS */}
                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-slate-200">Personal & Team Projects</h3>
                                <button
                                    onClick={() => {
                                        const list = [...(resume.projects || [])];
                                        list.push({ title: "", description: "", techStack: [], githubUrl: "", liveUrl: "" });
                                        handleChange({ projects: list });
                                    }}
                                    className="px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-[10px] font-bold tracking-wider uppercase transition"
                                >
                                    + Add Project
                                </button>
                            </div>

                            {(!resume.projects || resume.projects.length === 0) ? (
                                <p className="text-slate-500 text-xs py-8 text-center italic">No projects added.</p>
                            ) : (
                                <div className="space-y-6 max-h-[380px] overflow-y-auto pr-2">
                                    {resume.projects.map((proj, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 relative group">
                                            <button
                                                onClick={() => {
                                                    const list = (resume.projects || []).filter((_, idx) => idx !== index);
                                                    handleChange({ projects: list });
                                                }}
                                                className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-rose-950/30 text-slate-500 hover:text-rose-400 border border-transparent hover:border-rose-900/30 transition opacity-0 group-hover:opacity-100"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>

                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Project Title</label>
                                                <input
                                                    type="text"
                                                    value={proj.title}
                                                    onChange={(e) => {
                                                        const list = [...(resume.projects || [])];
                                                        list[index] = { ...list[index], title: e.target.value };
                                                        handleChange({ projects: list });
                                                    }}
                                                    className="w-full h-9 rounded bg-slate-900 border border-slate-800 focus:border-rose-500 px-3 text-xs text-slate-200 outline-none transition"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Repository URL (GitHub)</label>
                                                    <input
                                                        type="text"
                                                        value={proj.githubUrl}
                                                        onChange={(e) => {
                                                            const list = [...(resume.projects || [])];
                                                            list[index] = { ...list[index], githubUrl: e.target.value };
                                                            handleChange({ projects: list });
                                                        }}
                                                        className="w-full h-9 rounded bg-slate-900 border border-slate-800 focus:border-rose-500 px-3 text-xs text-slate-200 outline-none transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Live URL (Demo)</label>
                                                    <input
                                                        type="text"
                                                        value={proj.liveUrl}
                                                        onChange={(e) => {
                                                            const list = [...(resume.projects || [])];
                                                            list[index] = { ...list[index], liveUrl: e.target.value };
                                                            handleChange({ projects: list });
                                                        }}
                                                        className="w-full h-9 rounded bg-slate-900 border border-slate-800 focus:border-rose-500 px-3 text-xs text-slate-200 outline-none transition"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tech Stack (comma-separated)</label>
                                                <input
                                                    type="text"
                                                    placeholder="React, Tailwind CSS, TypeScript"
                                                    value={proj.techStack ? proj.techStack.join(", ") : ""}
                                                    onChange={(e) => {
                                                        const list = [...(resume.projects || [])];
                                                        list[index] = {
                                                            ...list[index],
                                                            techStack: e.target.value.split(",").map((s) => s.trim())
                                                        };
                                                        handleChange({ projects: list });
                                                    }}
                                                    className="w-full h-9 rounded bg-slate-900 border border-slate-800 focus:border-rose-500 px-3 text-xs text-slate-200 outline-none transition"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                                                <textarea
                                                    value={proj.description}
                                                    onChange={(e) => {
                                                        const list = [...(resume.projects || [])];
                                                        list[index] = { ...list[index], description: e.target.value };
                                                        handleChange({ projects: list });
                                                    }}
                                                    className="w-full h-16 rounded bg-slate-900 border border-slate-800 focus:border-rose-500 px-3 py-1.5 text-xs text-slate-200 outline-none transition resize-none leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 5: EDUCATION */}
                    {currentStep === 5 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-slate-200">Education Details</h3>
                                <button
                                    onClick={() => {
                                        const list = [...(resume.education || [])];
                                        list.push({ institute: "", degree: "", startDate: "", endDate: "" });
                                        handleChange({ education: list });
                                    }}
                                    className="px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-[10px] font-bold tracking-wider uppercase transition"
                                >
                                    + Add Education
                                </button>
                            </div>

                            {(!resume.education || resume.education.length === 0) ? (
                                <p className="text-slate-500 text-xs py-8 text-center italic">No education entries added.</p>
                            ) : (
                                <div className="space-y-5 max-h-[380px] overflow-y-auto pr-2">
                                    {resume.education.map((edu, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 relative group">
                                            <button
                                                onClick={() => {
                                                    const list = (resume.education || []).filter((_, idx) => idx !== index);
                                                    handleChange({ education: list });
                                                }}
                                                className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-rose-950/30 text-slate-500 hover:text-rose-400 border border-transparent hover:border-rose-900/30 transition opacity-0 group-hover:opacity-100"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>

                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Institute / School / University</label>
                                                <input
                                                    type="text"
                                                    value={edu.institute}
                                                    onChange={(e) => {
                                                        const list = [...(resume.education || [])];
                                                        list[index] = { ...list[index], institute: e.target.value };
                                                        handleChange({ education: list });
                                                    }}
                                                    className="w-full h-9 rounded bg-slate-900 border border-slate-800 focus:border-rose-500 px-3 text-xs text-slate-200 outline-none transition"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Degree / Certification Title</label>
                                                <input
                                                    type="text"
                                                    value={edu.degree}
                                                    onChange={(e) => {
                                                        const list = [...(resume.education || [])];
                                                        list[index] = { ...list[index], degree: e.target.value };
                                                        handleChange({ education: list });
                                                    }}
                                                    className="w-full h-9 rounded bg-slate-900 border border-slate-800 focus:border-rose-500 px-3 text-xs text-slate-200 outline-none transition"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Date</label>
                                                    <input
                                                        type="text"
                                                        value={edu.startDate}
                                                        onChange={(e) => {
                                                            const list = [...(resume.education || [])];
                                                            list[index] = { ...list[index], startDate: e.target.value };
                                                            handleChange({ education: list });
                                                        }}
                                                        className="w-full h-9 rounded bg-slate-900 border border-slate-800 focus:border-rose-500 px-3 text-xs text-slate-200 outline-none transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">End Date</label>
                                                    <input
                                                        type="text"
                                                        value={edu.endDate}
                                                        onChange={(e) => {
                                                            const list = [...(resume.education || [])];
                                                            list[index] = { ...list[index], endDate: e.target.value };
                                                            handleChange({ education: list });
                                                        }}
                                                        className="w-full h-9 rounded bg-slate-900 border border-slate-800 focus:border-rose-500 px-3 text-xs text-slate-200 outline-none transition"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 6: SKILLS & CERTIFICATIONS */}
                    {currentStep === 6 && (
                        <div className="space-y-5">
                            <h3 className="text-base font-bold text-slate-200">Skills & Certifications</h3>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    Skills (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    placeholder="React, Node.js, AWS, Kubernetes, Python, Machine Learning"
                                    value={resume.skills ? resume.skills.join(", ") : ""}
                                    onChange={(e) => {
                                        handleChange({
                                            skills: e.target.value.split(",").map((s) => s.trim()).filter((s) => s !== "")
                                        });
                                    }}
                                    className="w-full h-12 rounded-lg bg-slate-950 border border-slate-800 focus:border-rose-500 px-4 text-xs text-slate-200 outline-none transition"
                                />
                                <p className="text-[10px] text-slate-500 mt-1.5 italic">
                                    Type skills separated by commas to format them as separate tags automatically.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    Certifications (one per line)
                                </label>
                                <textarea
                                    placeholder="AWS Certified Solutions Architect&#10;Google Professional Cloud Architect"
                                    value={resume.certifications ? resume.certifications.join("\n") : ""}
                                    onChange={(e) => {
                                        handleChange({
                                            certifications: e.target.value.split("\n").map((s) => s.trim()).filter((s) => s !== "")
                                        });
                                    }}
                                    className="w-full h-32 rounded-lg bg-slate-950 border border-slate-800 focus:border-rose-500 px-4 py-3 text-xs text-slate-200 outline-none transition resize-none leading-relaxed"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-900/80 mt-6">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 transition ${
                            currentStep === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-850"
                        }`}
                    >
                        &larr; Back
                    </button>

                    <button
                        onClick={nextStep}
                        disabled={currentStep === 6}
                        className={`px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 text-xs font-extrabold transition ${
                            currentStep === 6 ? "opacity-30 cursor-not-allowed" : ""
                        }`}
                    >
                        Next Step &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
}
