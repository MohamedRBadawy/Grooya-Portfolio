import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Circle, Lightbulb, Sparkles, Target, X } from 'lucide-react';
import toast from 'react-hot-toast';

import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import { getPortfolioCoachInsights } from '../services/portfolioCoach';
import { ApiKeyMissingError, getSuggestedBlocks } from '../services/aiService';
import type { Portfolio, PortfolioBlock } from '../types';
import Button from './ui/Button';

interface PortfolioCoachPanelProps {
  portfolio: Portfolio;
  onUpdate: (updater: (portfolio: Portfolio) => Portfolio) => void;
  setActiveBlockId: (id: string | null) => void;
  addBlock: (type: PortfolioBlock['type'], index: number) => void;
  onTriggerProjectCreation: () => void;
}

const PortfolioCoachPanel: React.FC<PortfolioCoachPanelProps> = ({
  portfolio,
  onUpdate,
  setActiveBlockId,
  addBlock,
  onTriggerProjectCreation,
}) => {
  const { t } = useTranslation();
  const { featureFlags } = useData();
  const [suggestions, setSuggestions] = useState<{ type: PortfolioBlock['type']; reason: string }[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const homePage = portfolio.pages[0];
  const blocks = homePage?.blocks || [];
  const hero = blocks.find((block) => block.type === 'hero');
  const about = blocks.find((block) => block.type === 'about') as any;
  const projectsBlock = blocks.find((block) => block.type === 'projects') as any;
  const servicesBlock = blocks.find((block) => block.type === 'services') as any;
  const contactBlock = blocks.find((block) => block.type === 'contact');

  const insights = useMemo(() => getPortfolioCoachInsights(portfolio), [portfolio]);
  const nextTask = insights.tasks.find((task) => !task.complete) || null;

  const runTaskAction = (taskKey?: string) => {
    switch (taskKey) {
      case 'hero':
        if (hero) {
          setActiveBlockId(hero.id);
        } else {
          addBlock('hero', 0);
        }
        return;
      case 'about':
        if (about) {
          setActiveBlockId(about.id);
        } else {
          addBlock('about', Math.min(1, blocks.length));
        }
        return;
      case 'proof':
        if (!projectsBlock) {
          addBlock('projects', blocks.length);
          return;
        }
        onTriggerProjectCreation();
        return;
      case 'conversion': {
        const blockToOpen = servicesBlock || contactBlock;
        if (blockToOpen) {
          setActiveBlockId(blockToOpen.id);
          return;
        }
        addBlock(portfolio.track === 'freelancer' ? 'services' : 'contact', blocks.length);
        return;
      }
      default:
        return;
    }
  };

  useEffect(() => {
    if (!featureFlags.aiGuidedBuildEnabled || !portfolio.role) {
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        const existingBlocks = portfolio.pages.flatMap((page) => page.blocks.map((block) => block.type));
        const result = await getSuggestedBlocks(
          portfolio.goal || (portfolio.track === 'freelancer' ? 'get clients' : 'get hired'),
          portfolio.role,
          existingBlocks,
          portfolio.track,
        );
        setSuggestions(result);
      } catch (error) {
        if (error instanceof ApiKeyMissingError) {
          toast.error(error.message);
        }
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [featureFlags.aiGuidedBuildEnabled, portfolio.goal, portfolio.pages, portfolio.role, portfolio.track]);

  return (
    <div className="flex h-full w-80 flex-shrink-0 flex-col border-e border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
        <h3 className="flex items-center gap-2 font-sora text-lg font-bold text-slate-900 dark:text-slate-100">
          <Sparkles size={18} className="text-amber-500" />
          Portfolio Coach
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="p-1"
          onClick={() => onUpdate((current) => ({ ...current, isGuided: false }))}
          title="Exit coach mode"
        >
          <X size={16} />
        </Button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <motion.div
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4 rounded-2xl bg-slate-100 p-3 dark:bg-slate-800/70">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Portfolio health</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{insights.stageLabel}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{insights.score}%</p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-2 rounded-full bg-teal-500 transition-all" style={{ width: `${insights.score}%` }} />
            </div>
          </div>
          <div className="mb-3 flex items-center gap-2">
            <Target size={16} className="text-teal-500" />
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Next best step</h4>
          </div>
          {nextTask ? (
            <>
              <p className="font-medium text-slate-800 dark:text-slate-200">{nextTask.title}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{nextTask.description}</p>
              {nextTask.actionText && (
                <Button variant="primary" size="sm" className="mt-4 w-full" onClick={() => runTaskAction(nextTask.key)}>
                  {nextTask.actionText}
                  <ArrowRight size={14} className="ms-2" />
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="font-medium text-slate-800 dark:text-slate-200">The main launch checklist is complete.</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">You can keep polishing content and design, but the portfolio is structurally ready to publish.</p>
            </>
          )}
        </motion.div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-500" />
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Publish readiness</h4>
          </div>
          <div className="space-y-2">
            {insights.checklist.map((item) => (
              <div key={item.label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  {item.done ? <Check size={14} className="text-teal-500" /> : <Circle size={14} className={item.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'} />}
                  <span className="font-medium">{item.label}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h4 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">Guided roadmap</h4>
          <div className="space-y-3">
            {insights.tasks.map((task) => (
              <div key={task.key} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <div className="flex items-center gap-2">
                  {task.complete ? <Check size={14} className="text-teal-500" /> : <Circle size={14} className="text-slate-400" />}
                  <p className="font-medium text-slate-800 dark:text-slate-200">{task.title}</p>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h4 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">Suggested sections</h4>
          {isLoadingSuggestions ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">Generating suggestions…</p>
          ) : suggestions.length > 0 ? (
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div key={suggestion.type} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <p className="font-medium capitalize text-slate-800 dark:text-slate-200">{t(`block.${suggestion.type}`)}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{suggestion.reason}</p>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-3 w-full"
                    onClick={() => addBlock(suggestion.type, homePage?.blocks.length || 0)}
                  >
                    Add section
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-400">The current page already covers the main structure. Focus on tightening the copy and proof next.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCoachPanel;
