import React from 'react'

const Success = ({show,message,color}) => {
  const notificationClass = show ? 'success-notification show' : 'success-notification'
  const additionalStyles = {
    backgroundColor:color
  }
  
  return (
    <div className={notificationClass} style={additionalStyles}>
      {message}
    </div>
  )
}

export default Success