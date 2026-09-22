import React from 'react';
import { Bookmark, Sparkles } from 'lucide-react';
import { PresetOption } from '../../utils/presets';

interface PresetSelectorProps<T> {
  presets: PresetOption<T>[];
  onSelect: (preset: PresetOption<T>) => void;
  title?: string;
}

export function PresetSelector<T>({
  presets,
  onSelect,
  title = 'Example Scenarios',
}: PresetSelectorProps<T>) {
  if (!presets || presets.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>{title}:</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {presets.map(preset => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer"
            title={preset.description}
          >
            <Bookmark className="w-3 h-3 text-emerald-500" />
            <span>{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
