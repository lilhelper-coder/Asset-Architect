import { LivingOrb, type OrbState } from "./LivingOrb";

interface ChristmasOrbProps {
  state: OrbState;
  onTap: () => void;
  disabled?: boolean;
  showHint?: boolean;
  scrollY: number;
}

export function ChristmasOrb({ 
  state, 
  onTap, 
  disabled = false, 
  showHint = false,
}: ChristmasOrbProps) {
  return (
    <div className="relative" data-testid="christmas-orb-wrapper">
      <LivingOrb 
        state={state} 
        onTap={onTap}
        disabled={disabled}
        showHint={showHint}
      />
    </div>
  );
}
