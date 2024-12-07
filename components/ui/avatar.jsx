import Image from "next/image"

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12"
}

export function Avatar({ src, alt, size = "md" }) {
  return (
    <div className={`relative rounded-full overflow-hidden ${sizeClasses[size]}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  )
}

