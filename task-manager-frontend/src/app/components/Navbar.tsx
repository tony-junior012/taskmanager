"use client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    return (
        <nav className="bg-sky-200 text-gray-800 p-4 shadow-md sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <Image
                    className="fill-white"
                    src="/favicon.svg"
                    alt="Ícone da aplicação"
                    width={40}
                    height={40}
                />
                <ul className="flex space-x-4">
                    <li><Link href="/" className="hover:underline">Home</Link></li>
                    <li><Link href="/tasks" className="hover:underline">Tarefas</Link></li>
                </ul>
            </div>
        </nav>
    );
}