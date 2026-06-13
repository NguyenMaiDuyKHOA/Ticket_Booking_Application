import type { Locale } from "@/i18n/routing";

export type ItemType = "cgv" | "event" | "concert" | "tour";

export type ItemDetail = {
  age?: string;
  ctaHref: string;
  duration?: string;
  facts: Array<{
    label: string;
    value: string;
  }>;
  format?: string;
  genres: string[];
  id: string;
  image: string;
  location?: string;
  priceLabel: string;
  score: string;
  startDate?: string;
  subtitle: string;
  summary: string;
  title: string;
  type: ItemType;
};

type LocalizedItemDetail = Omit<ItemDetail, "genres" | "id" | "type"> & {
  genre: string;
};

const localizedItems: Record<ItemType, Record<string, Record<Locale, LocalizedItemDetail>>> = {
  cgv: {
    orbit: {
      en: {
        title: "Perfume - The Story of a Murderer",
        subtitle: "A dark mystery drama with premium cinema formats.",
        summary:
          "Follow a tense story built for a focused cinema night, with showtimes, seats and combos ready in the booking flow.",
        genre: "Mystery drama",
        duration: "126 min",
        age: "T13",
        format: "IMAX 2D",
        score: "4.8",
        priceLabel: "From 115,000 VND",
        image: "/Poster/Perfume_poster.jpg",
        ctaHref: "/cgv",
        facts: [
          { label: "Cinema", value: "Galaxy Nguyen Du" },
          { label: "Format", value: "IMAX 2D" },
          { label: "Seat flow", value: "Reserved seating" },
        ],
      },
      vi: {
        title: "Perfume - The Story of a Murderer",
        subtitle: "Phim bí ẩn có không khí đậm đặc cho màn ảnh lớn.",
        summary:
          "Theo dõi câu chuyện căng thẳng với suất chiếu, ghế và combo sẵn sàng trong luồng đặt vé",
        genre: "Chinh kich bi ẩn",
        duration: "126 phút",
        age: "T13",
        format: "IMAX 2D",
        score: "4.8",
        priceLabel: "Từ 115.000 VND",
        image: "/Poster/Perfume_poster.jpg",
        ctaHref: "/cgv",
        facts: [
          { label: "Rạp", value: "Galaxy Nguyen Du" },
          { label: "Định dạng", value: "IMAX 2D" },
          { label: "Ghế", value: "Đặt ghế trước" },
        ],
      },
    },
    saigon: {
      en: {
        title: "Premonicao 5",
        subtitle: "A dramatic feature for a focused evening showtime.",
        summary:
          "Review the movie details before choosing a date, time, seat and checkout options on the CGV booking page.",
        genre: "Drama romance",
        duration: "108 min",
        age: "T16",
        format: "2D",
        score: "4.6",
        priceLabel: "From 95,000 VND",
        image: "/Poster/Premonicao5_Poster.jpg",
        ctaHref: "/cgv",
        facts: [
          { label: "Cinema", value: "Galaxy Nguyen Du" },
          { label: "Format", value: "2D" },
          { label: "Best for", value: "Evening plans" },
        ],
      },
      vi: {
        title: "Premonicao 5",
        subtitle: "Lựa chọn tình cảm chính kịch cho suất chiếu tối.",
        summary:
          "Xem thông tin phim trước khi chọn ngày, suất, ghế và thanh toán trên trang đặt vé CGV.",
        genre: "Tình cảm chính kịch",
        duration: "108 phút",
        age: "T16",
        format: "2D",
        score: "4.6",
        priceLabel: "Từ 95.000 VND",
        image: "/Poster/Premonicao5_Poster.jpg",
        ctaHref: "/cgv",
        facts: [
          { label: "Rạp", value: "Galaxy Nguyễn Du" },
          { label: "Định dạng", value: "2D" },
          { label: "Phù hợp", value: "Kế hoạch buổi tối" },
        ],
      },
    },
    midnight: {
      en: {
        title: "Thor - The Dark World",
        subtitle: "Action spectacle with Dolby Atmos sound.",
        summary:
          "A premium action pick for viewers who want high-energy visuals, sharp sound and fast seat selection.",
        genre: "Action thriller",
        duration: "117 min",
        age: "T18",
        format: "Dolby Atmos",
        score: "4.7",
        priceLabel: "From 125,000 VND",
        image: "/Poster/Thor_poster_cgv.jpg",
        ctaHref: "/cgv",
        facts: [
          { label: "Sound", value: "Dolby Atmos" },
          { label: "Cinema", value: "Galaxy Nguyen Du" },
          { label: "Audience", value: "Action fans" },
        ],
      },
      vi: {
        title: "Thor - The Dark World",
        subtitle: "Phim hành động với âm thanh Dolby Atmos.",
        summary:
          "Lựa chọn hành động cho người xem cần hình ảnh mạnh, âm thanh dày và chọn ghế nhanh.",
        genre: "Hành động giật gân",
        duration: "117 phút",
        age: "T18",
        format: "Dolby Atmos",
        score: "4.7",
        priceLabel: "Từ 125.000 VND",
        image: "/Poster/Thor_poster_cgv.jpg",
        ctaHref: "/cgv",
        facts: [
          { label: "Âm thanh", value: "Dolby Atmos" },
          { label: "Rạp", value: "Galaxy Nguyễn Du" },
          { label: "Khách xem", value: "Fan hành động" },
        ],
      },
    },
    thewind: {
      en: {
        title: "Zoologico",
        subtitle: "Family-friendly adventure with bright visual energy.",
        summary:
          "A flexible movie choice for groups and families who want an easy booking flow and accessible showtimes.",
        genre: "Family animation",
        duration: "117 min",
        age: "T13",
        format: "2D",
        score: "4.7",
        priceLabel: "From 125,000 VND",
        image: "/Poster/Zoologico_poster.jpg",
        ctaHref: "/cgv",
        facts: [
          { label: "Audience", value: "Families" },
          { label: "Format", value: "2D" },
          { label: "Checkout", value: "Tickets and combos" },
        ],
      },
      vi: {
        title: "Zoologico",
        subtitle: "Phim gia đình với hình ảnh tươi sáng.",
        summary:
          "Lựa chọn linh hoạt cho nhóm và gia đình cần luồng đặtt vé đơn giản, để chọn suất.",
        genre: "Hoạt hình gia đình",
        duration: "117 phút",
        age: "T13",
        format: "2D",
        score: "4.7",
        priceLabel: "Từ 125.000 VND",
        image: "/Poster/Zoologico_poster.jpg",
        ctaHref: "/cgv",
        facts: [
          { label: "Khách xem", value: "Gia đình" },
          { label: "Định dạng", value: "2D" },
          { label: "Thanh toán", value: "Vé và combo" },
        ],
      },
    },
  },
  event: {
    festival: {
      en: {
        title: "Music Festival",
        subtitle: "Outdoor live stage with a multi-artist program.",
        summary:
          "Check event details, timing and venue information before moving into ticket selection.",
        genre: "Live event",
        location: "District 1, Ho Chi Minh City",
        score: "9.3",
        priceLabel: "Sale off 50%",
        image: "/event/musicfes.jpg",
        ctaHref: "/",
        facts: [
          { label: "Date", value: "20/05" },
          { label: "Venue", value: "Central outdoor stage" },
          { label: "Entry", value: "QR ticket" },
        ],
      },
      vi: {
        title: "Music Festival",
        subtitle: "Sân khấu ngoài trời với nhiều nghệ sĩ.",
        summary:
          "Xem thông tin sự kiện, thời gian và địa điểm trước khi chọn vé.",
        genre: "Sự kiện trực tiếp",
        location: "Quận 1, TP. Hồ Chí Minh",
        score: "9.3",
        priceLabel: "Từ 390.000 VND",
        image: "/event/musicfes.jpg",
        ctaHref: "/",
        facts: [
          { label: "Ngày", value: "20/05" },
          { label: "Địa điểm", value: "Sân khấu ngoài trời trung tâm" },
          { label: "Vào cổng", value: "Vé QR" },
        ],
      },
    },
    expo: {
      en: {
        title: "Creator Expo",
        subtitle: "Business exhibition for creators and teams.",
        summary:
          "Browse the exhibition profile and prepare your ticket selection for a full-day creator event.",
        genre: "Exhibition",
        location: "Convention center",
        score: "8.9",
        priceLabel: "From 250,000 VND",
        image: "/event/expo.jpg",
        ctaHref: "/",
        facts: [
          { label: "Format", value: "Expo" },
          { label: "Access", value: "One-day pass" },
          { label: "Audience", value: "Creators" },
        ],
      },
      vi: {
        title: "Creator Expo",
        subtitle: "Triễn lãm kinh doanh cho creator và team.",
        summary:
          "Xem hồ sơ triễn lãm và chuẩn bị chọn vé cho sự kiện creator cả ngày.",
        genre: "Triễn lãm",
        location: "Trung tâm hội nghị",
        score: "8.9",
        priceLabel: "Tù 250.000 VND",
        image: "/event/expo.jpg",
        ctaHref: "/",
        facts: [
          { label: "Định dạng", value: "Expo" },
          { label: "Quyền vào", value: "Ve mot ngay" },
          { label: "Khách", value: "Creator" },
        ],
      },
    },
    workshop: {
      en: {
        title: "Design Workshop",
        subtitle: "Practical skill building in a compact session.",
        summary:
          "Review the session structure, venue and ticket details for a focused learning event.",
        genre: "Workshop",
        location: "Creative hub",
        score: "8.6",
        priceLabel: "From 180,000 VND",
        image: "/event/workshop.jpg",
        ctaHref: "/",
        facts: [
          { label: "Duration", value: "3 hours" },
          { label: "Seat", value: "Limited capacity" },
          { label: "Level", value: "Intermediate" },
        ],
      },
      vi: {
        title: "Design Workshop",
        subtitle: "Buổi học thực hành trong thời lượng gọn.",
        summary:
          "Xem cấu trúc buổi học, địa điểm và thông tin về chỗ sự kiện học tập tập trung.",
        genre: "Workshop",
        location: "Creative hub",
        score: "8.6",
        priceLabel: "Từ 180.000 VND",
        image: "/event/workshop.jpg",
        ctaHref: "/",
        facts: [
          { label: "Thời lượng", value: "3 giờ" },
          { label: "Chỗ", value: "Số lượng giới hạn" },
          { label: "Cấp độ", value: "Trung cấp" },
        ],
      },
    },
  },
  concert: {
    arena: {
      en: {
        title: "Arena Night",
        subtitle: "Main-stage concert with premium sound.",
        summary:
          "Explore the concert profile, venue details and ticket tiers before checkout.",
        genre: "Concert",
        location: "City arena",
        score: "9.6",
        priceLabel: "From 690,000 VND",
        image: "/cart.png",
        ctaHref: "/",
        facts: [
          { label: "Stage", value: "Main arena" },
          { label: "Entry", value: "Digital ticket" },
          { label: "Doors", value: "18:00" },
        ],
      },
      vi: {
        title: "Arena Night",
        subtitle: "Concert sân khấu lớn với âm thanh cao cấp.",
        summary:
          "Xem thông tin concert, địa điểm và hạng vé trước khi thanh toán.",
        genre: "Concert",
        location: "City arena",
        score: "9.6",
        priceLabel: "Từ 690.000 VND",
        image: "/cart.png",
        ctaHref: "/",
        facts: [
          { label: "Sân khấu", value: "Main arena" },
          { label: "Vào cổng", value: "Vé điện tử" },
          { label: "Mở cổng", value: "18:00" },
        ],
      },
    },
    acoustic: {
      en: {
        title: "Acoustic Session",
        subtitle: "An intimate concert for a smaller audience.",
        summary:
          "Review the seating style and session details for a calmer live music night.",
        genre: "Acoustic show",
        location: "Studio stage",
        score: "9.0",
        priceLabel: "From 320,000 VND",
        image: "/bell.png",
        ctaHref: "/",
        facts: [
          { label: "Capacity", value: "Small room" },
          { label: "Style", value: "Seated" },
          { label: "Doors", value: "19:00" },
        ],
      },
      vi: {
        title: "Acoustic Session",
        subtitle: "Đêm nhạc gần gũi cho khán giả trẻ.",
        summary:
          "Xem kiểu chỗ ngồi và thông tin chương trình cho một đêm nhạc nhẹ hơn.",
        genre: "Acoustic show",
        location: "Studio stage",
        score: "9.0",
        priceLabel: "Từ 320.000 VND",
        image: "/bell.png",
        ctaHref: "/",
        facts: [
          { label: "Sức chứa", value: "Phòng nhỏ" },
          { label: "Kiểu", value: "Ngồi" },
          { label: "Mở cổng", value: "19:00" },
        ],
      },
    },
    festival: {
      en: {
        title: "Sound Festival",
        subtitle: "Multi-artist lineup for a full live music day.",
        summary:
          "Scan the headline details and prepare your ticket tier before the festival opens.",
        genre: "Music festival",
        location: "Outdoor venue",
        score: "8.7",
        priceLabel: "From 520,000 VND",
        image: "/event/musicfes.jpg",
        ctaHref: "/",
        facts: [
          { label: "Lineup", value: "Multi-artist" },
          { label: "Format", value: "Outdoor" },
          { label: "Access", value: "Day pass" },
        ],
      },
      vi: {
        title: "Sound Festival",
        subtitle: "Lineup nhiều nghệ sĩ cho cả ngày âm nhạc.",
        summary:
          "Xem thông tin nổi bật và chuẩn bị hạng vé trước khi festival mỏ bán.",
        genre: "Music festival",
        location: "Địa điểm ngoài trời",
        score: "8.7",
        priceLabel: "Từ 520.000 VND",
        image: "/event/musicfes.jpg",
        ctaHref: "/",
        facts: [
          { label: "Lineup", value: "Nhiều nghệ sĩ" },
          { label: "Định dạng", value: "Ngoài trời" },
          { label: "Quyền vào", value: "Day pass" },
        ],
      },
    },
  },
  tour: {
    saigon: {
      en: {
        title: "Saigon City Tour",
        subtitle: "Half-day city experience through central landmarks.",
        summary:
          "Review the route, timing and pickup notes before choosing a tour ticket.",
        genre: "City tour",
        location: "Ho Chi Minh City",
        score: "9.4",
        priceLabel: "From 450,000 VND",
        image: "/vietnam.png",
        ctaHref: "/",
        facts: [
          { label: "Duration", value: "Half day" },
          { label: "Pickup", value: "District 1" },
          { label: "Group", value: "Small group" },
        ],
      },
      vi: {
        title: "Saigon City Tour",
        subtitle: "Tour nữa ngày qua các điểm trung tâm.",
        summary:
          "Xem lộ trình, thời gian và ghi chú đón khách trước khi chọn vé tour.",
        genre: "City tour",
        location: "TP. Hồ Chí Minh",
        score: "9.4",
        priceLabel: "Từ 450.000 VND",
        image: "/vietnam.png",
        ctaHref: "/",
        facts: [
          { label: "Thời lượng", value: "Nữa ngày" },
          { label: "Đón khách", value: "Quận 1" },
          { label: "Nhóm", value: "Nhóm nhỏ" },
        ],
      },
    },
    heritage: {
      en: {
        title: "Heritage Walk",
        subtitle: "Culture route for history and local stories.",
        summary:
          "Explore the route details and meeting point before booking a guided walking tour.",
        genre: "Culture tour",
        location: "Old quarter route",
        score: "9.0",
        priceLabel: "From 280,000 VND",
        image: "/logo.png",
        ctaHref: "/",
        facts: [
          { label: "Duration", value: "2.5 hours" },
          { label: "Guide", value: "Local guide" },
          { label: "Transport", value: "Walking" },
        ],
      },
      vi: {
        title: "Heritage Walk",
        subtitle: "Tuyến văn hóa với lịch sử và câu chuyện địa phương.",
        summary:
          "Xem lộ trình và điểm hẹn trước khi đặt tour đi bộ có hướng dẫn.",
        genre: "Tour văn hóa",
        location: "Tuyến phố cũ",
        score: "9.0",
        priceLabel: "Từ 280.000 VND",
        image: "/logo.png",
        ctaHref: "/",
        facts: [
          { label: "Thời lượng", value: "2.5 giờ" },
          { label: "Hướng dẫn", value: "Hướng dẫn địa phương" },
          { label: "Phương tiện", value: "Đi bộ" },
        ],
      },
    },
    food: {
      en: {
        title: "Street Food Tour",
        subtitle: "Evening tasting route through local favorites.",
        summary:
          "Check the tasting stops, timing and group notes before reserving your food tour ticket.",
        genre: "Food tour",
        location: "Evening city route",
        score: "8.8",
        priceLabel: "From 520,000 VND",
        image: "/cart.png",
        ctaHref: "/",
        facts: [
          { label: "Stops", value: "5 tastings" },
          { label: "Time", value: "Evening" },
          { label: "Group", value: "Small group" },
        ],
      },
      vi: {
        title: "Street Food Tour",
        subtitle: "Tuyến ăn tối qua các món địa phương.",
        summary:
          "Xem các điểm dừng, thời gian và ghi chú nhóm trước khi đặt vé food tour.",
        genre: "Food tour",
        location: "Tuyến buổi tối",
        score: "8.8",
        priceLabel: "Từ 520.000 VND",
        image: "/cart.png",
        ctaHref: "/",
        facts: [
          { label: "Điểm dừng", value: "5 món thử" },
          { label: "Thời gian", value: "Buổi tối" },
          { label: "Nhóm", value: "Nhóm nhỏ" },
        ],
      },
    },
  },
};

