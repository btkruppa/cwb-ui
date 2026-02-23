import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/TopBar/TopBar";

export function ManageTopBar() {
  const navigate = useNavigate()

  return (
    <TopBar
      title="Activities"
      rightIcon={<Plus size={24} strokeWidth={2} />}
      onRightIconClick={() => { void navigate('/manage/create-activity') }}
    />
  )
}