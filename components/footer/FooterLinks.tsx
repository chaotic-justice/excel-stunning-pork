import Link from "next/link";
import React from "react";
import { BsGithub } from "react-icons/bs"
import { MdEmail } from "react-icons/md"

const footerLinks = [
  { name: "email", href: "mailto:deepocean.2900@gmail.com", icon: MdEmail },
  { name: "github", href: "https://github.com/chaotic-justice/", icon: BsGithub },
]

const FooterLinks = () => {
  return (
    <div className="mx-auto flex flex-row items-center pb-2">
      {footerLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
        >
          {link.icon &&
            React.createElement(link.icon, { className: "text-lg" })}
        </Link>
      ))}
    </div>
  );
};

export default FooterLinks;
