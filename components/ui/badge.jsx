const statusClasses = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-red-100 text-red-700"
}

const dotClasses = {
  active: "bg-green-500",
  inactive: "bg-red-500"
}

export function Badge({ status, label }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotClasses[status]}`} />
      {label}
    </span>
  )
}

