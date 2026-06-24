import { useNavigate } from "react-router-dom";
import { ChallengeComplete } from "../components/ChallengeComplete";
import { useWaveState } from "../hooks/useWaveState";

export function ReflectionPage() {
  const { state } = useWaveState();
  const navigate = useNavigate();

  return (
    <ChallengeComplete
      state={state}
      onContinue={() => navigate("/progress")}
    />
  );
}
