import React from 'react'

const Filter = ({filterInput}) => {
  return (
    <div>
      <label>
        <h2>Rajaa henkilöitä</h2>
      </label>
      <input placeholder='Etsi henkilöä' onChange={filterInput}/>
    </div>
  )
}

export default Filter