export default function EmptyState({title,description,buttonText,onClick,children}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="mt-2 text-gray-600">{description}</p>
        )}
        {buttonText && onClick && (
          <button
            onClick={onClick}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {buttonText}
          </button>
        )}
      </div>
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  )
}
