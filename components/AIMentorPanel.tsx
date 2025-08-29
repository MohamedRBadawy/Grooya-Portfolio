
import React, { useMemo, useState, useEffect } from 'react';
import type { Portfolio, PortfolioBlock, HeroBlock, AboutBlock, ProjectsBlock, Skill } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import Button from './ui/Button';
import { Lightbulb, CheckCircle, ArrowRight, X, Circle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { getSuggestedBlocks, ApiKeyMissingError } from '../services/aiService';
import toast from 'react-hot-toast';

interface AIAssistantPanelProps {
  portfolio: Portfolio;
  onUpdate: (updater: (p: Portfolio) => Portfolio) => void;
  setActiveBlockId: (id: string | null) => void;
  addBlock: (type: PortfolioBlock['type'], index: number) => void;
  onTriggerProjectCreation: () => void;
}

/** Represents a single step for the user to complete. */
interface MentorTask {
    key: string;
    title: string;
    description: (p: Portfolio) => string;
    actionText: string;
    /** A function that checks the portfolio state to see if this task is done. */
    isCompleted: (p: Portfolio) => boolean;
    /** The function to call when the user clicks the action button. */
    onAction: (p: Portfolio) => void;
}

/** Represents a group of related tasks. */
interface MentorStage {
    title: string;
    tasks: MentorTask[];
}

/**
 * Defines the entire guided-creation process as a series of stages and tasks.
 * This structure makes it easy to add, remove, or reorder steps.
 */
const getMentorGuide = (
    addBlock: AIAssistantPanelProps['addBlock'],
    setActiveBlockId: AIAssistantPanelProps['setActiveBlockId'],
    onTriggerProjectCreation: AIAssistantPanelProps['onTriggerProjectCreation']
): MentorStage[] => [
    {
        title: "The Foundation",
        tasks: [
            {
                key: 'add-hero',
                title: 'Add a Hero Section',
                description: () => "Every great portfolio starts with a powerful first impression. Let's add a Hero section to introduce yourself.",
                actionText: "Add Hero Section",
                isCompleted: (p) => (p.pages[0]?.blocks || []).some(b => b.type === 'hero'),
                onAction: (p) => { if (!(p.pages[0]?.blocks || []).some(b => b.type === 'hero')) addBlock('hero', 0) }
            },
            {
                key: 'edit-headline',
                title: 'Write Your Headline',
                description: (p) => `Your headline is the first thing visitors read. Let's make it impactful. Tip: Use your name and title, like "${p.role || 'Your Name, Your Title'}".`,
                actionText: "Edit Headline",
                isCompleted: (p) => {
                    const hero = (p.pages[0]?.blocks || []).find(b => b.type === 'hero') as HeroBlock | undefined;
                    // Completed if a hero exists and the headline is not the default placeholder text.
                    return !!hero && hero.headline !== 'Your Name or Compelling Headline';
                },
                onAction: (p) => {
                    const hero = (p.pages[0]?.blocks || []).find(b => b.type === 'hero');
                    if(hero) setActiveBlockId(hero.id); // Focus the hero block for editing.
                }
            },
            {
                key: 'add-about',
                title: 'Add an About Section',
                description: () => "Let's give visitors a chance to learn more about you. We'll add an 'About Me' section.",
                actionText: "Add About Section",
                isCompleted: (p) => (p.pages[0]?.blocks || []).some(b => b.type === 'about'),
                onAction: (p) => {
                    const blocks = p.pages[0]?.blocks || [];
                    if (!blocks.some(b => b.type === 'about')) {
                        const heroIndex = blocks.findIndex(b => b.type === 'hero');
                        addBlock('about', heroIndex !== -1 ? heroIndex + 1 : 1);
                    }
                }
            },
            {
                key: 'edit-about',
                title: 'Write Your Bio',
                description: () => "Tell your professional story. What are you passionate about? What drives you? Use the AI Assistant if you need some inspiration!",
                actionText: "Edit Bio",
                isCompleted: (p) => {
                    const about = (p.pages[0]?.blocks || []).find(b => b.type === 'about') as AboutBlock | undefined;
                    // Completed if bio exists, has meaningful content, and is not the placeholder.
                    return !!about && about.content.length > 20 && !about.content.includes("Share your professional story");
                },
                onAction: (p) => {
                    const about = (p.pages[0]?.blocks || []).find(b => b.type === 'about');
                    if(about) setActiveBlockId(about.id);
                }
            },
        ],
    },
    {
        title: "Proof of Work",
        tasks: [
             {
                key: 'add-projects',
                title: 'Add a Projects Section',
                description: () => "This is where you showcase your talent. Let's add a section to display your best projects.",
                actionText: "Add Projects Section",
                isCompleted: (p) => (p.pages[0]?.blocks || []).some(b => b.type === 'projects'),
                onAction: (p) => {
                    const blocks = p.pages[0]?.blocks || [];
                     if (!blocks.some(b => b.type === 'projects')) {
                        const aboutIndex = blocks.findIndex(b => b.type === 'about');
                        addBlock('projects', aboutIndex !== -1 ? aboutIndex + 1 : 2);
                    }
                }
            },
            {
                key: 'create-first-project',
                title: 'Add Your First Project',
                description: () => "A portfolio is nothing without projects. Click below to create your first project entry. The AI can even help you write a great description!",
                actionText: "Create New Project",
                isCompleted: (p) => {
                    const projectsBlock = (p.pages[0]?.blocks || []).find(b => b.type === 'projects') as ProjectsBlock | undefined;
                    return !!projectsBlock && projectsBlock.projectIds.length > 0;
                },
                onAction: () => {
                    onTriggerProjectCreation();
                }
            },
        ],
    },
];

/**
 * A sidebar panel that provides a step-by-step guided experience for new users.
 */
const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ portfolio, onUpdate, setActiveBlockId, addBlock, onTriggerProjectCreation }) => {
  const { t } = useTranslation();
  const { consumeAiFeature } = useData();
  const [suggestions, setSuggestions] = useState<{ type: PortfolioBlock['type'], reason: string }[] | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  const mentorGuide = useMemo(() => getMentorGuide(addBlock, setActiveBlockId, onTriggerProjectCreation), [addBlock, setActiveBlockId, onTriggerProjectCreation]);

  useEffect(() => {
    const fetchSuggestions = async () => {
        if (!portfolio.goal || !portfolio.role || !consumeAiFeature('blockSuggestions')) {
            return;
        }
        setIsLoadingSuggestions(true);
        try {
            const existingBlocks = portfolio.pages.flatMap(p => p.blocks.map(b => b.type));
            const result = await getSuggestedBlocks(portfolio.goal, portfolio.role, existingBlocks);
            setSuggestions(result);
        } catch(error) {
            console.error("Failed to get block suggestions:", error);
            if (error instanceof ApiKeyMissingError) {
                toast.error(error.message);
            }
            // We don't toast a generic error to not bother the user.
        } finally {
            setIsLoadingSuggestions(false);
        }
    }
    // Only fetch suggestions once when the panel is first loaded.
    if (!suggestions && !isLoadingSuggestions) {
        fetchSuggestions();
    }
  }, [portfolio, consumeAiFeature, suggestions, isLoadingSuggestions]);


  // This memoized value calculates the user's current position in the guide.
  // It iterates through stages and tasks, checking the `isCompleted` status for each.
  const { stageIndex, taskIndex, isComplete } = useMemo(() => {
    let currentStageIndex = 0;
    let currentTaskIndex = 0;
    
    for (const stage of mentorGuide) {
        currentTaskIndex = 0;
        for (const task of stage.tasks) {
            if (!task.isCompleted(portfolio)) {
                // Return the first task that is not completed.
                return { stageIndex: currentStageIndex, taskIndex: currentTaskIndex, isComplete: false };
            }
            currentTaskIndex++;
        }
        currentStageIndex++;
    }

    // If all tasks are completed.
    return { stageIndex: mentorGuide.length, taskIndex: 0, isComplete: true };
  }, [portfolio, mentorGuide]);

  const currentStage = mentorGuide[stageIndex];
  const currentTask = currentStage?.tasks[taskIndex];

  // Function to exit the guided mode by updating the portfolio state.
  const handleCompleteGuidedMode = () => {
      onUpdate(p => ({...p, isGuided: false}));
  };
  
  // Triggers the action for the current active task.
  const handleAction = () => {
      if(currentTask) {
          currentTask.onAction(portfolio);
      }
  };

  const cardMotionProps: any = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
  };

  return (
    <div className="w-80 bg-slate-50 dark:bg-slate-950 border-e border-slate-200 dark:border-slate-800 flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg font-sora flex items-center gap-2">
          <Lightbulb className="text-amber-500" size={20} />
          AI Assistant
        </h3>
        <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={handleCompleteGuidedMode} title="Exit guided mode">
            <X size={16}/>
        </Button>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-6">
        {/* Progress Tracker */}
        <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">Your Roadmap:</h4>
            <ul className="mt-2 space-y-2">
            {mentorGuide.map((stage, sIndex) => (
                <li key={sIndex}>
                    <div className="flex items-center gap-2">
                        <CheckCircle size={16} className={sIndex < stageIndex ? 'text-teal-500' : 'text-slate-400 dark:text-slate-600'} />
                        <span className={`text-sm ${sIndex === stageIndex ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                            {stage.title}
                        </span>
                    </div>
                    {/* Show tasks for the current, active stage */}
                    {sIndex === stageIndex && !isComplete && (
                         <ul className="mt-2 ps-6 space-y-1.5 border-s-2 border-slate-200 dark:border-slate-700 ms-2">
                             {stage.tasks.map((task, tIndex) => {
                                 const isTaskCompleted = task.isCompleted(portfolio);
                                 return (
                                     <li key={task.key} className="flex items-center gap-2 text-xs">
                                        {isTaskCompleted ? <Check size={14} className="text-teal-500"/> : <Circle size={14} className="text-slate-400 dark:text-slate-500"/>}
                                        <span className={tIndex === taskIndex ? 'font-semibold' : ''}>{task.title}</span>
                                     </li>
                                 )
                             })}
                         </ul>
                    )}
                </li>
            ))}
            </ul>
        </div>
        
        {/* Current Task Card */}
        <AnimatePresence mode="wait">
        <motion.div
            key={currentTask?.key || 'complete'}
            className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
            {...cardMotionProps}
        >
            {isComplete ? (
                 <div>
                    <h5 className="font-bold text-slate-900 dark:text-slate-100">You're all set!</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">You've completed the guided setup. You can now freely edit your portfolio.</p>
                    <Button 
                        variant="primary" 
                        size="sm" 
                        className="w-full mt-4"
                        onClick={handleCompleteGuidedMode}
                    >
                        Finish Guided Mode
                    </Button>
                </div>
            ) : currentTask ? (
                <div>
                    <h5 className="font-bold text-slate-900 dark:text-slate-100">{currentTask.title}</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{currentTask.description(portfolio)}</p>
                    <Button 
                        variant="primary" 
                        size="sm" 
                        className="w-full mt-4"
                        onClick={handleAction}
                    >
                        {currentTask.actionText} <ArrowRight size={14} className="ms-2"/>
                    </Button>
                </div>
            ) : null}
        </motion.div>
        </AnimatePresence>
        
         {/* AI Suggestions Card */}
        {suggestions && suggestions.length > 0 && (
            <motion.div
                className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-2">AI Suggestions</h5>
                <div className="space-y-3">
                    {suggestions.map(suggestion => (
                        <div key={suggestion.type} className="p-3 bg-slate-100/70 dark:bg-slate-800/70 rounded-md">
                            <p className="font-semibold text-sm capitalize text-slate-800 dark:text-slate-200">{t(`block.${suggestion.type}`)}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-2">{suggestion.reason}</p>
                            <Button size="sm" variant="secondary" className="w-full !text-xs" onClick={() => addBlock(suggestion.type, portfolio.pages[0].blocks.length)}>
                                Add Section
                            </Button>
                        </div>
                    ))}
                </div>
            </motion.div>
        )}
      </div>

       <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="secondary" size="sm" className="w-full" onClick={handleCompleteGuidedMode}>
              Exit Guided Mode
          </Button>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
