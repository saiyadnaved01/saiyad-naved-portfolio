export default function Modal({ open, onClose, children, maxWidth = 'max-w-lg' }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/75 backdrop-blur-sm p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-surface border border-border rounded-2xl w-full ${maxWidth} p-8 max-h-[85vh] overflow-auto`}>
        <button
          className="float-right text-muted text-xl leading-none hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}
