import { useChatStore } from '../../store/chatStore';

interface SettingSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

function SettingSlider({ label, value, min, max, step, onChange }: SettingSliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export function SettingsPanel() {
  const settings = useChatStore(state => state.settings);
  const updateSettings = useChatStore(state => state.updateSettings);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SettingSlider
        label="🌡️ Temperature"
        value={settings.temperature}
        min={0}
        max={2}
        step={0.1}
        onChange={(v) => updateSettings({ ...settings, temperature: v })}
      />
      <SettingSlider
        label="🎯 Top P"
        value={settings.top_p}
        min={0}
        max={1}
        step={0.05}
        onChange={(v) => updateSettings({ ...settings, top_p: v })}
      />
      <SettingSlider
        label="📏 Max Tokens"
        value={settings.max_tokens}
        min={128}
        max={8192}
        step={128}
        onChange={(v) => updateSettings({ ...settings, max_tokens: v })}
      />
    </div>
  );
}
