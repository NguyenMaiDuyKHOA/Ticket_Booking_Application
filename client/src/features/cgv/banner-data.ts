type BannerId = "movie-1" | "event-1";

type BannerItem = {
    ctaText: string;
    description: string;
    fallbackColor: string;
    href: string;
    id: BannerId;
    image: string;
    meta?: {
        date?: string;
        location?: string;
        score?: number;
    };
    title: string;
};

export const banners: BannerItem[] = [
    {
        id: "movie-1",
        title: "Avengers",
        description: "Epic Marvel movie",
        image: "/Poster/Thor_poster_cgv.jpg",
        fallbackColor: "#111827",
        ctaText: "Book Now",
        href: "/cgv/orbit",
        meta: { score: 8.5 },
    },
    {
        id: "event-1",
        title: "Music Festival",
        description: "Live concert night",
        image: "/event/musicfes.jpg",
        fallbackColor: "#7c3aed",
        ctaText: "Get Ticket",
        href: "/events/1",
        meta: { date: "20/05" },
    },
];
