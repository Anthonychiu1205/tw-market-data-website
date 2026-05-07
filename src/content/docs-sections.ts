export type DocSectionLike = {
  id?: string | null;
  label: string;
};

export function cleanTocTitle(title: string) {
  return title.replace(/^\s*\d+[\.、\)]\s*/, "").trim();
}

function slugifySectionTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "");
}

export function normalizeDocsSections<T extends DocSectionLike>(sections: T[]): Array<{ id: string; label: string; raw: T }> {
  const usedIds = new Map<string, number>();

  return sections.map((section) => {
    const cleanedLabel = cleanTocTitle(section.label);
    const preferredId = (section.id ?? "").trim();
    const baseId = preferredId || slugifySectionTitle(cleanedLabel) || "section";
    const duplicateIndex = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, duplicateIndex + 1);
    const resolvedId = duplicateIndex === 0 ? baseId : `${baseId}-${duplicateIndex + 1}`;

    return {
      id: resolvedId,
      label: cleanedLabel || section.label,
      raw: section,
    };
  });
}
