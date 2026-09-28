import { Centered } from "@/components/centered"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Centered>{children}</Centered>
}
