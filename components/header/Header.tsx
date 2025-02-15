import { auth } from "@/auth"
import HeaderLinks from "@/components/header/HeaderLinks"
import { siteConfig } from "@/config/site"
import Image from "next/image"
import Link from "next/link"

const Header = async () => {
  const session = await auth()

  return (
    <header className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/" className="flex items-center space-x-1 font-bold">
              <Image alt={siteConfig.name} src="/logo.svg" className="w-8 h-8" width={32} height={32} />
              <span className="text-gray-950 dark:text-gray-300">Excel Peachy</span>
            </Link>
            <div className="hidden md:flex md:gap-x-6"></div>
          </div>

          <div className="flex items-center gap-x-5 md:gap-x-8">
            <HeaderLinks session={session} />
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
