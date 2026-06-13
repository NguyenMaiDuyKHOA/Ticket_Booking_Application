import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { useToast } from "@/components/toast";
import type { CityOption } from "@/lib/cities-api";
import type { GenreOption } from "@/lib/genres-api";
import type { HallTypeOption } from "@/lib/hall-types-api";
import type { ItemStatusOption } from "@/lib/item-statuses-api";
import type { ItemTypeOption } from "@/lib/item-types-api";

import { itemService } from "@/features/admin/services/item.service";
import { useMetadata } from "./useMetadata";
import {
  createSlug,
  getNonNegativePrice,
  isRichTextEmpty,
  isValidJsonObject,
  normalizeNonNegativeNumberInput,
  revokeObjectUrl,
} from "@/features/admin/utils/item-form";

type UseItemFormOptions = {
  cities: CityOption[];
  genres: GenreOption[];
  hallTypes: HallTypeOption[];
  itemStatus: ItemStatusOption | null;
  managedType: ItemTypeOption | null;
};

export function useItemForm({ cities, genres, hallTypes, itemStatus, managedType }: UseItemFormOptions) {
  const t = useTranslations("Admin");
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [price, setPrice] = useState("");
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterUrl, setPosterUrl] = useState("");
  const [posterPreviewUrl, setPosterPreviewUrl] = useState("");
  const [uploadingField, setUploadingField] = useState<"image" | "poster" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const metadata = useMetadata(managedType?.slug, hallTypes);

  useEffect(() => {
    return () => {
      revokeObjectUrl(imagePreviewUrl);
      revokeObjectUrl(posterPreviewUrl);
    };
  }, [imagePreviewUrl, posterPreviewUrl]);

  const { eventMetadata, setEventMetadata } = metadata;

  useEffect(() => {
    if (eventMetadata.cityId || cities.length === 0) {
      return;
    }

    setEventMetadata({
      ...eventMetadata,
      cityId: cities[0]?.id ?? "",
    });
  }, [cities, eventMetadata, setEventMetadata]);

  const filteredGenres = useMemo(
    () => genres.filter((genre) => genre.itemTypeId === managedType?.id),
    [genres, managedType?.id],
  );

  useEffect(() => {
    setSelectedGenreIds((currentGenreIds) =>
      currentGenreIds.filter((genreId) => filteredGenres.some((genre) => genre.id === genreId)),
    );
  }, [filteredGenres]);

  const priceError = Number(price || 0) < 0 ? t("errors.priceNonNegative") : null;

  const itemPayloadPreview = useMemo(
    () =>
      JSON.stringify(
        {
          title,
          slug,
          itemTypeId: managedType?.id ?? "",
          itemTypeSlug: managedType?.slug ?? "",
          itemStatusId: itemStatus?.id ?? "",
          itemStatusSlug: itemStatus?.slug ?? "",
          genreIds: selectedGenreIds,
          genreSlugs: filteredGenres.filter((genre) => selectedGenreIds.includes(genre.id)).map((genre) => genre.slug),
          description,
          startDate,
          price: getNonNegativePrice(price),
          imageUrl,
          posterUrl,
          metadata: JSON.parse(metadata.metadataJson),
        },
        null,
        2,
      ),
    [description, filteredGenres, imageUrl, itemStatus?.id, itemStatus?.slug, managedType?.id, managedType?.slug, metadata.metadataJson, posterUrl, price, selectedGenreIds, slug, startDate, title],
  );

  function handleImageChange(event: ChangeEvent<HTMLInputElement>, field: "image" | "poster") {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (field === "image") {
      setImageFile(file);
      setImageUrl("");
      setImagePreviewUrl((currentPreviewUrl) => {
        revokeObjectUrl(currentPreviewUrl);
        return previewUrl;
      });
      return;
    }

    setPosterFile(file);
    setPosterUrl("");
    setPosterPreviewUrl((currentPreviewUrl) => {
      revokeObjectUrl(currentPreviewUrl);
      return previewUrl;
    });
  }

  function handleImageUrlChange(event: ChangeEvent<HTMLInputElement>, field: "image" | "poster") {
    const nextUrl = event.target.value.trim();

    if (field === "image") {
      setImageUrl(nextUrl);
      setImageFile(null);
      setImagePreviewUrl((currentPreviewUrl) => {
        revokeObjectUrl(currentPreviewUrl);
        return "";
      });
      return;
    }

    setPosterUrl(nextUrl);
    setPosterFile(null);
    setPosterPreviewUrl((currentPreviewUrl) => {
      revokeObjectUrl(currentPreviewUrl);
      return "";
    });
  }

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextTitle = event.target.value;
    setTitle(nextTitle);

    if (!isSlugManuallyEdited) {
      setSlug(createSlug(nextTitle));
    }
  }

  function handleSlugChange(event: ChangeEvent<HTMLInputElement>) {
    const nextSlug = createSlug(event.target.value);
    setSlug(nextSlug);
    setIsSlugManuallyEdited(nextSlug.length > 0);
  }

  function handleGenreToggle(genreId: string) {
    setSelectedGenreIds((currentGenreIds) =>
      currentGenreIds.includes(genreId)
        ? currentGenreIds.filter((currentGenreId) => currentGenreId !== genreId)
        : [...currentGenreIds, genreId],
    );
  }

  async function handleCreateItem() {
    if (!managedType) {
      showToast({ message: t("errors.itemTypeRequired"), type: "error" });
      return;
    }

    if (!itemStatus) {
      showToast({ message: t("errors.statusRequired"), type: "error" });
      return;
    }

    if (!title.trim() || !slug.trim() || !startDate || isRichTextEmpty(description)) {
      showToast({ message: t("errors.requiredFields"), type: "error" });
      return;
    }

    if (priceError) {
      showToast({ message: priceError, type: "error" });
      return;
    }

    if (managedType.slug !== "cinema" && managedType.slug !== "event" && !isValidJsonObject(metadata.genericMetadata)) {
      showToast({ message: t("metadata.invalidJson"), type: "error" });
      return;
    }

    if (managedType.slug === "cinema" && metadata.cinemaMetadata.supportedHallTypeIds.length === 0) {
      showToast({ message: "Vui lòng chọn ít nhất một định dạng phòng chiếu.", type: "error" });
      return;
    }

    try {
      setIsSubmitting(true);
      let nextImageUrl = imageUrl;
      let nextPosterUrl = posterUrl;

      // Upload is intentionally delayed until submit, so changing previews does not create orphan Cloudinary assets.
      if (imageFile) {
        setUploadingField("image");
        const result = await itemService.uploadImage(imageFile, managedType.slug);
        nextImageUrl = result.secureUrl;
        setImageUrl(nextImageUrl);
        setImageFile(null);
        setImagePreviewUrl((currentPreviewUrl) => {
          revokeObjectUrl(currentPreviewUrl);
          return "";
        });
      }

      if (posterFile) {
        setUploadingField("poster");
        const result = await itemService.uploadImage(posterFile, managedType.slug);
        nextPosterUrl = result.secureUrl;
        setPosterUrl(nextPosterUrl);
        setPosterFile(null);
        setPosterPreviewUrl((currentPreviewUrl) => {
          revokeObjectUrl(currentPreviewUrl);
          return "";
        });
      }

      await itemService.createItem({
        description,
        genreIds: selectedGenreIds,
        imageUrl: nextImageUrl || null,
        itemStatusId: itemStatus.id,
        itemTypeId: managedType.id,
        metadata: metadata.metadataJson,
        posterUrl: nextPosterUrl || null,
        price: getNonNegativePrice(price),
        slug: slug.trim(),
        startDate,
        title: title.trim(),
      });

      resetForm();
      showToast({ message: t("add.createSuccess"), type: "success" });
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : t("add.createError"),
        type: "error",
      });
    } finally {
      setUploadingField(null);
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setTitle("");
    setSlug("");
    setIsSlugManuallyEdited(false);
    setDescription("");
    setStartDate("");
    setPrice("");
    setSelectedGenreIds([]);
    setImageFile(null);
    setImageUrl("");
    setImagePreviewUrl((currentPreviewUrl) => {
      revokeObjectUrl(currentPreviewUrl);
      return "";
    });
    setPosterFile(null);
    setPosterUrl("");
    setPosterPreviewUrl((currentPreviewUrl) => {
      revokeObjectUrl(currentPreviewUrl);
      return "";
    });
    metadata.resetMetadata();
  }

  return {
    description,
    filteredGenres,
    handleCreateItem,
    handleGenreToggle,
    handleImageChange,
    handleImageUrlChange,
    handleSlugChange,
    handleTitleChange,
    imageFile,
    imagePreviewUrl: imagePreviewUrl || imageUrl,
    imageUrl,
    isSubmitting,
    itemPayloadPreview,
    metadata,
    posterFile,
    posterPreviewUrl: posterPreviewUrl || posterUrl,
    posterUrl,
    price,
    priceError,
    selectedGenreIds,
    setDescription,
    setPrice: (value: string) => setPrice(normalizeNonNegativeNumberInput(value)),
    setStartDate,
    slug,
    startDate,
    title,
    uploadingField,
  };
}
