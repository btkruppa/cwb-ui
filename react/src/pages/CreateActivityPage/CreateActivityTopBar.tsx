import { X } from "lucide-react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/TopBar/TopBar";

export function CreateActivityTopBar() {
  const navigate = useNavigate()

  return (
    <TopBar
      title="New Activity"
      rightIcon={<X size={24} strokeWidth={2} />}
      onRightIconClick={() => { void navigate(-1) }}
    />
  )
}
