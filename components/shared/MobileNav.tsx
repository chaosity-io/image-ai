'use client'

import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet"

import { navLinks } from '@/constants'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import menuIcon from '../../public/assets/icons/menu.svg'
import logoText from '../../public/assets/images/logo-text.svg'
import { Button } from "../ui/button"

const MobileNav = () => {
    const pathname = usePathname();
    return (
        <header className='header'>
            <Link href="/" className="flex items-center gap-2 md:py-2">
                <Image src={logoText} alt="Logo" className='w-24 h-auto' width={180} height={28} />

            </Link>
            <nav className='flex gap-2'>
                <SignedIn >
                    <UserButton />
                    <Sheet>
                        <SheetTrigger>
                            <Image src={menuIcon} alt="Menu" width={32} height={32} className='cursor-pointer' />
                        </SheetTrigger>
                        <SheetContent className='sheet-content sm:w-64'>
                            <>
                                <Image src={logoText} alt='logo' width={152} height={23} />
                                <ul className='header-nav_elements'>
                                    {navLinks.map((link) => {
                                        const isActive = link.route === pathname;
                                        return (
                                            <li key={link.route} className={`${isActive && 'gradient-text'} p-18 flex whitespace-nowrap text-dark-700`}>
                                                <Link href={link.route} className='sidebar-link'>
                                                    <Image src={link.icon} alt={link.label} width={24} height={24} />
                                                    {link.label}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </>
                        </SheetContent>
                    </Sheet>

                </SignedIn>
                <SignedOut>
                    <Button asChild className='button bg-purple-gradient bg-cover'>
                        <Link href="/sign-in">
                            Login
                        </Link>
                    </Button>
                </SignedOut>
            </nav>



        </header>
    )
}

export default MobileNav