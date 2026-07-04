"use client";

import { useAppSelector } from "@/store/hooks";

export default function ResumePreview() {
    const resume = useAppSelector((state) => state.resume.currentResume);

    if (!resume) return null;

    const { personalInfo, summary, workExperience, projects, education, skills, certifications } = resume;

    // Helper to format bulleted descriptions
    const renderBullets = (text: string) => {
        if (!text) return null;
        const bullets = text.split("\n").filter(line => line.trim() !== "");
        return (
            <ul className="list-disc pl-4 mt-1.5 space-y-1 text-slate-700 text-[12px] leading-relaxed">
                {bullets.map((b, i) => (
                    <li key={i}>{b.startsWith("•") || b.startsWith("-") ? b.substring(1).trim() : b}</li>
                ))}
            </ul>
        );
    };

    return (
        <div className="resume-paper bg-white text-slate-900 px-10 py-12 shadow-2xl relative select-text font-serif leading-normal select-text">
            {/* Embedded Print CSS */}
            <style jsx global>{`
                @media print {
                    /* Remove page headers/footers default margins */
                    @page {
                        size: A4;
                        margin: 1.5cm;
                    }
                    /* Ensure backgrounds and text colors print properly */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }

                /* General paper styling for desktop workspace preview */
                .resume-paper {
                    min-height: 297mm; /* Standard A4 height ratio */
                    width: 100%;
                    box-sizing: border-box;
                    word-wrap: break-word;
                }
            `}</style>

            {/* Header / Personal Info */}
            <div className="text-center border-b border-slate-300 pb-5">
                <h1 className="text-3xl font-extrabold tracking-wide uppercase font-sans text-slate-900">
                    {personalInfo?.fullname || "YOUR NAME"}
                </h1>
                <p className="text-rose-600 font-sans font-bold tracking-wider text-[11px] uppercase mt-1">
                    {resume.title || "PROFESSIONAL PROFILE"}
                </p>

                {/* Contact Links */}
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3.5 text-slate-600 text-[11px] font-sans">
                    {personalInfo?.email && (
                        <span className="flex items-center gap-1">
                            <span className="font-bold text-slate-800">Email:</span> {personalInfo.email}
                        </span>
                    )}
                    {personalInfo?.mobile && (
                        <span className="flex items-center gap-1">
                            <span className="font-bold text-slate-800">Phone:</span> {personalInfo.mobile}
                        </span>
                    )}
                    {personalInfo?.location && (
                        <span className="flex items-center gap-1">
                            <span className="font-bold text-slate-800">Location:</span> {personalInfo.location}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-1 text-slate-600 text-[11px] font-sans">
                    {personalInfo?.github && (
                        <span className="flex items-center gap-1">
                            <span className="font-bold text-slate-800">GitHub:</span> {personalInfo.github}
                        </span>
                    )}
                    {personalInfo?.linkedIn && (
                        <span className="flex items-center gap-1">
                            <span className="font-bold text-slate-800">LinkedIn:</span> {personalInfo.linkedIn}
                        </span>
                    )}
                    {personalInfo?.portfolio && (
                        <span className="flex items-center gap-1">
                            <span className="font-bold text-slate-800">Portfolio:</span> {personalInfo.portfolio}
                        </span>
                    )}
                </div>
            </div>

            {/* Content Body */}
            <div className="mt-6 space-y-6">
                {/* 1. Summary */}
                {summary && (
                    <div className="space-y-1.5">
                        <h2 className="text-[13px] font-extrabold tracking-widest uppercase font-sans text-slate-900 border-b-2 border-slate-850 pb-0.5">
                            Professional Summary
                        </h2>
                        <p className="text-[12px] text-slate-700 leading-relaxed text-justify">
                            {summary}
                        </p>
                    </div>
                )}

                {/* 2. Experience */}
                {workExperience && workExperience.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-[13px] font-extrabold tracking-widest uppercase font-sans text-slate-900 border-b-2 border-slate-850 pb-0.5">
                            Work History
                        </h2>
                        <div className="space-y-4">
                            {workExperience.map((exp, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="flex justify-between items-baseline text-[12px] font-sans">
                                        <div>
                                            <span className="font-extrabold text-slate-900">{exp.position}</span>
                                            {exp.company && (
                                                <span className="text-slate-500 font-semibold"> at {exp.company}</span>
                                            )}
                                        </div>
                                        <span className="text-slate-500 text-[11px] font-bold">
                                            {exp.startDate} – {exp.endDate || "Present"}
                                        </span>
                                    </div>
                                    {renderBullets(exp.description)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Projects */}
                {projects && projects.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-[13px] font-extrabold tracking-widest uppercase font-sans text-slate-900 border-b-2 border-slate-850 pb-0.5">
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {projects.map((proj, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="flex justify-between items-baseline text-[12px] font-sans">
                                        <div className="flex items-center gap-2">
                                            <span className="font-extrabold text-slate-900">{proj.title}</span>
                                            {proj.techStack && proj.techStack.length > 0 && (
                                                <span className="text-[10px] text-rose-600 font-semibold">
                                                    ({proj.techStack.join(", ")})
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-3 text-[10px] font-bold text-slate-500">
                                            {proj.githubUrl && <span>Repo</span>}
                                            {proj.liveUrl && <span>Live Demo</span>}
                                        </div>
                                    </div>
                                    {proj.description && (
                                        <p className="text-[12px] text-slate-700 leading-relaxed text-justify">
                                            {proj.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Education */}
                {education && education.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-[13px] font-extrabold tracking-widest uppercase font-sans text-slate-900 border-b-2 border-slate-850 pb-0.5">
                            Education
                        </h2>
                        <div className="space-y-3">
                            {education.map((edu, idx) => (
                                <div key={idx} className="flex justify-between items-baseline text-[12px] font-sans">
                                    <div>
                                        <span className="font-extrabold text-slate-900">{edu.degree}</span>
                                        {edu.institute && (
                                            <span className="text-slate-500 font-semibold"> – {edu.institute}</span>
                                        )}
                                    </div>
                                    <span className="text-slate-500 text-[11px] font-bold">
                                        {edu.startDate} – {edu.endDate}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. Skills */}
                {skills && skills.length > 0 && (
                    <div className="space-y-1.5">
                        <h2 className="text-[13px] font-extrabold tracking-widest uppercase font-sans text-slate-900 border-b-2 border-slate-850 pb-0.5">
                            Technical Skills
                        </h2>
                        <p className="text-[12px] text-slate-700 font-sans leading-relaxed">
                            {skills.join(" • ")}
                        </p>
                    </div>
                )}

                {/* 6. Certifications */}
                {certifications && certifications.length > 0 && (
                    <div className="space-y-1.5">
                        <h2 className="text-[13px] font-extrabold tracking-widest uppercase font-sans text-slate-900 border-b-2 border-slate-850 pb-0.5">
                            Certifications
                        </h2>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-700 text-[12px] leading-relaxed">
                            {certifications.map((c, i) => (
                                <li key={i}>{c}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
