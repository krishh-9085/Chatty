import React from "react";

function ConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmButtonText = "Confirm",
	confirmButtonClass = "btn-error",
}) {
	if (!isOpen) return null;

	return (
		<dialog open className='modal modal-open bg-black/30 backdrop-blur-sm'>
			<div className='modal-box bg-slate-800 border border-slate-700/50'>
				<h3 className='font-bold text-lg text-slate-200'>{title}</h3>
				<p className='py-4 text-slate-400'>{message}</p>
				<div className='modal-action'>
					<button onClick={onClose} className='btn btn-ghost text-slate-400 hover:bg-slate-700 hover:text-slate-200'>
						Cancel
					</button>
					<button onClick={onConfirm} className={`btn ${confirmButtonClass} text-white`}>
						{confirmButtonText}
					</button>
				</div>
			</div>
		</dialog>
	);
}

export default ConfirmationModal;