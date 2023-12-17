import React from 'react'

interface Props {
    header: string,
    text: string,
    onCancel: React.MouseEventHandler<HTMLButtonElement>,
    onConfirm: React.MouseEventHandler<HTMLButtonElement>
}

const ConfirmModal = (props: Props) => {
    const {header, text, onCancel, onConfirm} = props;
    return (
        <>
            <dialog id="my_modal_1" className="modal modal-open">
                <div className="modal-box bg-gray-100">
                    <h3 className="font-bold lg:text-lg text-base text-green-700">{header}</h3>
                    <p className="py-4 lg:text-base text-sm" dangerouslySetInnerHTML={{__html: text}}/>
                    <div className="modal-action">
                        <button className="btn bg-transparent text-green-700 border-gray-300 hover:bg-green-700 hover:text-white hover:border-green-700"
                            onClick={onCancel}>Cancel</button>
                        <button className='btn bg-transparent text-green-700 border-gray-300 hover:bg-green-700 hover:text-white hover:border-green-700'
                            onClick={onConfirm}>Confirm</button>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default ConfirmModal