export function getItemsByType(
  type: ItemType,
  locale: Locale
) {
  return Object.entries(localizedItems[type]).map(
    ([id, item]) => toItemDetail(id, type, item[locale] ?? item.en)
  );
}

// Lists every static item detail route available in the frontend catalog.
export function getItemDetailPaths() {
  return Object.entries(localizedItems).flatMap(([type, items]) =>
    Object.keys(items).map((id) => ({
      itemId: id,
      itemType: type as ItemType,
    })),
  );
}

// Resolves one localized detail item and falls back to English when needed.
export function getItemDetail(type: string, id: string, locale: Locale): ItemDetail | null {
  if (!isItemType(type)) {
    return null;
  }

  const item = localizedItems[type][id];
  const localizedItem = item?.[locale] ?? item?.en;

  if (!localizedItem) {
    return null;
  }

  return {
    ...toItemDetail(id, type, localizedItem),
  };
}

function toItemDetail(id: string, type: ItemType, item: LocalizedItemDetail): ItemDetail {
  const { genre, ...detail } = item;

  return {
    ...detail,
    genres: [genre],
    id,
    type,
  };
}

// Guards route params before rendering the shared detail page.
export function isItemType(type: string): type is ItemType {
  return ["cgv", "event", "concert", "tour"].includes(type);
}
