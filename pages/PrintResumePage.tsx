
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import ResumePreview from '../components/ResumePreview';
import Button from '../components/ui/Button';
import { Download } from 'lucide-react';

const PrintResumePage: React.FC = () => {
    const { resumeId } = useParams<{ resumeId: string }>();
    const navigate = useNavigate();
    const { getResumeById } = useData();

    const resume = resumeId ? getResumeById(resumeId) : null;

    useEffect(() => {
        if (resume) {
            document.title = `${resume.title} | Grooya`;
            // A short timeout to ensure the content is rendered before printing
            const timer = setTimeout(() => {
                window.print();
            }, 500);

            // Set up an event listener for after printing to potentially close the tab,
            // though this may be blocked by browsers.
            const handleAfterPrint = () => {
                // The following line is commented out as it is often blocked by modern browsers for security reasons.
                // window.close();
            };
            window.addEventListener('afterprint', handleAfterPrint);

            return () => {
                clearTimeout(timer);
                window.removeEventListener('afterprint', handleAfterPrint);
            };
        } else if (resumeId) {
            // If resume not found after a short delay, redirect.
            const redirectTimer = setTimeout(() => {
                navigate('/dashboard/resumes');
            }, 1000);
            return () => clearTimeout(redirectTimer);
        }
    }, [resume, resumeId, navigate]);

    if (!resume) {
        return <div className="p-8 text-center text-slate-600">Loading resume for printing...</div>;
    }

    return (
        <div className="bg-white relative">
            <div className="noprint fixed top-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 max-w-xs text-center">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">Your document is ready.</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">The print dialog should open automatically. If not, use the button below.</p>
                <Button variant="primary" className="w-full" onClick={() => window.print()}>
                    <Download size={16} className="mr-2"/>
                    Print / Save as PDF
                </Button>
            </div>
            
            <ResumePreview resume={resume} />
        </div>
    );
};

export default PrintResumePage;
