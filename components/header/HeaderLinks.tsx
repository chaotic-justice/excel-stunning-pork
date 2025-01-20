import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import React from "react"
import { BsGithub, BsSpotify } from "react-icons/bs"
import type { Session } from "next-auth"
import { getInitials } from "@/lib/utils"
import { safeSignout } from "@/actions/auth"
import { useTranslations } from "next-intl"

const headerLinks = [
  {
    name: "repo",
    href: "https://github.com/chaotic-justice/excel-stunning-pork",
    icon: BsGithub,
  },
  { name: "spotify", href: "https://open.spotify.com/", icon: BsSpotify },
]

type Props = {
  session: Session | null
}

const HeaderLinks = ({ session }: Props) => {
  const t = useTranslations("Index")

  return (
    <div className="flex flex-row items-center gap-x-5">
      {headerLinks.map((link) => (
        <Link key={link.name} href={link.href} target="_blank" rel="noopener norefferer nofollow" className="flex max-w-[24px] flex-col items-center justify-center">
          {link.icon && React.createElement(link.icon, { className: "text-lg" })}
        </Link>
      ))}
      {/* <Link href={"/images-uploader"}>docu center</Link> */}
      {session && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              {<AvatarImage src={session.user.image!} />}
              <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={safeSignout}>{t("logout")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
export default HeaderLinks
