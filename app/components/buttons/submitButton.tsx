import React from 'react'

interface Props {
  id: string,
  text: string
}

const SubmitButton = (props: Props) => {
  const {id, text} = props;

  return (
    <>
      <button className='w-full bg-green-700 text-white rounded-lg p-2 hover:bg-green-800' 
        id={id} type='submit'>
        {text}
      </button>
    </>
  )
}

export default SubmitButton
