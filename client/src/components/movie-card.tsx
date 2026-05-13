"use client";

import Image from "next/image";
import { Clock3, Star } from "lucide-react";

import { Link } from "@/i18n/navigation";

interface MovieCardProps {
    id: string;
    title: string;
    genre: string;
    duration: string;
    age: string;
    format: string;
    score: string;
    posterImage: string;
    isActive: boolean;
    ariaLabel: string;
    href?: string;
    onClick?: () => void;
}

export function MovieCard({
    id,
    title,
    genre,
    duration,
    age,
    format,
    score,
    posterImage,
    isActive,
    ariaLabel,
    href,
    onClick,
}: MovieCardProps) {
    const cardClassName = `block rounded-lg border bg-white p-2 text-left shadow-sm transition ${isActive
        ? "border-red-700 ring-2 ring-red-700/20"
        : "border-black/10 hover:border-neutral-400"
        }`;
    const cardContent = (
        <>
            <div className="flex items-center justify-center">
                <Image
                    src={posterImage}
                    alt=""
                    width={185}
                    height={260}
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 33vw, calc(100vw - 56px)"
                    className="object-contain rounded-lg drop-shadow-2xl"
                    aria-hidden="true"
                />
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-black text-neutral-950">{title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{genre}</p>
                </div>
                <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-black text-neutral-700">
                    {age}
                </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-neutral-600">
                <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                    {duration}
                </span>
                <span className="rounded-md bg-teal-50 px-2 py-1 text-teal-800">
                    {format}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-amber-800">
                    <Star className="h-3.5 w-3.5" aria-hidden="true" />
                    {score}
                </span>
            </div>
        </>
    );

    if (href) {
        return (
            <Link key={id} href={href} aria-label={ariaLabel} className={cardClassName}>
                {cardContent}
            </Link>
        );
    }

    return (
        <button
            key={id}
            type="button"
            aria-label={ariaLabel}
            aria-pressed={isActive}
            onClick={onClick}
            className={cardClassName}
        >
            {cardContent}
        </button>
    );
}
