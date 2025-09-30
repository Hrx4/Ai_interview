import { Modal } from "antd"

const ResumeModal = ({title , isPaused, onResume}:{title : string, isPaused : boolean, onResume : ()=>void}) => {
  return (
   <>
   <Modal
        title={ title}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isPaused}
        onOk={onResume}
        onCancel={onResume}
      >
       <div>Hey! You have an ongoing interview. You can resume it by clicking the button below.</div>
      </Modal>
      </>
  )
}

export default ResumeModal