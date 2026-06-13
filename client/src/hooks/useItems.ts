import { useEffect, useMemo, useState } from "react";

import type { ItemResponse } from "@/lib/items-api";
import type { ItemTypeOption } from "@/lib/item-types-api";

import { itemService } from "@/features/admin/services/item.service";

export function useItems() {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemTypeOption[]>([]);
  const [selectedItemTypeId, setSelectedItemTypeId] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const selectedItemType = useMemo(
    () => itemTypes.find((itemType) => itemType.id === selectedItemTypeId) ?? null,
    [itemTypes, selectedItemTypeId],
  );

  async function refreshItems(itemType = selectedItemType) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await itemService.getItems({ itemTypeSlug: itemType?.slug, page: 1, pageSize: 100 });
      setItems(result.items);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load items.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setErrorMessage(null);

    itemService
      .getItemTypes()
      .then(async (types) => {
        const result = await itemService.getItems({ page: 1, pageSize: 100 });

        if (!isMounted) {
          return;
        }

        setItemTypes(types);
        setSelectedItemTypeId("");
        setItems(result.items);
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load items.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (itemTypes.length === 0) {
      return;
    }

    void refreshItems();
  }, [selectedItemTypeId]);

  return {
    errorMessage,
    isLoading,
    items,
    itemTypes,
    refreshItems,
    selectedItemType,
    selectedItemTypeId,
    setSelectedItemTypeId,
  };
}
