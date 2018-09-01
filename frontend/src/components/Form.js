import React from 'react'

const Form = ({submit,phoneInput,nameInput}) => {
  return (
    <form onSubmit={submit} className='phone-form'>
      <div>
        <label>
          <h2>Nimi</h2>
        </label>
        <input placeholder='Uusi nimi...' onChange={nameInput}/>
      </div>
      <div>
        <label>
          <h2>Puhelinnumero</h2>
        </label>
        <input placeholder='Puhelinnumero' onChange={phoneInput}/>
      </div>
      <div>
        <button type="submit">lisää</button>
      </div>
    </form>
  )
}

export default Form