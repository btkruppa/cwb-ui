import { Plus } from "lucide-react";
import { TopBar } from "../../components/TopBar/TopBar";


export function ManageTopBar() {

  return <TopBar                                                                                                                   
    title="Activities"                                                                                                      
    rightIcon={<Plus size={24} strokeWidth={2} />}                                                                          
    onRightIconClick={() => { /* TODO: open add activity flow */ }}                                                         
  /> 
}