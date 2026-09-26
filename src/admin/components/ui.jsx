export function Field({ label, children, hint, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="text-xs text-muted block mb-1">{label}</label>}
      {children}
      {hint && <p className="text-[11px] text-muted mt-1">{hint}</p>}
    </div>
  )
}

export function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-acc1 ${className}`}
    />
  )
}

export function TextArea({ className = '', ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-sm min-h-[90px] focus:outline-none focus:border-acc1 ${className}`}
    />
  )
}

const buttonVariants = {
  primary: 'bg-grad text-white',
  ghost: 'border border-border text-muted hover:text-white hover:border-acc1',
  danger: 'border border-red-500/40 text-red-400 hover:bg-red-500/10',
}

export function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      {...props}
      className={`text-sm px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${buttonVariants[variant]} ${className}`}
    />
  )
}

export function Card({ children, className = '' }) {
  return <div className={`bg-surface border border-border rounded-2xl p-6 ${className}`}>{children}</div>
}

export function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="font-head text-2xl font-semibold">{title}</h1>
        {description && <p className="text-muted text-sm mt-1">{description}</p>}
      </div>
      {action}
    </div>
  )
}
