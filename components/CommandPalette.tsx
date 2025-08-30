import React from 'react';
import { Command } from 'cmdk';
import { useTranslation } from '../hooks/useTranslation';
import type { PortfolioBlock, ColorTheme } from '../types';
import { FileText, Palette, Save, Trash2, Image, User, LayoutGrid, Sparkles, GalleryThumbnails, Quote, Clapperboard, MousePointerClick, FileTextIcon, Link, Sun, Moon, Droplet, Sprout, Briefcase, Mail, Code, DollarSign, PenSquare } from 'lucide-react';
// FIX: The type `MotionProps` does not seem to include animation properties in this project's setup, so we remove the explicit type to let TypeScript infer it.
import { motion, AnimatePresence } from 'framer-motion';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  actions: {
    onSwitchTab: (tab: 'content' | 'design') => void;
    onSave: () => void;
    onDelete: () => void;
    onAddBlock: (type: PortfolioBlock['type']) => void;
    onSetTheme: (theme: ColorTheme) => void;
  };
}

const blockTypes: { type: PortfolioBlock['type']; icon: React.ElementType }[] = [
  { type: 'hero', icon: Image },
  { type: 'about', icon: User },
  { type: 'experience', icon: Briefcase },
  { type: 'projects', icon: LayoutGrid },
  { type: 'skills', icon: Sparkles },
  { type: 'code', icon: Code },
  { type: 'gallery', icon: GalleryThumbnails },
  { type: 'testimonials', icon: Quote },
  { type: 'video', icon: Clapperboard },
  { type: 'cta', icon: MousePointerClick },
  { type: 'resume', icon: FileTextIcon },
  { type: 'links', icon: Link },
  { type: 'blog', icon: PenSquare },
  { type: 'services', icon: DollarSign },
  { type: 'contact', icon: Mail },
];

const themes: { name: ColorTheme, icon: React.ElementType }[] = [
    { name: 'light', icon: Sun },
    { name: 'dark', icon: Moon },
    { name: 'mint', icon: Sprout },
    { name: 'rose', icon: Droplet },
]

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, setIsOpen, actions }) => {
  const { t } = useTranslation();

  const runCommand = (command: () => void) => {
    setIsOpen(false);
    command();
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [isOpen, setIsOpen])

  // FIX: Removed incorrect `MotionProps` type.
  const motionProps = {
      initial: { y: -20, opacity: 0, scale: 0.98 },
      animate: { y: 0, opacity: 1, scale: 1 },
      exit: { y: -20, opacity: 0, scale: 0.98 },
      transition: { duration: 0.2 },
  };

  return (
    <AnimatePresence>
        {isOpen && (
             <Command.Dialog 
                open={isOpen} 
                onOpenChange={setIsOpen} 
                label="Global command menu"
                className="fixed inset-0 z-50"
             >
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" />
                <motion.div
                    {...motionProps}
                    className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl"
                >
                    <Command
                        className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                    >
                        <Command.Input 
                            placeholder="Type a command or search..."
                            className="w-full p-4 bg-transparent focus:outline-none border-b border-slate-200 dark:border-slate-700 placeholder-slate-500"
                        />
                        <Command.List className="max-h-[300px] overflow-y-auto p-2">
                            <Command.Empty className="p-4 text-center text-sm text-slate-600">No results found.</Command.Empty>

                            <Command.Group heading="Navigation">
                                <Command.Item onSelect={() => runCommand(() => actions.onSwitchTab('content'))}>
                                    <FileText size={16} className="me-3"/>
                                    <span>Switch to Content Tab</span>
                                </Command.Item>
                                <Command.Item onSelect={() => runCommand(() => actions.onSwitchTab('design'))}>
                                    <Palette size={16} className="me-3"/>
                                    <span>Switch to Design Tab</span>
                                </Command.Item>
                            </Command.Group>
                            
                            <Command.Group heading="Actions">
                                <Command.Item onSelect={() => runCommand(actions.onSave)}>
                                    <Save size={16} className="me-3"/>
                                    <span>Save Portfolio</span>
                                </Command.Item>
                                <Command.Item onSelect={() => runCommand(actions.onDelete)}>
                                    <Trash2 size={16} className="me-3 text-rose-500"/>
                                    <span>Delete Portfolio</span>
                                </Command.Item>
                            </Command.Group>
                            
                            <Command.Group heading="Add Block">
                                {blockTypes.map(({ type, icon: Icon }) => (
                                    <Command.Item key={type} onSelect={() => runCommand(() => actions.onAddBlock(type))}>
                                        <Icon size={16} className="me-3"/>
                                        <span>Add {t(`block.${type}`)} Block</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>

                            <Command.Group heading="Set Theme">
                                {themes.map(({ name, icon: Icon }) => (
                                    <Command.Item key={name} onSelect={() => runCommand(() => actions.onSetTheme(name))}>
                                        <Icon size={16} className="me-3"/>
                                        <span>Set Theme to {name}</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        </Command.List>
                         <style>{`
                            [cmdk-dialog] [cmdk-list] {
                                min-height: 50px;
                            }
                            [cmdk-dialog] [cmdk-group-heading] {
                                padding: 8px 12px;
                                font-size: 0.8rem;
                                color: #475569; /* slate-600 */
                                font-weight: 500;
                            }
                            .dark [cmdk-dialog] [cmdk-group-heading] {
                                color: #94a3b8; /* slate-400 */
                            }
                            [cmdk-dialog] [cmdk-item] {
                                content-visibility: auto;
                                cursor: pointer;
                                border-radius: 8px;
                                display: flex;
                                align-items: center;
                                gap: 0.75rem;
                                padding: 8px 12px;
                                user-select: none;
                                will-change: background, color;
                                transition: all 150ms ease;
                                transition-property: none;
                            }
                             [cmdk-dialog] [cmdk-item][aria-selected="true"] {
                                background: #e2e8f0; /* slate-200 */
                                color: #0f172a; /* slate-900 */
                            }
                            .dark [cmdk-dialog] [cmdk-item][aria-selected="true"] {
                                background: #1e293b; /* slate-800 */
                                color: #f8fafc; /* slate-50 */
                            }
                        `}</style>
                    </Command>
                </motion.div>
             </Command.Dialog>
        )}
    </AnimatePresence>
  );
};

export default CommandPalette;