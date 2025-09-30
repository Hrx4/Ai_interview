import { useAppSelector as useSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setWelcomeBack } from "../store/sessionSlice";
import ResumeModal from "./ResumeModal";


const WelcomeBackModal = () => {

  const dispatch = useAppDispatch();
    const session = useSelector(state => state.session.currentSession);

   const onResume = () => {
      console.log("Resuming interview")
      dispatch(setWelcomeBack(false));
    }
  

  return (session &&
    <ResumeModal title="Welcome Back!" isPaused={session.showWelcomeBack}  onResume={onResume} />
  )
}

export default WelcomeBackModal