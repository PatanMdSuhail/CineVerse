const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="absolute top-[40%] left-[20%] bg-gray-800 p-6 rounded-lg z-10 text-white text-right">
            <button
              className="text-white font-semibold hover:text-gray-400 focus:outline-none mr-2"
              onClick={onClose}
            >
              X
            </button>
            <div className="mt-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
export default Modal;
