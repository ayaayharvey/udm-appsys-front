import React from 'react'

interface Props {
  id: string,
  name: string,
  placeholder: string
  text: string,
  type: string,
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputField = (props: Props) => {
  const {id, name, placeholder,text, type, value, onChange} = props;
  return (
    <>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text text-gray-900">{text}</span>
      </label>
      <input onChange={onChange} id={id} name={name} type={type} placeholder={placeholder} value={value}
        className="lg:bg-transparent lg:border-gray-300 bg-slate-200 w-full border-2 p-2 rounded-md outline-none focus:border-green-700" />
    </div>
    </>
  )
}

export default InputField
